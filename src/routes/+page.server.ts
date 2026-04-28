import { buildTags, categoryNames, type CategoryName } from '$lib/ref-data';
import { syncRefUserToCrm } from '$lib/server/crm';
import { clearAdminCookie, isAdmin, setAdminCookie } from '$lib/server/auth';
import { dbFromPlatform, listPublicSites } from '$lib/server/db';
import {
	clearUserCookie,
	currentRefUser,
	hashPassword,
	setUserCookie,
	verifyPassword,
	type RefUser
} from '$lib/server/user-auth';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export async function load({ cookies, platform }) {
	const db = dbFromPlatform(platform);
	const loggedIn = await isAdmin(cookies, platform?.env);
	return {
		...(await listPublicSites(db, { includeHidden: loggedIn })),
		loggedIn,
		user: await currentRefUser(cookies, db, platform?.env).then((user) =>
			user
				? {
						id: user.id,
						email: user.email,
						display_name: user.display_name ?? '',
						wechat: user.wechat ?? '',
						telegram: user.telegram ?? '',
						crm_uid: user.crm_uid ?? '',
						vip_status: user.vip_status,
						vip_started_at: user.vip_started_at ?? ''
					}
				: null
		),
		configured: Boolean(platform?.env?.ADMIN_PASSWORD),
		hasDb: Boolean(db)
	};
}

function text(form: FormData, key: string) {
	return String(form.get(key) ?? '').trim();
}

function intValue(form: FormData, key: string, fallback = 0) {
	const parsed = Number.parseInt(text(form, key), 10);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function boolValue(form: FormData, key: string) {
	return form.get(key) === 'on' || form.get(key) === '1';
}

function emailValue(form: FormData) {
	return text(form, 'email').toLowerCase();
}

function tagsValue(form: FormData) {
	return text(form, 'tags')
		.split(/[,，\n]/)
		.map((tag) => tag.trim())
		.filter(Boolean)
		.slice(0, 8);
}

function categoryValue(form: FormData) {
	return text(form, 'category') || '数字服务与好物';
}

function requireDb(platform: App.Platform | undefined) {
	const db = dbFromPlatform(platform);
	if (!db) {
		throw fail(500, { error: 'D1 数据库还没有绑定，暂时不能保存。' });
	}
	return db;
}

async function requireInlineAdmin(cookies: Parameters<Actions[string]>[0]['cookies'], platform: App.Platform | undefined) {
	if (!(await isAdmin(cookies, platform?.env))) {
		throw fail(401, { error: '请先进入管理模式。' });
	}
}

async function requireRefUser(
	cookies: Parameters<Actions[string]>[0]['cookies'],
	platform: App.Platform | undefined
) {
	const db = requireDb(platform);
	const user = await currentRefUser(cookies, db, platform?.env);
	if (!user) {
		throw fail(401, { error: '请先登录推荐站账号。' });
	}
	return { db, user };
}

async function findUserByEmail(db: NonNullable<ReturnType<typeof dbFromPlatform>>, email: string) {
	return db.prepare('SELECT * FROM ref_users WHERE email = ?').bind(email).first<RefUser>();
}

export const actions: Actions = {
	login: async ({ request, cookies, platform, url }) => {
		const form = await request.formData();
		const password = text(form, 'password');
		const expected = platform?.env?.ADMIN_PASSWORD;

		if (!expected) return fail(400, { error: '还没有配置 ADMIN_PASSWORD。' });
		if (password !== expected) return fail(401, { error: '管理密码不正确。' });

		await setAdminCookie(cookies, platform?.env, url.protocol === 'https:');
		return { success: '已进入管理模式。' };
	},

	logout: async ({ cookies }) => {
		clearAdminCookie(cookies);
		redirect(303, '/');
	},

	registerUser: async ({ request, cookies, platform, url }) => {
		const db = requireDb(platform);
		const form = await request.formData();
		const email = emailValue(form);
		const password = String(form.get('password') ?? '');
		const displayName = text(form, 'display_name');

		if (!email) return fail(400, { error: '请填写邮箱。' });
		if (password.length < 6) return fail(400, { error: '密码至少 6 位。' });

		try {
			await db
				.prepare(
					`INSERT INTO ref_users (email, password_hash, display_name)
					 VALUES (?, ?, ?)`
				)
				.bind(email, await hashPassword(password), displayName)
				.run();
		} catch {
			return fail(409, { error: '这个邮箱已经注册过。' });
		}

		const user = await findUserByEmail(db, email);
		if (!user) return fail(500, { error: '注册成功但读取用户失败，请重新登录。' });
		await syncRefUserToCrm(platform?.env, db, user.id, 'register');
		await setUserCookie(cookies, user, platform?.env, url.protocol === 'https:');
		return { success: '已注册并登录。' };
	},

	loginUser: async ({ request, cookies, platform, url }) => {
		const db = requireDb(platform);
		const form = await request.formData();
		const email = emailValue(form);
		const password = String(form.get('password') ?? '');
		const user = email ? await findUserByEmail(db, email) : null;

		if (!user?.password_hash || !(await verifyPassword(password, user.password_hash))) {
			return fail(401, { error: '邮箱或密码不正确。' });
		}

		await db
			.prepare('UPDATE ref_users SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
			.bind(user.id)
			.run();
		const freshUser = await findUserByEmail(db, email);
		await syncRefUserToCrm(platform?.env, db, user.id, 'login');
		await setUserCookie(cookies, freshUser ?? user, platform?.env, url.protocol === 'https:');
		return { success: '已登录推荐站账号。' };
	},

	logoutUser: async ({ cookies }) => {
		clearUserCookie(cookies);
		return { success: '已退出推荐站账号。' };
	},

	updateContact: async ({ request, cookies, platform }) => {
		const { db, user } = await requireRefUser(cookies, platform);
		const form = await request.formData();
		const email = emailValue(form);
		if (!email) return fail(400, { error: '邮箱不能为空。' });

		try {
			await db
				.prepare(
					`UPDATE ref_users
					 SET email = ?, display_name = ?, wechat = ?, telegram = ?, updated_at = CURRENT_TIMESTAMP
					 WHERE id = ?`
				)
				.bind(email, text(form, 'display_name'), text(form, 'wechat'), text(form, 'telegram'), user.id)
				.run();
		} catch {
			return fail(409, { error: '这个邮箱已经被其他账号使用。' });
		}

		await syncRefUserToCrm(platform?.env, db, user.id, 'update_contact');
		return { success: '联系方式已更新。' };
	},

	openVip: async ({ cookies, platform }) => {
		const { db, user } = await requireRefUser(cookies, platform);
		await db
			.prepare(
				`UPDATE ref_users
				 SET vip_status = 'active',
				     vip_started_at = COALESCE(vip_started_at, CURRENT_TIMESTAMP),
				     updated_at = CURRENT_TIMESTAMP
				 WHERE id = ?`
			)
			.bind(user.id)
			.run();
		await syncRefUserToCrm(platform?.env, db, user.id, 'open_vip');
		return { success: 'VIP 已开通并同步。' };
	},

	createCategory: async ({ request, cookies, platform }) => {
		await requireInlineAdmin(cookies, platform);
		const db = requireDb(platform);
		const form = await request.formData();
		const name = text(form, 'name');
		if (!name) return fail(400, { error: '分类名称不能为空。' });

		await db
			.prepare(
				`INSERT INTO categories (name, description, sort_order)
				 VALUES (?, ?, ?)
				 ON CONFLICT(name) DO UPDATE SET description = excluded.description, sort_order = excluded.sort_order, updated_at = CURRENT_TIMESTAMP`
			)
			.bind(name, text(form, 'description'), intValue(form, 'sort', 100))
			.run();
		return { success: '分类已保存。' };
	},

	createSite: async ({ request, cookies, platform }) => {
		await requireInlineAdmin(cookies, platform);
		const db = requireDb(platform);
		const form = await request.formData();
		const name = text(form, 'name');
		const url = text(form, 'url');
		if (!name) return fail(400, { error: '名称不能为空。' });
		const fallbackTags = buildTags({
			name,
			url,
			desc: text(form, 'desc'),
			catelog: categoryValue(form)
		});
		const tags = tagsValue(form);

		await db
			.prepare(
				`INSERT INTO sites
				 (name, url, logo, catelog, description, sort_order, hidden, category, tags, featured)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(
				name,
				url,
				text(form, 'logo'),
				categoryValue(form),
				text(form, 'desc'),
				intValue(form, 'sort', 100),
				boolValue(form, 'hidden') ? 1 : 0,
				categoryValue(form),
				JSON.stringify(tags.length ? tags : fallbackTags),
				boolValue(form, 'featured') ? 1 : 0
			)
			.run();
		return { success: '推荐已新增。' };
	},

	updateSite: async ({ request, cookies, platform }) => {
		await requireInlineAdmin(cookies, platform);
		const db = requireDb(platform);
		const form = await request.formData();
		const id = intValue(form, 'id');
		if (!id) return fail(400, { error: '缺少推荐 ID。' });

		await db
			.prepare(
				`UPDATE sites
				 SET name = ?, url = ?, logo = ?, catelog = ?, description = ?, sort_order = ?,
				     hidden = ?, category = ?, tags = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
				 WHERE id = ?`
			)
			.bind(
				text(form, 'name'),
				text(form, 'url'),
				text(form, 'logo'),
				categoryValue(form),
				text(form, 'desc'),
				intValue(form, 'sort', 100),
				boolValue(form, 'hidden') ? 1 : 0,
				categoryValue(form),
				JSON.stringify(tagsValue(form)),
				boolValue(form, 'featured') ? 1 : 0,
				id
			)
			.run();
		return { success: '推荐已保存。' };
	},

	removeSite: async ({ request, cookies, platform }) => {
		await requireInlineAdmin(cookies, platform);
		const db = requireDb(platform);
		const form = await request.formData();
		const id = intValue(form, 'id');
		if (!id) return fail(400, { error: '缺少推荐 ID。' });
		await db.prepare('DELETE FROM sites WHERE id = ?').bind(id).run();
		return { success: '推荐已删除。' };
	}
};
