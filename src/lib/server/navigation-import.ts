import {
	DEFAULT_TAXONOMY_ROWS,
	findCategoryBySlug,
	normalizeDomain,
	type FlatCategoryNode
} from '../navigation';
import {
	buildNavigationTags,
	inferCategorySlug,
	looksLikeNavigationSource,
	shouldExcludeNavigationSite,
	type NavigationCurationInput
} from '../navigation-curation';

export type BookmarkEntry = {
	title: string;
	url: string;
	icon: string;
	path: string[];
};

export type ImportSiteDraft = {
	name: string;
	url: string;
	logo: string;
	catelog: string;
	desc: string;
	sort: number;
	hide: number;
	tags: string[];
	featured: number;
	source_site: string;
	source_category_path: string;
	normalized_domain: string;
	category_slug: string;
};

export type ImportBundle = {
	categories: FlatCategoryNode[];
	sites: ImportSiteDraft[];
	sources: string[];
	summary: {
		totalInput: number;
		totalSites: number;
		navigationSources: number;
		deduped: number;
		skipped: number;
		failed: number;
	};
};

type CrawlSource = {
	name: string;
	url: string;
};

type CrawlOptions = {
	maxInternalPages?: number;
	maxExternalLinks?: number;
};

const HTML_ENTITIES: Record<string, string> = {
	'&amp;': '&',
	'&quot;': '"',
	'&#39;': "'",
	'&lt;': '<',
	'&gt;': '>'
};

function decodeHtml(input: string) {
	let output = input;
	for (const [key, value] of Object.entries(HTML_ENTITIES)) {
		output = output.replaceAll(key, value);
	}
	return output.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(input: string) {
	return decodeHtml(input.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function faviconUrl(url: string) {
	const domain = normalizeDomain(url);
	if (!domain) return '';
	return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(domain)}`;
}

export function parseBookmarksHtml(html: string) {
	const entries: BookmarkEntry[] = [];
	const stack: string[] = [];
	let pendingFolder = '';

	for (const rawLine of html.split(/\r?\n/)) {
		const line = rawLine.trim();
		const folderMatch = line.match(/<DT><H3[^>]*>(.*?)<\/H3>/i);
		if (folderMatch) {
			pendingFolder = stripTags(folderMatch[1]);
			continue;
		}

		if (/<DL><p>/i.test(line) && pendingFolder) {
			stack.push(pendingFolder);
			pendingFolder = '';
			continue;
		}

		if (/<\/DL>/i.test(line)) {
			stack.pop();
			pendingFolder = '';
			continue;
		}

		const linkMatch = line.match(/<DT><A [^>]*HREF="([^"]+)"[^>]*?(?:ICON="([^"]+)")?[^>]*>(.*?)<\/A>/i);
		if (!linkMatch) continue;
		const url = decodeHtml(linkMatch[1]).trim();
		if (!url) continue;
		entries.push({
			title: stripTags(linkMatch[3]),
			url,
			icon: linkMatch[2] ? decodeHtml(linkMatch[2]).trim() : '',
			path: [...stack]
		});
	}

	return entries;
}

function buildDescription(entry: BookmarkEntry, isNavigationSource: boolean) {
	if (isNavigationSource) {
		return `导航源入口，来源路径：${entry.path.join(' / ') || '未分组'}。`;
	}
	if (entry.path.length) {
		return `来源书签分组：${entry.path.join(' / ')}。`;
	}
	return '来自导入书签的数据，后续可在后台补充说明。';
}

export function buildImportBundleFromBookmarks(html: string): ImportBundle {
	const categories = DEFAULT_TAXONOMY_ROWS;
	const entries = parseBookmarksHtml(html);
	const dedupe = new Set<string>();
	const sites: ImportSiteDraft[] = [];
	let skipped = 0;
	let deduped = 0;
	let navCount = 0;

	for (const entry of entries) {
		const curationInput: NavigationCurationInput = {
			name: entry.title,
			url: entry.url,
			source_site: entry.path.at(0) ?? '书签导入',
			source_category_path: entry.path.join(' / ')
		};

		if (shouldExcludeNavigationSite(curationInput)) {
			skipped += 1;
			continue;
		}

		const domain = normalizeDomain(entry.url);
		if (!domain) {
			skipped += 1;
			continue;
		}

		const dedupeKey = `${domain}|${entry.url.replace(/\/+$/, '')}`;
		if (dedupe.has(dedupeKey)) {
			deduped += 1;
			continue;
		}
		dedupe.add(dedupeKey);

		const navigationSource = looksLikeNavigationSource(curationInput);
		if (navigationSource) navCount += 1;

		const categorySlug = inferCategorySlug(curationInput, categories);
		const category = findCategoryBySlug(categories, categorySlug);
		if (!category) {
			skipped += 1;
			continue;
		}

		sites.push({
			name: entry.title,
			url: entry.url,
			logo: entry.icon || faviconUrl(entry.url),
			catelog: category.name,
			desc: buildDescription(entry, navigationSource),
			sort: navigationSource ? 10 : 100,
			hide: 0,
			tags: buildNavigationTags(curationInput, categorySlug),
			featured: navigationSource || categorySlug !== 'backlog-sites' ? 1 : 0,
			source_site: navigationSource ? entry.title : entry.path.at(0) ?? '书签导入',
			source_category_path: entry.path.join(' / '),
			normalized_domain: domain,
			category_slug: categorySlug
		});
	}

	return {
		categories,
		sites,
		sources: sites.filter((site) => site.tags.includes('导航源')).map((site) => site.url),
		summary: {
			totalInput: entries.length,
			totalSites: sites.length,
			navigationSources: navCount,
			deduped,
			skipped,
			failed: 0
		}
	};
}

function toAbsoluteUrl(baseUrl: string, maybeRelative: string) {
	try {
		return new URL(maybeRelative, baseUrl).toString();
	} catch {
		return '';
	}
}

function extractAnchorsFromHtml(html: string, baseUrl: string) {
	const links: Array<{ title: string; url: string }> = [];
	const matcher = /<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi;

	for (const match of html.matchAll(matcher)) {
		const url = toAbsoluteUrl(baseUrl, decodeHtml(match[1]));
		const title = stripTags(match[2]);
		if (!url || !title) continue;
		links.push({ title, url });
	}

	return links;
}

function siteFromAnchor(anchor: { title: string; url: string }, source: CrawlSource) {
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
	} satisfies ImportSiteDraft;
}

export async function crawlNavigationSources(
	sources: CrawlSource[],
	options: CrawlOptions = {}
): Promise<ImportBundle> {
	const categories = DEFAULT_TAXONOMY_ROWS;
	const drafts: ImportSiteDraft[] = [];
	const dedupe = new Set<string>();
	let skipped = 0;
	let failed = 0;

	for (const source of sources) {
		try {
			const response = await fetch(source.url, { redirect: 'follow' });
			if (!response.ok) {
				failed += 1;
				continue;
			}
			const html = await response.text();
			const homepageLinks = extractAnchorsFromHtml(html, source.url);
			const sourceDomain = normalizeDomain(source.url);
			const internalLinks: string[] = [];

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
				if (drafts.length >= (options.maxExternalLinks ?? 240)) break;
			}

			for (const internalUrl of internalLinks.slice(0, options.maxInternalPages ?? 6)) {
				try {
					const childResponse = await fetch(internalUrl, { redirect: 'follow' });
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
					}
				} catch {
					failed += 1;
				}
			}
		} catch {
			failed += 1;
		}
	}

	return {
		categories,
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

export function parseSourceList(input: string) {
	return input
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => ({ name: line.replace(/^https?:\/\//, '').replace(/\/.*$/, ''), url: line }));
}
