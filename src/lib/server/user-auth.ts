import type { D1Database } from '@cloudflare/workers-types';
import type { Cookies } from '@sveltejs/kit';

const USER_COOKIE = 'ref_user';
const PBKDF2_ITERATIONS = 100000;
const encoder = new TextEncoder();

export type RefUser = {
	id: number;
	email: string;
	display_name: string | null;
	wechat: string | null;
	telegram: string | null;
	crm_uid: string | null;
	vip_status: string;
	vip_started_at: string | null;
	created_at: string;
	updated_at: string;
	last_login_at: string | null;
	password_hash?: string;
};

async function sha256(value: string) {
	const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

function b64(bytes: Uint8Array) {
	let binary = '';
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary);
}

function fromB64(value: string) {
	const binary = atob(value);
	return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function secretFromEnv(env: App.Platform['env'] | undefined) {
	return env?.SESSION_SECRET || env?.ADMIN_PASSWORD || 'local-dev-secret';
}

async function signUser(id: number, passwordHash: string, env: App.Platform['env'] | undefined) {
	return sha256(`${id}:${passwordHash}:${secretFromEnv(env)}`);
}

export async function hashPassword(password: string) {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
		key,
		256
	);
	return `pbkdf2$${PBKDF2_ITERATIONS}$${b64(salt)}$${b64(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string) {
	const [kind, iter, salt64, hash64] = stored.split('$');
	if (kind !== 'pbkdf2' || !iter || !salt64 || !hash64) return false;
	const salt = fromB64(salt64);
	const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt, iterations: Number(iter), hash: 'SHA-256' },
		key,
		256
	);
	return b64(new Uint8Array(bits)) === hash64;
}

export function publicUser(user: RefUser | null) {
	if (!user) return null;
	return {
		id: user.id,
		email: user.email,
		display_name: user.display_name ?? '',
		wechat: user.wechat ?? '',
		telegram: user.telegram ?? '',
		crm_uid: user.crm_uid ?? '',
		vip_status: user.vip_status,
		vip_started_at: user.vip_started_at ?? ''
	};
}

export async function currentRefUser(
	cookies: Cookies,
	db: D1Database | undefined,
	env: App.Platform['env'] | undefined
) {
	if (!db) return null;
	const raw = cookies.get(USER_COOKIE);
	const [idText, signature] = raw?.split('.') ?? [];
	const id = Number(idText);
	if (!id || !signature) return null;

	const user = await db.prepare('SELECT * FROM ref_users WHERE id = ?').bind(id).first<RefUser>();
	if (!user?.password_hash) return null;
	return signature === (await signUser(user.id, user.password_hash, env)) ? user : null;
}

export async function setUserCookie(
	cookies: Cookies,
	user: RefUser,
	env: App.Platform['env'] | undefined,
	secure = true
) {
	if (!user.password_hash) return false;
	cookies.set(USER_COOKIE, `${user.id}.${await signUser(user.id, user.password_hash, env)}`, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure,
		maxAge: 60 * 60 * 24 * 90
	});
	return true;
}

export function clearUserCookie(cookies: Cookies) {
	cookies.delete(USER_COOKIE, { path: '/' });
}
