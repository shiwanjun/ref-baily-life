import {
	categories as fallbackCategories,
	fallbackAllSites,
	fallbackSites,
	settings,
	type Category,
	type CategoryName,
	type Site
} from '$lib/ref-data';
import type { D1Database } from '@cloudflare/workers-types';

type SiteRow = {
	id: number;
	name: string;
	url: string;
	logo: string | null;
	catelog: string | null;
	description: string | null;
	sort_order: number;
	hidden: number;
	category: CategoryName;
	tags: string | null;
	featured: number;
};

export function dbFromPlatform(platform: App.Platform | undefined) {
	return platform?.env?.DB;
}

function rowToSite(row: SiteRow): Site {
	let tags: string[] = [];
	try {
		tags = row.tags ? JSON.parse(row.tags) : [];
	} catch {
		tags = [];
	}

	return {
		id: row.id,
		name: row.name,
		url: row.url,
		logo: row.logo ?? '',
		catelog: row.catelog ?? row.category,
		desc: row.description ?? '',
		sort: row.sort_order,
		hide: row.hidden,
		category: row.category,
		tags,
		featured: row.featured
	};
}

export async function listPublicSites(db: D1Database | undefined, options: { includeHidden?: boolean } = {}) {
	if (!db) {
		return {
			sites: options.includeHidden ? fallbackAllSites : fallbackSites,
			categories: fallbackCategories,
			settings,
			source: 'fallback' as const
		};
	}

	try {
		const hiddenFilter = options.includeHidden ? '' : 'WHERE hidden = 0';
		const [sitesResult, categoriesResult] = await Promise.all([
			db
			.prepare(
				`SELECT id, name, url, logo, catelog, description, sort_order, hidden, category, tags, featured
				 FROM sites
				 ${hiddenFilter}
				 ORDER BY featured DESC, sort_order ASC, id ASC`
			)
			.all<SiteRow>(),
			listCategoriesResult(db)
		]);
		return {
			sites: sitesResult.results.map(rowToSite),
			categories: categoriesResult,
			settings,
			source: 'd1' as const
		};
	} catch {
		return {
			sites: options.includeHidden ? fallbackAllSites : fallbackSites,
			categories: fallbackCategories,
			settings,
			source: 'fallback' as const
		};
	}
}

async function listCategoriesResult(db: D1Database) {
	try {
		const result = await db
			.prepare('SELECT name, description, sort_order FROM categories ORDER BY sort_order ASC, id ASC')
			.all<{ name: string; description: string | null; sort_order: number }>();
		if (result.results.length) {
			return result.results.map((row) => ({
				name: row.name,
				description: row.description ?? '',
				sort: row.sort_order
			})) satisfies Category[];
		}
	} catch {
		// The categories table is added by a later migration, so older local DBs can fall back.
	}
	return fallbackCategories;
}

export async function listCategories(db: D1Database | undefined) {
	if (!db) return fallbackCategories;
	return listCategoriesResult(db);
}

export async function listAdminSites(db: D1Database | undefined) {
	if (!db) return [];
	try {
		const result = await db
			.prepare(
				`SELECT id, name, url, logo, catelog, description, sort_order, hidden, category, tags, featured
				 FROM sites
				 ORDER BY hidden ASC, category ASC, sort_order ASC, id ASC`
			)
			.all<SiteRow>();
		return result.results.map(rowToSite);
	} catch {
		return [];
	}
}

export async function createCategory(
	db: D1Database,
	name: string,
	description: string = '',
	sortOrder: number = 0
) {
	try {
		await db
			.prepare('INSERT INTO categories (name, description, sort_order) VALUES (?, ?, ?)')
			.bind(name, description, sortOrder)
			.run();
		return true;
	} catch {
		return false;
	}
}
