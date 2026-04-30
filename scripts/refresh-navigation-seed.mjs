import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DEFAULT_TAXONOMY_ROWS, findCategoryBySlug, normalizeDomain } from '../src/lib/navigation.ts';
import {
	buildNavigationTags,
	inferCategorySlug,
	shouldExcludeNavigationSite
} from '../src/lib/navigation-curation.ts';
import { bundledNavigationSeed } from '../src/lib/navigation-seed.ts';

function decodeHtml(input) {
	return input
		.replaceAll('&amp;', '&')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'")
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(input) {
	return decodeHtml(input.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function faviconUrl(url) {
	const domain = normalizeDomain(url);
	return domain ? `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(domain)}` : '';
}

function toAbsoluteUrl(baseUrl, maybeRelative) {
	try {
		return new URL(maybeRelative, baseUrl).toString();
	} catch {
		return '';
	}
}

function extractAnchorsFromHtml(html, baseUrl) {
	const links = [];
	const matcher = /<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi;
	for (const match of html.matchAll(matcher)) {
		const url = toAbsoluteUrl(baseUrl, decodeHtml(match[1]));
		const title = stripTags(match[2]);
		if (!url || !title) continue;
		links.push({ title, url });
	}
	return links;
}

function siteFromAnchor(anchor, source) {
	const input = {
		name: anchor.title,
		url: anchor.url,
		source_site: source.name,
		source_category_path: source.url
	};
	const categorySlug = inferCategorySlug(input, DEFAULT_TAXONOMY_ROWS);
	return {
		name: anchor.title,
		url: anchor.url,
		logo: faviconUrl(anchor.url),
		catelog: findCategoryBySlug(DEFAULT_TAXONOMY_ROWS, categorySlug)?.name ?? '待整理站点',
		desc: `来自导航源 ${source.name} 的抓取结果。`,
		sort: 100,
		hide: 0,
		tags: buildNavigationTags(input, categorySlug),
		featured: 0,
		source_site: source.name,
		source_category_path: source.url,
		normalized_domain: normalizeDomain(anchor.url),
		category_slug: categorySlug
	};
}

async function crawlNavigationSources(sources, options = {}) {
	const drafts = [];
	const dedupe = new Set();
	let skipped = 0;
	let failed = 0;

	for (const source of sources) {
		try {
			const response = await fetch(source.url, {
				redirect: 'follow',
				signal: AbortSignal.timeout(options.requestTimeoutMs ?? 12000)
			});
			if (!response.ok) {
				failed += 1;
				continue;
			}
			const html = await response.text();
			const homepageLinks = extractAnchorsFromHtml(html, source.url);
			const sourceDomain = normalizeDomain(source.url);
			const internalLinks = [];

			for (const link of homepageLinks) {
				if (
					shouldExcludeNavigationSite({
						name: link.title,
						url: link.url,
						source_site: source.name,
						source_category_path: source.url
					})
				) {
					skipped += 1;
					continue;
				}

				if (normalizeDomain(link.url) === sourceDomain) {
					internalLinks.push(link.url);
					continue;
				}

				const draft = siteFromAnchor(link, source);
				if (!draft.normalized_domain) {
					skipped += 1;
					continue;
				}

				const key = `${draft.normalized_domain}|${draft.url.replace(/\/+$/, '')}`;
				if (dedupe.has(key)) continue;
				dedupe.add(key);
				drafts.push(draft);
			}

			for (const internalUrl of internalLinks.slice(0, options.maxInternalPages ?? 12)) {
				try {
					const childResponse = await fetch(internalUrl, {
						redirect: 'follow',
						signal: AbortSignal.timeout(options.requestTimeoutMs ?? 12000)
					});
					if (!childResponse.ok) continue;
					const childHtml = await childResponse.text();
					for (const link of extractAnchorsFromHtml(childHtml, internalUrl)) {
						if (normalizeDomain(link.url) === sourceDomain) continue;
						if (
							shouldExcludeNavigationSite({
								name: link.title,
								url: link.url,
								source_site: source.name,
								source_category_path: source.url
							})
						) {
							skipped += 1;
							continue;
						}
						const draft = siteFromAnchor(link, source);
						if (!draft.normalized_domain) continue;
						const key = `${draft.normalized_domain}|${draft.url.replace(/\/+$/, '')}`;
						if (dedupe.has(key)) continue;
						dedupe.add(key);
						drafts.push(draft);
						if (drafts.length >= (options.maxExternalLinks ?? 2000)) break;
					}
				} catch {
					failed += 1;
				}
				if (drafts.length >= (options.maxExternalLinks ?? 2000)) break;
			}
		} catch {
			failed += 1;
		}
	}

	return {
		categories: DEFAULT_TAXONOMY_ROWS,
		sites: drafts,
		sources: sources.map((item) => item.url),
		summary: {
			totalInput: sources.length,
			totalSites: drafts.length,
			navigationSources: sources.length,
			deduped: 0,
			skipped,
			failed
		}
	};
}

function mergeBundles(baseBundle, crawledBundle) {
	const dedupe = new Map();
	for (const site of baseBundle.sites) {
		const key = `${site.normalized_domain}|${site.url.replace(/\/+$/, '')}`;
		dedupe.set(key, site);
	}

	let added = 0;
	for (const site of crawledBundle.sites) {
		const key = `${site.normalized_domain}|${site.url.replace(/\/+$/, '')}`;
		if (dedupe.has(key)) continue;
		dedupe.set(key, {
			...site,
			sort: 120
		});
		added += 1;
	}

	const sites = Array.from(dedupe.values()).sort((a, b) => {
		if (b.featured !== a.featured) return b.featured - a.featured;
		return a.name.localeCompare(b.name, 'zh-CN');
	});

	return {
		categories: baseBundle.categories,
		sites,
		sources: Array.from(new Set([...baseBundle.sources, ...crawledBundle.sources])),
		summary: {
			totalInput: baseBundle.summary.totalInput + crawledBundle.summary.totalInput,
			totalSites: sites.length,
			navigationSources: Array.from(new Set([...baseBundle.sources, ...crawledBundle.sources])).length,
			deduped: baseBundle.sites.length + crawledBundle.sites.length - sites.length,
			skipped: baseBundle.summary.skipped + crawledBundle.summary.skipped,
			failed: baseBundle.summary.failed + crawledBundle.summary.failed
		},
		_meta: {
			added,
			crawled: crawledBundle.sites.length
		}
	};
}

function renderSeedTs(bundle) {
	return `import type { ImportBundle } from './server/navigation-import';\n\nexport const bundledNavigationSeed: ImportBundle = ${JSON.stringify({
		categories: bundle.categories,
		sites: bundle.sites,
		sources: bundle.sources,
		summary: bundle.summary
	}, null, 2)};\n`;
}

function renderSql(bundle) {
	const escape = (value) =>
		value == null ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`;

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

const extraSources = [
	'https://hao.uisdc.com/',
	'https://www.uxmap.cn/',
	'https://ai-bot.cn/',
	'https://www.ainavpro.com/',
	'https://aigc.cn/'
];

const sourceUrls = Array.from(new Set([...bundledNavigationSeed.sources, ...extraSources]));
const sources = sourceUrls.map((url) => ({
	name: url.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
	url
}));

console.log(`开始抓取 ${sources.length} 个导航源...`);
const crawledBundle = await crawlNavigationSources(sources, {
	maxExternalLinks: 2400,
	maxInternalPages: 16
});
const merged = mergeBundles(bundledNavigationSeed, crawledBundle);

writeFileSync(resolve('src/lib/navigation-seed.ts'), renderSeedTs(merged));
mkdirSync(resolve('tmp'), { recursive: true });
writeFileSync(resolve('tmp/navigation-seed.sql'), renderSql(merged));

console.log(JSON.stringify({
	baseSites: bundledNavigationSeed.sites.length,
	crawledSites: crawledBundle.sites.length,
	mergedSites: merged.sites.length,
	added: merged._meta.added,
	sources: merged.sources.length,
	summary: merged.summary
}, null, 2));
