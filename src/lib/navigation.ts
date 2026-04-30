import { NAVIGATION_TAXONOMY, type NavigationTaxonomySeed } from './navigation-taxonomy.ts';

export type CategoryLevel = 1 | 2 | 3;

export type CategoryNode = {
	id: number;
	name: string;
	slug: string;
	description: string;
	parent_id: number | null;
	level: CategoryLevel;
	sort: number;
	children: CategoryNode[];
};

export type FlatCategoryNode = Omit<CategoryNode, 'children'>;

export type NavigationSite = {
	id: number;
	name: string;
	url: string;
	logo: string;
	catelog: string;
	desc: string;
	sort: number;
	hide: number;
	category: string;
	category_id: number;
	category_path: string[];
	tags: string[];
	featured: number;
	source_site: string;
	source_category_path: string;
	normalized_domain: string;
};

export const DEFAULT_TAXONOMY: NavigationTaxonomySeed[] = NAVIGATION_TAXONOMY;

export function flattenTaxonomy(tree: NavigationTaxonomySeed[] = DEFAULT_TAXONOMY) {
	const rows: FlatCategoryNode[] = [];
	let id = 1;

	function walk(nodes: NavigationTaxonomySeed[], parentId: number | null, level: CategoryLevel) {
		for (let index = 0; index < nodes.length; index += 1) {
			const node = nodes[index];
			const currentId = id++;
			rows.push({
				id: currentId,
				name: node.name,
				slug: node.slug,
				description: node.description,
				parent_id: parentId,
				level,
				sort: (index + 1) * 10
			});
			if (node.children?.length && level < 3) {
				walk(node.children, currentId, (level + 1) as CategoryLevel);
			}
		}
	}

	walk(tree, null, 1);
	return rows;
}

export const DEFAULT_TAXONOMY_ROWS = flattenTaxonomy();

export function buildCategoryTree(rows: FlatCategoryNode[]) {
	const byId = new Map<number, CategoryNode>();
	const roots: CategoryNode[] = [];

	for (const row of rows) {
		byId.set(row.id, { ...row, children: [] });
	}

	for (const row of rows) {
		const node = byId.get(row.id);
		if (!node) continue;
		if (row.parent_id == null) {
			roots.push(node);
			continue;
		}
		const parent = byId.get(row.parent_id);
		if (parent) parent.children.push(node);
	}

	return roots.toSorted((a, b) => a.sort - b.sort || a.id - b.id);
}

export function buildCategoryPath(categoryId: number, rows: FlatCategoryNode[]) {
	const byId = new Map(rows.map((row) => [row.id, row]));
	const path: string[] = [];
	let current = byId.get(categoryId);
	while (current) {
		path.unshift(current.name);
		current = current.parent_id ? byId.get(current.parent_id) : undefined;
	}
	return path;
}

export function normalizeDomain(url: string) {
	try {
		const parsed = new URL(url);
		return parsed.hostname.replace(/^www\./, '').toLowerCase();
	} catch {
		return '';
	}
}

export function slugify(input: string) {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

export function findCategoryBySlug(rows: FlatCategoryNode[], slug: string) {
	return rows.find((row) => row.slug === slug);
}

export function getLeafCategories(rows: FlatCategoryNode[]) {
	const parentIds = new Set(rows.filter((row) => row.parent_id != null).map((row) => row.parent_id));
	return rows.filter((row) => row.level === 3 && !parentIds.has(row.id));
}

export function ensureCategoryPath(rows: FlatCategoryNode[], slug: string) {
	const category = findCategoryBySlug(rows, slug);
	return category ? buildCategoryPath(category.id, rows) : [];
}
