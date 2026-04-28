import { redirect, type Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'ref_admin';
const encoder = new TextEncoder();

async function sha256(value: string) {
	const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

function secretFromEnv(env: App.Platform['env'] | undefined) {
	return env?.SESSION_SECRET || env?.ADMIN_PASSWORD || 'local-dev-secret';
}

export async function adminToken(env: App.Platform['env'] | undefined) {
	const password = env?.ADMIN_PASSWORD;
	if (!password) return null;
	return sha256(`${password}:${secretFromEnv(env)}`);
}

export async function isAdmin(cookies: Cookies, env: App.Platform['env'] | undefined) {
	const expected = await adminToken(env);
	return Boolean(expected && cookies.get(COOKIE_NAME) === expected);
}

export async function setAdminCookie(
	cookies: Cookies,
	env: App.Platform['env'] | undefined,
	secure = true
) {
	const token = await adminToken(env);
	if (!token) return false;
	cookies.set(COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure,
		maxAge: 60 * 60 * 24 * 14
	});
	return true;
}

export function clearAdminCookie(cookies: Cookies) {
	cookies.delete(COOKIE_NAME, { path: '/' });
}

export async function requireAdmin(cookies: Cookies, env: App.Platform['env'] | undefined) {
	if (!(await isAdmin(cookies, env))) {
		redirect(303, '/admin');
	}
}
