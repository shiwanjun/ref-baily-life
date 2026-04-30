import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
	DEFAULT_TAXONOMY_ROWS,
	findCategoryBySlug,
	getLeafCategories,
	normalizeDomain
} from '../src/lib/navigation.ts';
import { bundledNavigationSeed } from '../src/lib/navigation-seed.ts';

const SKIP_PATTERNS = [
	/x-art/i,
	/成人视频|色情|erotica/i,
	/网盘影视|影院|观影|tv应用商店/i,
	/dashboard|localhost|127\.0\.0\.1|openpanel|signup\/create-account/i,
	/token=signup_|invite-code=/i,
	/file:\/\//i
];

const NAV_SOURCE_PATTERNS = [
	/导航|directory|toolkit|toolbox/i,
	/uxmap|优设导航|deepdh|ainav|aigc|toolai|aitoolkit|amz123|看国外|国外网站大全/i
];

const RULES = [
	{ slug: 'ai-directory', keywords: ['deepdh', 'ai工具集', 'ainav', 'aigc', 'aitoolkit', 'toolai', 'toolbox', 'ai导航', 'ai目录'] },
	{ slug: 'aigc-directory', keywords: ['aigc', 'midjourney', 'sora', '视频生成', '图像生成'] },
	{ slug: 'ai-tool-directory', keywords: ['ai-bot', 'chatgpt', 'claude', 'gemini', 'cursor', 'copilot', 'minimax', 'zenmux'] },
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
	{ slug: 'design-directory', keywords: ['uxmap', '优设导航', '设计导航', 'hao.shejidaren', '设计达人'] },
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
	{ slug: 'directory-seeds', keywords: ['导航', 'directory', '网址大全'] },
	{ slug: 'general-tools', keywords: ['工具', '下载', '效率', '域名', 'mac', 'software'] },
	{ slug: 'backlog-sites', keywords: [] }
];

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

function shouldSkip(title, url, path = []) {
	const haystack = `${title} ${url} ${path.join(' / ')}`.toLowerCase();
	return SKIP_PATTERNS.some((pattern) => pattern.test(haystack));
}

function looksLikeNavigationSource(title, url, path = []) {
	const haystack = `${title} ${url} ${path.join(' / ')}`.toLowerCase();
	return NAV_SOURCE_PATTERNS.some((pattern) => pattern.test(haystack));
}

function scoreCategory(slug, text) {
	const rule = RULES.find((item) => item.slug === slug);
	if (!rule) return 0;
	if (!rule.keywords.length) return 0.1;
	return rule.keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 2 : 0), 0);
}

function inferCategorySlug(title, url, path = []) {
	const text = `${title} ${url} ${path.join(' / ')}`.toLowerCase();
	const leafCategories = getLeafCategories(DEFAULT_TAXONOMY_ROWS);
	let best = findCategoryBySlug(DEFAULT_TAXONOMY_ROWS, 'backlog-sites') ?? leafCategories[0];
	let bestScore = -1;
	for (const leaf of leafCategories) {
		const score = scoreCategory(leaf.slug, text);
		if (score > bestScore) {
			best = leaf;
			bestScore = score;
		}
	}
	return best.slug;
}

function buildTags(title, url, categorySlug, path = []) {
	const tags = new Set();
	const text = `${title} ${url} ${path.join(' / ')}`.toLowerCase();
	if (looksLikeNavigationSource(title, url, path)) tags.add('导航源');
	if (text.includes('ai')) tags.add('AI');
	if (/设计|ui|ux/i.test(text)) tags.add('设计');
	if (/开发|swift|api|github/i.test(text)) tags.add('开发');
	if (/出海|跨境|amazon|amz/i.test(text)) tags.add('出海');
	if (/素材|模板|图标|插画/i.test(text)) tags.add('素材');
	if (categorySlug === 'backlog-sites') tags.add('待整理');
	return Array.from(tags).slice(0, 5);
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
	const categorySlug = inferCategorySlug(anchor.title, anchor.url, [source.name]);
	return {
		name: anchor.title,
		url: anchor.url,
		logo: faviconUrl(anchor.url),
		catelog: findCategoryBySlug(DEFAULT_TAXONOMY_ROWS, categorySlug)?.name ?? '待整理站点',
		desc: `来自导航源 ${source.name} 的抓取结果。`,
		sort: 100,
		hide: 0,
		tags: buildTags(anchor.title, anchor.url, categorySlug, [source.name]),
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
				if (shouldSkip(link.title, link.url, [source.name])) {
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
						if (shouldSkip(link.title, link.url, [source.name])) {
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
