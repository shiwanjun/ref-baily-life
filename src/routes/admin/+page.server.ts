import { categoryNames, type CategoryName } from '$lib/ref-data';
import { clearAdminCookie, isAdmin, setAdminCookie } from '$lib/server/auth';
import { dbFromPlatform, listAdminSites } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

function tagsValue(form: FormData) {
	return text(form, 'tags')
		.split(/[,，\n]/)
		.map((tag) => tag.trim())
		.filter(Boolean)
		.slice(0, 8);
}

function categoryValue(form: FormData) {
	const category = text(form, 'category') as CategoryName;
	return categoryNames.includes(category) ? category : '数字服务与好物';
}

function requireDb(platform: App.Platform | undefined) {
	const db = dbFromPlatform(platform);
	if (!db) {
		throw fail(500, { error: 'D1 数据库还没有绑定，暂时不能管理。' });
	}
	return db;
}

export const load: PageServerLoad = async ({ cookies, platform }) => {
	const loggedIn = await isAdmin(cookies, platform?.env);
	return {
		loggedIn,
		configured: Boolean(platform?.env?.ADMIN_PASSWORD),
		hasDb: Boolean(dbFromPlatform(platform)),
		categories: categoryNames,
		sites: loggedIn ? await listAdminSites(dbFromPlatform(platform)) : []
	};
};

export const actions: Actions = {
	login: async ({ request, cookies, platform, url }) => {
		const form = await request.formData();
		const password = text(form, 'password');
		const expected = platform?.env?.ADMIN_PASSWORD;

		if (!expected) return fail(400, { error: '还没有配置 ADMIN_PASSWORD。' });
		if (password !== expected) return fail(401, { error: '管理密码不正确。' });

		await setAdminCookie(cookies, platform?.env, url.protocol === 'https:');
		redirect(303, '/admin');
	},

	logout: async ({ cookies }) => {
		clearAdminCookie(cookies);
		redirect(303, '/admin');
	},

	create: async ({ request, cookies, platform }) => {
		if (!(await isAdmin(cookies, platform?.env))) return fail(401, { error: '请先登录。' });
		const db = requireDb(platform);
		const form = await request.formData();

		await db
			.prepare(
				`INSERT INTO sites
				 (name, url, logo, catelog, description, sort_order, hidden, category, tags, featured)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
				boolValue(form, 'featured') ? 1 : 0
			)
			.run();

		return { success: '已新增推荐。' };
	},

	update: async ({ request, cookies, platform }) => {
		if (!(await isAdmin(cookies, platform?.env))) return fail(401, { error: '请先登录。' });
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

		return { success: '已保存修改。' };
	},

	remove: async ({ request, cookies, platform }) => {
		if (!(await isAdmin(cookies, platform?.env))) return fail(401, { error: '请先登录。' });
		const db = requireDb(platform);
		const form = await request.formData();
		const id = intValue(form, 'id');
		if (!id) return fail(400, { error: '缺少推荐 ID。' });

		await db.prepare('DELETE FROM sites WHERE id = ?').bind(id).run();
		return { success: '已删除推荐。' };
	}
};
