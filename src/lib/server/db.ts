import { settings } from '$lib/ref-data';
import { bundledNavigationSeed } from '$lib/navigation-seed';
import {
	DEFAULT_TAXONOMY_ROWS,
	buildCategoryPath,
	buildCategoryTree,
	findCategoryBySlug,
	type FlatCategoryNode,
	type NavigationSite
} from '$lib/navigation';
import type { ImportBundle } from '$lib/server/navigation-import';
import type { D1Database } from '@cloudflare/workers-types';

type CategoryRow = {
	id: number;
	name: string;
	slug: string;
	description: string | null;
	parent_id: number | null;
	level: 1 | 2 | 3;
	sort_order: number;
};

type SiteRow = {
	id: number;
	name: string;
	url: string;
	logo: string | null;
	catelog: string | null;
	description: string | null;
	sort_order: number;
	hidden: number;
	category: string | null;
	category_id: number | null;
	tags: string | null;
	featured: number;
	source_site: string | null;
	source_category_path: string | null;
	normalized_domain: string | null;
};

export function dbFromPlatform(platform: App.Platform | undefined) {
	return platform?.env?.DB;
}

function parseTags(tags: string | null) {
	try {
		return tags ? (JSON.parse(tags) as string[]) : [];
	} catch {
		return [];
	}
}

function fallbackCategoryRows() {
	return bundledNavigationSeed.categories.length ? bundledNavigationSeed.categories : DEFAULT_TAXONOMY_ROWS;
}

function fallbackSites() {
	const categories = fallbackCategoryRows();
	return bundledNavigationSeed.sites.map((site, index) => {
		const category = findCategoryBySlug(categories, site.category_slug);
		const categoryId = category?.id ?? categories.at(-1)?.id ?? 1;
		return {
			id: index + 1,
			name: site.name,
			url: site.url,
			logo: site.logo,
			catelog: site.catelog,
			desc: site.desc,
			sort: site.sort,
			hide: site.hide,
			category: category?.name ?? site.catelog,
			category_id: categoryId,
			category_path: buildCategoryPath(categoryId, categories),
			tags: site.tags,
			featured: site.featured,
			source_site: site.source_site,
			source_category_path: site.source_category_path,
			normalized_domain: site.normalized_domain
		} satisfies NavigationSite;
	});
}

function rowToSite(row: SiteRow, categories: FlatCategoryNode[]) {
	const categoryId = row.category_id ?? 0;
	const categoryPath = categoryId ? buildCategoryPath(categoryId, categories) : [];
	return {
		id: row.id,
		name: row.name,
		url: row.url,
		logo: row.logo ?? '',
		catelog: row.catelog ?? categoryPath.at(-1) ?? '',
		desc: row.description ?? '',
		sort: row.sort_order,
		hide: row.hidden,
		category: row.category ?? categoryPath.at(-1) ?? '',
		category_id: categoryId,
		category_path: categoryPath,
		tags: parseTags(row.tags),
		featured: row.featured,
		source_site: row.source_site ?? '',
		source_category_path: row.source_category_path ?? '',
		normalized_domain: row.normalized_domain ?? ''
	} satisfies NavigationSite;
}

async function listCategoryRows(db: D1Database) {
	const result = await db
		.prepare(
			`SELECT id, name, slug, description, parent_id, level, sort_order
			 FROM categories
			 ORDER BY level ASC, parent_id ASC, sort_order ASC, id ASC`
		)
		.all<CategoryRow>();

	return result.results.map(
		(row) =>
			({
				id: row.id,
				name: row.name,
				slug: row.slug,
				description: row.description ?? '',
				parent_id: row.parent_id,
				level: row.level,
				sort: row.sort_order
			}) satisfies FlatCategoryNode
	);
}

export async function listPublicSites(db: D1Database | undefined, options: { includeHidden?: boolean } = {}) {
	if (!db) {
		const categories = fallbackCategoryRows();
		const sites = fallbackSites().filter((site) => (options.includeHidden ? true : !site.hide));
		return {
			sites,
			categoryTree: buildCategoryTree(categories),
			categories,
			settings,
			source: 'fallback' as const
		};
	}

	try {
		const categories = await listCategoryRows(db);
		const where = options.includeHidden ? '' : 'WHERE hidden = 0';
		const result = await db
			.prepare(
				`SELECT id, name, url, logo, catelog, description, sort_order, hidden, category,
				        category_id, tags, featured, source_site, source_category_path, normalized_domain
				 FROM sites
				 ${where}
				 ORDER BY featured DESC, hidden ASC, sort_order ASC, id ASC`
			)
			.all<SiteRow>();
		return {
			sites: result.results.map((row) => rowToSite(row, categories)),
			categoryTree: buildCategoryTree(categories),
			categories,
			settings,
			source: 'd1' as const
		};
	} catch {
		const categories = fallbackCategoryRows();
		const sites = fallbackSites().filter((site) => (options.includeHidden ? true : !site.hide));
		return {
			sites,
			categoryTree: buildCategoryTree(categories),
			categories,
			settings,
			source: 'fallback' as const
		};
	}
}

export async function listAdminSites(db: D1Database | undefined) {
	if (!db) return fallbackSites();
	try {
		const categories = await listCategoryRows(db);
		const result = await db
			.prepare(
				`SELECT id, name, url, logo, catelog, description, sort_order, hidden, category,
				        category_id, tags, featured, source_site, source_category_path, normalized_domain
				 FROM sites
				 ORDER BY hidden ASC, featured DESC, sort_order ASC, id ASC`
			)
			.all<SiteRow>();
		return result.results.map((row) => rowToSite(row, categories));
	} catch {
		return fallbackSites();
	}
}

export async function listCategoryTree(db: D1Database | undefined) {
	if (!db) {
		const categories = fallbackCategoryRows();
		return { rows: categories, tree: buildCategoryTree(categories) };
	}
	try {
		const rows = await listCategoryRows(db);
		return { rows, tree: buildCategoryTree(rows) };
	} catch {
		const categories = fallbackCategoryRows();
		return { rows: categories, tree: buildCategoryTree(categories) };
	}
}

export async function createCategoryNode(
	db: D1Database,
	input: { name: string; slug: string; description?: string; parent_id?: number | null; level: 1 | 2 | 3; sort: number }
) {
	await db
		.prepare(
			`INSERT INTO categories (name, slug, description, parent_id, level, sort_order)
			 VALUES (?, ?, ?, ?, ?, ?)`
		)
		.bind(input.name, input.slug, input.description ?? '', input.parent_id ?? null, input.level, input.sort)
		.run();
}

export async function updateCategoryNode(
	db: D1Database,
	input: {
		id: number;
		name: string;
		slug: string;
		description?: string;
		parent_id?: number | null;
		level: 1 | 2 | 3;
		sort: number;
	}
) {
	await db
		.prepare(
			`UPDATE categories
			 SET name = ?, slug = ?, description = ?, parent_id = ?, level = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
			 WHERE id = ?`
		)
		.bind(
			input.name,
			input.slug,
			input.description ?? '',
			input.parent_id ?? null,
			input.level,
			input.sort,
			input.id
		)
		.run();
}

export async function deleteCategoryNode(db: D1Database, id: number) {
	await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
}

export async function saveSite(
	db: D1Database,
	input: Omit<NavigationSite, 'id' | 'category_path'> & { id?: number }
) {
	const payload = [
		input.name,
		input.url,
		input.logo,
		input.catelog,
		input.desc,
		input.sort,
		input.hide,
		input.category,
		input.category_id,
		JSON.stringify(input.tags),
		input.featured,
		input.source_site,
		input.source_category_path,
		input.normalized_domain
	];

	if (input.id) {
		await db
			.prepare(
				`UPDATE sites
				 SET name = ?, url = ?, logo = ?, catelog = ?, description = ?, sort_order = ?, hidden = ?,
				     category = ?, category_id = ?, tags = ?, featured = ?, source_site = ?,
				     source_category_path = ?, normalized_domain = ?, updated_at = CURRENT_TIMESTAMP
				 WHERE id = ?`
			)
			.bind(...payload, input.id)
			.run();
		return;
	}

	await db
		.prepare(
			`INSERT INTO sites
			 (name, url, logo, catelog, description, sort_order, hidden, category, category_id, tags,
			  featured, source_site, source_category_path, normalized_domain)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(...payload)
		.run();
}

export async function deleteSite(db: D1Database, id: number) {
	await db.prepare('DELETE FROM sites WHERE id = ?').bind(id).run();
}

export async function replaceNavigationData(db: D1Database, bundle: ImportBundle) {
	await db.prepare('DELETE FROM sites').run();
	await db.prepare('DELETE FROM categories').run();

	for (const category of bundle.categories) {
		await db
			.prepare(
				`INSERT INTO categories (id, name, slug, description, parent_id, level, sort_order)
				 VALUES (?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(
				category.id,
				category.name,
				category.slug,
				category.description,
				category.parent_id,
				category.level,
				category.sort
			)
			.run();
	}

	for (const [index, site] of bundle.sites.entries()) {
		const category = findCategoryBySlug(bundle.categories, site.category_slug);
		if (!category) continue;
		await db
			.prepare(
				`INSERT INTO sites
				 (name, url, logo, catelog, description, sort_order, hidden, category, category_id, tags,
				  featured, source_site, source_category_path, normalized_domain)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(
				site.name,
				site.url,
				site.logo,
				site.catelog,
				site.desc,
				site.sort || index + 1,
				site.hide,
				category.name,
				category.id,
				JSON.stringify(site.tags),
				site.featured,
				site.source_site,
				site.source_category_path,
				site.normalized_domain
			)
			.run();
	}
}
