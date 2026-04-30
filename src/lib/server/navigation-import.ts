import {
	DEFAULT_TAXONOMY_ROWS,
	findCategoryBySlug,
	getLeafCategories,
	normalizeDomain,
	type FlatCategoryNode
} from '../navigation';

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

const SKIP_PATTERNS = [
	/x-art/i,
	/成人视频|成人视频|色情|erotica/i,
	/网盘影视|影院|观影|tv应用商店/i,
	/dashboard|localhost|127\.0\.0\.1|openpanel|signup\/create-account/i,
	/token=signup_|invite-code=/i,
	/file:\/\//i
];

const NAV_SOURCE_PATTERNS = [
	/导航|directory|toolkit|toolbox/i,
	/uxmap|优设导航|deepdh|ainav|aigc|toolai|aitoolkit|amz123|看国外|国外网站大全/i
];

const RULES: Array<{ slug: string; featured?: boolean; keywords: string[] }> = [
	{ slug: 'ai-directory', featured: true, keywords: ['deepdh', 'ai工具集', 'ainav', 'aigc', 'aitoolkit', 'toolai', 'toolbox', 'ai导航', 'ai目录'] },
	{ slug: 'aigc-directory', featured: true, keywords: ['aigc', 'midjourney', 'sora', '视频生成', '图像生成'] },
	{ slug: 'ai-tool-directory', featured: true, keywords: ['ai-bot', 'chatgpt', 'claude', 'gemini', 'cursor', 'copilot', 'minimax', 'zenmux'] },
	{ slug: 'ui-generation', keywords: ['ui生成', '界面生成', 'wireframe', 'uizard'] },
	{ slug: 'logo-generation', keywords: ['logo', 'logo生成', '品牌标识'] },
	{ slug: 'color-tools', keywords: ['配色', 'color', 'palette', 'aicolors', 'catppuccin'] },
	{ slug: 'wireframe-prototype', keywords: ['原型', '草图', 'framer', '墨刀', 'figma', 'prototype'] },
	{ slug: 'copywriting', keywords: ['写作', '文案', '排版', '公众号', 'md2card', '酷宣ai'] },
	{ slug: 'rewriting', keywords: ['改写', '摘要', '翻译', '润色'] },
	{ slug: 'social-content', keywords: ['社媒', '小红书', '自媒体', '内容创作'] },
	{ slug: 'image-generation', keywords: ['图片生成', '文生图', '图像生成', 'stable diffusion'] },
	{ slug: 'video-generation', keywords: ['视频生成', '录咖', 'runway', 'pika', 'sora'] },
	{ slug: 'voice-localization', keywords: ['配音', '本地化', '字幕', '语音', '录音转文字'] },
	{ slug: 'ocr', keywords: ['ocr', '图片转文字', '白描'] },
	{ slug: 'pdf-tools', keywords: ['pdf'] },
	{ slug: 'ai-clients', keywords: ['chatbox', '客户端', '桌面端'] },
	{ slug: 'design-directory', featured: true, keywords: ['uxmap', '优设导航', '设计导航', 'hao.shejidaren', '设计达人'] },
	{ slug: 'design-resources', keywords: ['资源站', '素材', 'mockup', '图标', '插画'] },
	{ slug: 'design-inspiration-entry', keywords: ['灵感', 'inspiration', 'dribbble', 'behance'] },
	{ slug: 'ui-cases', keywords: ['pttrns', 'shots', 'mobbin', '界面案例'] },
	{ slug: 'interaction-reference', keywords: ['交互', '空状态', '组件参考'] },
	{ slug: 'components-empty-states', keywords: ['组件', 'component', 'heroui', 'nextui', 'swiftui'] },
	{ slug: 'mockup', keywords: ['mockup', '样机'] },
	{ slug: 'motion', keywords: ['动效', 'motion', '动画'] },
	{ slug: 'slides-presentation', keywords: ['slidev', 'ppt', '幻灯', '演示'] },
	{ slug: 'sketch-learning', keywords: ['sketch'] },
	{ slug: 'product-design-articles', keywords: ['人人都是产品经理', '产品设计', '设计文章'] },
	{ slug: 'design-community', keywords: ['社区', '少数派'] },
	{ slug: 'product-tutorials', keywords: ['产品教程', '产品方法', 'product'] },
	{ slug: 'growth-cases', keywords: ['增长', '案例', '投放'] },
	{ slug: 'launch-guides', keywords: ['product hunt', 'launch', '发布'] },
	{ slug: 'social-tools', keywords: ['一键排版', '排版', '内容分发', '公众号'] },
	{ slug: 'crm-growth', keywords: ['crm', '邮件', '私域'] },
	{ slug: 'brand-cases', keywords: ['品牌', '案例'] },
	{ slug: 'global-resources', keywords: ['出海', '跨境', '看国外', '国外网站大全'] },
	{ slug: 'cross-border-commerce', keywords: ['amz123', 'amazon', '淘宝客', '淘客', '电商'] },
	{ slug: 'overseas-directory', keywords: ['国外网站', '海外', '跨境导航'] },
	{ slug: 'page-deployment', keywords: ['cloudflare', 'vercel', 'netlify', 'edgeone'] },
	{ slug: 'localization-tools', keywords: ['本地化', '翻译', '多语言'] },
	{ slug: 'global-content', keywords: ['出海内容', '跨境内容'] },
	{ slug: 'open-source-tools', keywords: ['开源', 'github', 'awesome', 'ctolib'] },
	{ slug: 'api-directory', keywords: ['api store', 'public apis', 'api目录', '免费api'] },
	{ slug: 'dev-directory', keywords: ['开发工具', '技术', 'ios开发', 'swift', 'oschina'] },
	{ slug: 'analytics-tools', keywords: ['analytics', 'openpanel', '埋点'] },
	{ slug: 'docs-tools', keywords: ['gitbook', '文档', '知识库', '飞搜', 'feisou'] },
	{ slug: 'engineering-productivity', keywords: ['1panel', 'revenuecat', 'adapty', '工程效率'] },
	{ slug: 'templates', keywords: ['模板', 'template', 'framer templates'] },
	{ slug: 'icons-illustrations', keywords: ['图标', 'icon', '插画'] },
	{ slug: 'image-libraries', keywords: ['图库', '图片', 'wikimedia'] },
	{ slug: 'bidding-gov', keywords: ['招投标', '政企'] },
	{ slug: 'interior-home', keywords: ['家装', '室内', '酷家乐', '3vjia'] },
	{ slug: 'ecommerce-affiliate', keywords: ['淘客', 'amz123', '电商', '导购'] },
	{ slug: 'directory-seeds', featured: true, keywords: ['导航', 'directory', '网址大全'] },
	{ slug: 'general-tools', keywords: ['工具', '下载', '效率', '域名', 'mac', 'software'] },
	{ slug: 'backlog-sites', keywords: [] }
];

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

function looksLikeNavigationSource(entry: Pick<BookmarkEntry, 'title' | 'url' | 'path'>) {
	const haystack = `${entry.title} ${entry.url} ${entry.path.join(' / ')}`.toLowerCase();
	return NAV_SOURCE_PATTERNS.some((pattern) => pattern.test(haystack));
}

function shouldSkipEntry(entry: Pick<BookmarkEntry, 'title' | 'url' | 'path'>) {
	const haystack = `${entry.title} ${entry.url} ${entry.path.join(' / ')}`.toLowerCase();
	return SKIP_PATTERNS.some((pattern) => pattern.test(haystack));
}

function scoreCategory(slug: string, text: string) {
	const rule = RULES.find((item) => item.slug === slug);
	if (!rule) return 0;
	if (!rule.keywords.length) return 0.1;
	return rule.keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 2 : 0), 0);
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

function inferCategorySlug(entry: BookmarkEntry, categories: FlatCategoryNode[]) {
	const text = `${entry.title} ${entry.url} ${entry.path.join(' / ')}`.toLowerCase();
	const leafCategories = getLeafCategories(categories);
	let best = findCategoryBySlug(categories, 'backlog-sites') ?? leafCategories[0];
	let bestScore = -1;

	for (const leaf of leafCategories) {
		const score = scoreCategory(leaf.slug, text);
		if (score > bestScore) {
			bestScore = score;
			best = leaf;
		}
	}

	return best.slug;
}

function buildTags(entry: BookmarkEntry, categorySlug: string) {
	const tags = new Set<string>();
	const text = `${entry.title} ${entry.url} ${entry.path.join(' / ')}`.toLowerCase();

	if (looksLikeNavigationSource(entry)) tags.add('导航源');
	if (text.includes('ai')) tags.add('AI');
	if (/设计|ui|ux/i.test(text)) tags.add('设计');
	if (/开发|swift|api|github/i.test(text)) tags.add('开发');
	if (/出海|跨境|amazon|amz/i.test(text)) tags.add('出海');
	if (/素材|模板|图标|插画/i.test(text)) tags.add('素材');
	if (categorySlug === 'backlog-sites') tags.add('待整理');

	return Array.from(tags).slice(0, 5);
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
		if (shouldSkipEntry(entry)) {
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

		const navigationSource = looksLikeNavigationSource(entry);
		if (navigationSource) navCount += 1;

		const categorySlug = navigationSource ? 'directory-seeds' : inferCategorySlug(entry, categories);
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
			tags: buildTags(entry, categorySlug),
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
	const categorySlug = inferCategorySlug(
		{ title: anchor.title, url: anchor.url, icon: '', path: [source.name] },
		DEFAULT_TAXONOMY_ROWS
	);
	return {
		name: anchor.title,
		url: anchor.url,
		logo: faviconUrl(anchor.url),
		catelog: findCategoryBySlug(DEFAULT_TAXONOMY_ROWS, categorySlug)?.name ?? '待整理站点',
		desc: `来自导航源 ${source.name} 的抓取结果。`,
		sort: 100,
		hide: 0,
		tags: buildTags({ title: anchor.title, url: anchor.url, icon: '', path: [source.name] }, categorySlug),
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
				if (shouldSkipEntry({ title: link.title, url: link.url, path: [source.name] })) {
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
						if (shouldSkipEntry({ title: link.title, url: link.url, path: [source.name] })) {
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
