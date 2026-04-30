import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEFAULT_TAXONOMY_ROWS, findCategoryBySlug, normalizeDomain } from '../src/lib/navigation.ts';
import { bundledNavigationSeed } from '../src/lib/navigation-seed.ts';
import { curateSiteDraft } from '../src/lib/navigation-curation.ts';

function renderSeedTs(bundle) {
	return `import type { ImportBundle } from './server/navigation-import';\n\nexport const bundledNavigationSeed: ImportBundle = ${JSON.stringify(
		{
			categories: bundle.categories,
			sites: bundle.sites,
			sources: bundle.sources,
			summary: bundle.summary
		},
		null,
		2
	)};\n`;
}

function renderSql(bundle) {
	const escape = (value) => (value == null ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`);
	const lines = ['DELETE FROM sites;', 'DELETE FROM categories;'];

	for (const category of bundle.categories) {
		lines.push(
			`INSERT INTO categories (id, name, slug, description, parent_id, level, sort_order) VALUES (${category.id}, ${escape(category.name)}, ${escape(category.slug)}, ${escape(category.description)}, ${category.parent_id ?? 'NULL'}, ${category.level}, ${category.sort});`
		);
	}

	for (const site of bundle.sites) {
		const category = findCategoryBySlug(bundle.categories, site.category_slug);
		if (!category) continue;
		lines.push(
			`INSERT INTO sites (name, url, logo, catelog, description, sort_order, hidden, category, category_id, tags, featured, source_site, source_category_path, normalized_domain) VALUES (${[
				escape(site.name),
				escape(site.url),
				escape(site.logo),
				escape(site.catelog),
				escape(site.desc),
				site.sort ?? 100,
				site.hide ?? 0,
				escape(category.name),
				category.id,
				escape(JSON.stringify(site.tags ?? [])),
				site.featured ?? 0,
				escape(site.source_site),
				escape(site.source_category_path),
				escape(site.normalized_domain)
			].join(', ')});`
		);
	}

	return lines.join('\n');
}

function buildCategoryPath(categoryId, rows) {
	const byId = new Map(rows.map((row) => [row.id, row]));
	const path = [];
	let current = byId.get(categoryId);
	while (current) {
		path.unshift(current.name);
		current = current.parent_id ? byId.get(current.parent_id) : null;
	}
	return path;
}

function topCounts(bundle) {
	const bySlug = new Map(bundle.categories.map((row) => [row.slug, row]));
	const counts = new Map();
	for (const site of bundle.sites) {
		const row = bySlug.get(site.category_slug);
		if (!row) continue;
		const top = buildCategoryPath(row.id, bundle.categories)[0] ?? '未分类';
		counts.set(top, (counts.get(top) ?? 0) + 1);
	}
	return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function leafCounts(bundle, limit = 20) {
	const bySlug = new Map(bundle.categories.map((row) => [row.slug, row]));
	const counts = new Map();
	for (const site of bundle.sites) {
		const row = bySlug.get(site.category_slug);
		if (!row) continue;
		const key = buildCategoryPath(row.id, bundle.categories).join(' / ');
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

const dedupe = new Map();
let removed = 0;
let duplicates = 0;

for (const site of bundledNavigationSeed.sites) {
	const curated = curateSiteDraft(
		{
			...site,
			normalized_domain: site.normalized_domain || normalizeDomain(site.url),
			source_site: site.source_site || '历史导入',
			source_category_path: site.source_category_path || ''
		},
		DEFAULT_TAXONOMY_ROWS
	);

	if (!curated) {
		removed += 1;
		continue;
	}

	const category = findCategoryBySlug(DEFAULT_TAXONOMY_ROWS, curated.category_slug);
	if (!category) {
		removed += 1;
		continue;
	}

	const key = `${curated.normalized_domain}|${curated.url.replace(/\/+$/, '')}`;
	if (dedupe.has(key)) {
		duplicates += 1;
		continue;
	}

	dedupe.set(key, {
		...curated,
		catelog: category.name,
		desc: curated.desc || `来源：${curated.source_site || '历史导入'}`
	});
}

const sites = [...dedupe.values()].sort((a, b) => {
	if ((b.featured ?? 0) !== (a.featured ?? 0)) return (b.featured ?? 0) - (a.featured ?? 0);
	return a.name.localeCompare(b.name, 'zh-CN');
});

const bundle = {
	categories: DEFAULT_TAXONOMY_ROWS,
	sites,
	sources: [...new Set(sites.map((site) => site.source_site).filter(Boolean))],
	summary: {
		totalInput: bundledNavigationSeed.sites.length,
		totalSites: sites.length,
		navigationSources: sites.filter((site) => site.tags?.includes('导航源')).length,
		deduped: duplicates,
		skipped: removed,
		failed: 0
	}
};

const beforeTop = topCounts(bundledNavigationSeed);
const afterTop = topCounts(bundle);
const topLeaf = leafCounts(bundle);

writeFileSync(resolve('src/lib/navigation-seed.ts'), renderSeedTs(bundle));
mkdirSync(resolve('tmp'), { recursive: true });
writeFileSync(resolve('tmp/navigation-seed.sql'), renderSql(bundle));

mkdirSync(resolve('docs'), { recursive: true });
writeFileSync(
	resolve('docs/导航分类重构说明.md'),
	[
		'# 导航分类重构说明',
		'',
		`- 重构时间：${new Date().toLocaleString('zh-CN', { hour12: false })}`,
		`- 原始站点数：${bundledNavigationSeed.sites.length}`,
		`- 清洗后站点数：${bundle.sites.length}`,
		`- 移除噪音数据：${removed}`,
		`- 去重数量：${duplicates}`,
		'',
		'## 重构前一级分类分布',
		...beforeTop.map(([name, count]) => `- ${name}：${count}`),
		'',
		'## 重构后一级分类分布',
		...afterTop.map(([name, count]) => `- ${name}：${count}`),
		'',
		'## 重构后热门叶子分类',
		...topLeaf.map(([name, count]) => `- ${name}：${count}`),
		'',
		'## 说明',
		'- 本次重构同时做了分类扩容和噪音清洗。',
		'- 明显的财经资讯流、占位链接、异常标题和无导航价值页面已剔除。',
		'- 后续新增书签导入和导航源抓取会复用同一套分类规则。'
	].join('\n')
);

console.log(
	JSON.stringify(
		{
			beforeSites: bundledNavigationSeed.sites.length,
			afterSites: bundle.sites.length,
			removed,
			duplicates,
			topCategories: afterTop,
			topLeaf
		},
		null,
		2
	)
);
