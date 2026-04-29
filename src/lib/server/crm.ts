import type { D1Database } from '@cloudflare/workers-types';
import type { RefUser } from './user-auth';

type CrmResponse = {
	ok?: boolean;
	uid?: string;
	error?: string;
};

function productStatus(user: RefUser) {
	return user.vip_status === 'active' ? 'active' : 'registered';
}

function identities(user: RefUser) {
	return [
		user.wechat
			? {
					provider: 'wechat',
					provider_id: user.wechat,
					label: '微信'
				}
			: null,
		user.telegram
			? {
					provider: 'telegram',
					provider_id: user.telegram,
					label: 'Telegram'
				}
			: null
	].filter(Boolean);
}

function entitlements(user: RefUser) {
	if (user.vip_status !== 'active') return [];
	return [
		{
			product: 'refer',
			entitlement: 'vip',
			status: 'active',
			source: 'manual',
			metadata: {
				started_at: user.vip_started_at
			}
		}
	];
}

export async function syncRefUserToCrm(
	env: App.Platform['env'] | undefined,
	db: D1Database | undefined,
	userId: number,
	event: 'register' | 'login' | 'update_contact' | 'open_vip'
) {
	if (!env?.CRM_API_KEY || !db) return null;

	try {
		const user = await db.prepare('SELECT * FROM ref_users WHERE id = ?').bind(userId).first<RefUser>();
		if (!user?.email) return null;

		const base = env.CRM_API_BASE?.replace(/\/+$/, '');
		if (!base) return null;
		const response = await fetch(`${base}/api/users/upsert`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CRM-API-Key': env.CRM_API_KEY
			},
			body: JSON.stringify({
				uid: user.crm_uid || undefined,
				email: user.email,
				display_name: user.display_name || user.email,
				source: 'refer',
				product: 'refer',
				product_status: productStatus(user),
				role: 'user',
				metadata: {
					sync_event: event,
					ref_user_id: String(user.id),
					vip_status: user.vip_status
				},
				identities: identities(user),
				entitlements: entitlements(user)
			})
		});

		if (!response.ok) {
			console.warn('CRM sync failed', response.status, await response.text());
			return null;
		}

		const result = (await response.json()) as CrmResponse;
		if (result.uid && result.uid !== user.crm_uid) {
			await db
				.prepare('UPDATE ref_users SET crm_uid = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
				.bind(result.uid, user.id)
				.run();
		}
		return result.uid ?? null;
	} catch (error) {
		console.warn('CRM sync failed', error);
		return null;
	}
}
