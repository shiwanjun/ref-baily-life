import { slugify, type NavigationSite } from '$lib/navigation';
import { bundledNavigationSeed } from '$lib/navigation-seed';
import { clearAdminCookie, isAdmin, setAdminCookie } from '$lib/server/auth';
import {
	createCategoryNode,
	dbFromPlatform,
	deleteCategoryNode,
	deleteSite,
	listAdminSites,
	listCategoryTree,
	replaceNavigationData,
	saveSite,
	updateCategoryNode
} from '$lib/server/db';
import {
	buildImportBundleFromBookmarks,
	crawlNavigationSources,
	parseSourceList
} from '$lib/server/navigation-import';
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
	return form.get(key) === 'on' || form.get(key) === '1' || form.get(key) === 'true';
}

function tagsValue(form: FormData) {
	return text(form, 'tags')
		.split(/[,，\n]/)
		.map((tag) => tag.trim())
		.filter(Boolean)
		.slice(0, 10);
}

function requireDb(platform: App.Platform | undefined) {
	const db = dbFromPlatform(platform);
	if (!db) throw fail(500, { error: 'D1 数据库还没有绑定，暂时不能管理。' });
	return db;
}

async function requireAdmin(cookies: Parameters<Actions[string]>[0]['cookies'], platform: App.Platform | undefined) {
	if (!(await isAdmin(cookies, platform?.env))) {
		throw fail(401, { error: '请先登录后台。' });
	}
}

function normalizeSiteInput(form: FormData): Omit<NavigationSite, 'id' | 'category_path'> {
	const categoryName = text(form, 'categoryName');
	return {
		name: text(form, 'name'),
		url: text(form, 'url'),
		logo: text(form, 'logo'),
		catelog: text(form, 'catelog') || categoryName,
		desc: text(form, 'desc'),
		sort: intValue(form, 'sort', 100),
		hide: boolValue(form, 'hidden') ? 1 : 0,
		category: categoryName,
		category_id: intValue(form, 'category_id'),
		tags: tagsValue(form),
		featured: boolValue(form, 'featured') ? 1 : 0,
		source_site: text(form, 'source_site'),
		source_category_path: text(form, 'source_category_path'),
		normalized_domain: text(form, 'normalized_domain')
	};
}

export const load: PageServerLoad = async ({ cookies, platform }) => {
	const db = dbFromPlatform(platform);
	const loggedIn = await isAdmin(cookies, platform?.env);
	const categoryData = await listCategoryTree(db);
	return {
		loggedIn,
		configured: Boolean(platform?.env?.ADMIN_PASSWORD),
		hasDb: Boolean(db),
		categoryRows: categoryData.rows,
		categoryTree: categoryData.tree,
		sites: loggedIn ? await listAdminSites(db) : [],
		seedSummary: bundledNavigationSeed.summary,
		seedSourceCount: bundledNavigationSeed.sources.length
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

	createSite: async ({ request, cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const db = requireDb(platform);
		const form = await request.formData();
		const payload = normalizeSiteInput(form);
		if (!payload.name || !payload.url || !payload.category_id || !payload.category) {
			return fail(400, { error: '请填写名称、链接并选择三级分类。' });
		}
		await saveSite(db, payload);
		return { success: '已新增站点。' };
	},

	updateSite: async ({ request, cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const db = requireDb(platform);
		const form = await request.formData();
		const id = intValue(form, 'id');
		if (!id) return fail(400, { error: '缺少站点 ID。' });
		const payload = normalizeSiteInput(form);
		await saveSite(db, { ...payload, id });
		return { success: '已保存站点。' };
	},

	removeSite: async ({ request, cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const db = requireDb(platform);
		const id = intValue(await request.formData(), 'id');
		if (!id) return fail(400, { error: '缺少站点 ID。' });
		await deleteSite(db, id);
		return { success: '已删除站点。' };
	},

	createCategoryNode: async ({ request, cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const db = requireDb(platform);
		const form = await request.formData();
		const name = text(form, 'name');
		const parentId = intValue(form, 'parent_id');
		const level = intValue(form, 'level', 1) as 1 | 2 | 3;
		if (!name) return fail(400, { error: '分类名称不能为空。' });
		await createCategoryNode(db, {
			name,
			slug: text(form, 'slug') || slugify(name),
			description: text(form, 'description'),
			parent_id: parentId || null,
			level,
			sort: intValue(form, 'sort', 100)
		});
		return { success: '已新增分类。' };
	},

	updateCategoryNode: async ({ request, cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const db = requireDb(platform);
		const form = await request.formData();
		const id = intValue(form, 'id');
		if (!id) return fail(400, { error: '缺少分类 ID。' });
		const name = text(form, 'name');
		if (!name) return fail(400, { error: '分类名称不能为空。' });
		await updateCategoryNode(db, {
			id,
			name,
			slug: text(form, 'slug') || slugify(name),
			description: text(form, 'description'),
			parent_id: intValue(form, 'parent_id') || null,
			level: intValue(form, 'level', 1) as 1 | 2 | 3,
			sort: intValue(form, 'sort', 100)
		});
		return { success: '已更新分类。' };
	},

	deleteCategoryNode: async ({ request, cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const db = requireDb(platform);
		const id = intValue(await request.formData(), 'id');
		if (!id) return fail(400, { error: '缺少分类 ID。' });
		await deleteCategoryNode(db, id);
		return { success: '已删除分类。' };
	},

	previewSeedImport: async ({ cookies, platform }) => {
		await requireAdmin(cookies, platform);
		return {
			success: '已生成内置种子预览。',
			importPreview: bundledNavigationSeed.summary
		};
	},

	replaceSeedImport: async ({ cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const db = requireDb(platform);
		await replaceNavigationData(db, bundledNavigationSeed);
		return {
			success: `已覆盖导入 ${bundledNavigationSeed.summary.totalSites} 条内置导航数据。`,
			importPreview: bundledNavigationSeed.summary
		};
	},

	previewBookmarkImport: async ({ request, cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const html = text(await request.formData(), 'bookmark_html');
		if (!html) return fail(400, { error: '请先粘贴书签 HTML。' });
		const bundle = buildImportBundleFromBookmarks(html);
		return {
			success: '已生成书签导入预览。',
			importPreview: bundle.summary
		};
	},

	replaceBookmarkImport: async ({ request, cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const db = requireDb(platform);
		const html = text(await request.formData(), 'bookmark_html');
		if (!html) return fail(400, { error: '请先粘贴书签 HTML。' });
		const bundle = buildImportBundleFromBookmarks(html);
		await replaceNavigationData(db, bundle);
		return {
			success: `已覆盖导入 ${bundle.summary.totalSites} 条书签导航数据。`,
			importPreview: bundle.summary
		};
	},

	crawlNavigationSources: async ({ request, cookies, platform }) => {
		await requireAdmin(cookies, platform);
		const form = await request.formData();
		const sources = parseSourceList(text(form, 'source_list'));
		if (!sources.length) return fail(400, { error: '请先输入导航源 URL。' });
		const bundle = await crawlNavigationSources(sources);
		if (text(form, 'mode') === 'replace') {
			const db = requireDb(platform);
			await replaceNavigationData(db, bundle);
			return {
				success: `已抓取并覆盖导入 ${bundle.summary.totalSites} 条站点数据。`,
				importPreview: bundle.summary
			};
		}
		return {
			success: '已完成导航源抓取预览。',
			importPreview: bundle.summary
		};
	}
};
