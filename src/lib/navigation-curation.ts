import {
	DEFAULT_TAXONOMY_ROWS,
	findCategoryBySlug,
	getLeafCategories,
	normalizeDomain,
	type FlatCategoryNode
} from './navigation.ts';

export type NavigationCurationInput = {
	name: string;
	url: string;
	desc?: string;
	source_site?: string;
	source_category_path?: string;
	tags?: string[];
	normalized_domain?: string;
};

type Rule = {
	slug: string;
	keywords?: string[];
	domains?: string[];
};

const NAV_SOURCE_PATTERNS = [
	/导航|directory|toolkit|toolbox|hao\b/i,
	/uxmap|优设导航|设计达人|ainav|deepdh|aigc|amz123|看国外|网址大全|publicapis/i
];

const BLOCKED_DOMAIN_PATTERNS = [
	/(^|\.)sina\.com\.cn$/,
	/(^|\.)sina\.cn$/,
	/(^|\.)weibo\.com$/,
	/(^|\.)guba\.sina\.com\.cn$/,
	/(^|\.)blog\.sina\.com\.cn$/,
	/(^|\.)adbox\.sina\.com\.cn$/,
	/(^|\.)wap\.cj\.sina\.cn$/
];

const BLOCKED_TEXT_PATTERNS = [
	/成人视频|色情|erotica/i,
	/dashboard|localhost|127\.0\.0\.1|token=signup_|invite-code=|file:\/\//i,
	/点击进入超话|版权所有|实时财经新闻直播|7x24小时/i,
	/^[@#&\s\u00a0._-]+$/i,
	/@name@|@symbol@|@category@|@pname@|@psymbol@/i,
	/��|�/i
];

const RULES: Rule[] = [
	{ slug: 'general-ai-assistants', keywords: ['chatgpt', 'claude', 'gemini', 'kimi', '豆包', '通义', 'gpt', 'ai 助手'], domains: ['chatgpt.com', 'claude.ai', 'gemini.google.com'] },
	{ slug: 'coding-ai-assistants', keywords: ['cursor', 'copilot', 'windsurf', 'codeium', 'claude code', '编程助手', 'v0', 'bolt', 'lovable'] },
	{ slug: 'ai-clients', keywords: ['chatbox', 'lobechat', 'nextchat', 'cherry studio', 'jan', '客户端'] },
	{ slug: 'ai-writing', keywords: ['写作', '文案', '改写', '润色', '摘要', '公众号', '排版', '内容创作', 'md2card'] },
	{ slug: 'ai-image-tools', keywords: ['midjourney', 'stable diffusion', 'flux', '图片生成', '文生图', '修图', 'logo', '海报'] },
	{ slug: 'ai-video-audio', keywords: ['视频生成', 'runway', 'pika', 'sora', '配音', '字幕', '录音转文字', 'tts', 'reccloud'] },
	{ slug: 'ocr-tools', keywords: ['ocr', '白描', '图片转文字', '扫描'] },
	{ slug: 'pdf-document-tools', keywords: ['pdf', 'xodo', 'smallpdf', 'ilovepdf'] },
	{ slug: 'ai-automation', keywords: ['dify', 'coze', 'n8n', 'make', 'zapier', '工作流', '自动化', '智能体'] },

	{ slug: 'ui-cases', keywords: ['mobbin', 'pttrns', 'appscreenshots', 'shots', 'screenlane', 'ui案例', '界面案例'] },
	{ slug: 'interaction-reference', keywords: ['交互', '空状态', 'user flow', 'onboarding', '组件参考'] },
	{ slug: 'brand-packaging', keywords: ['品牌', '包装', '海报', '平面设计', 'logo设计'] },
	{ slug: 'wireframe-prototype', keywords: ['figma', 'framer', '墨刀', 'uizard', '原型', '线框', 'wireframe', 'prototype'] },
	{ slug: 'color-font-tools', keywords: ['配色', 'palette', 'color', '字体', 'font', '图标', 'icon', 'fontawesome', 'yesicon', 'iconfont'] },
	{ slug: 'motion-3d-tools', keywords: ['动效', 'animation', 'ae', '3d', 'mockup', 'sketchup', '模型'] },
	{ slug: 'design-directory', keywords: ['uxmap', '优设导航', '设计导航', '设计达人', 'hao.shejidaren'] },
	{ slug: 'ued-teams', keywords: ['ued', 'uxc', 'mux', 'isux', '设计团队'] },
	{ slug: 'design-community-sites', keywords: ['dribbble', 'behance', '花瓣', '站酷', '设计社区', '少数派'] },

	{ slug: 'open-source-directory', keywords: ['开源', 'awesome', 'github', 'gitcode', 'ctolib'] },
	{ slug: 'api-directory', keywords: ['api', 'publicapis', '接口', 'free api'] },
	{ slug: 'developer-docs', keywords: ['docs', '文档', 'gitbook', 'readthedocs', 'showdoc', '知识库', 'feisou'] },
	{ slug: 'cloud-platforms', keywords: ['aliyun', '腾讯云', 'cloud', '云服务器', 'aws', 'gcp'] },
	{ slug: 'deployment-hosting', keywords: ['cloudflare', 'vercel', 'netlify', 'railway', 'render', 'pages', 'deploy', 'hosting'] },
	{ slug: 'ops-observability', keywords: ['analytics', 'posthog', 'sentry', 'openpanel', 'umami', 'plausible', '监控', '观测'] },
	{ slug: 'code-collaboration', keywords: ['git', '代码规范', '协作', '版本管理', 'pull request'] },
	{ slug: 'developer-tools', keywords: ['oschina', 'tool', 'json', 'regex', '开发工具', '控制台', '1panel'] },
	{ slug: 'engineering-learning', keywords: ['swift', 'node', 'python', '教程', '框架', '技术教程', 'programming'] },

	{ slug: 'product-tutorials', keywords: ['产品经理', '产品思维', 'prd', '需求', '产品教程'] },
	{ slug: 'growth-cases', keywords: ['增长', '案例拆解', '增长案例', '投放案例'] },
	{ slug: 'launch-guides', keywords: ['product hunt', 'launch', '发布', '冷启动'] },
	{ slug: 'crm-growth', keywords: ['crm', '邮件', '私域', 'newsletter'] },
	{ slug: 'community-ops', keywords: ['社群', '小圈子', '训练营', '问答', '社区运营'] },
	{ slug: 'brand-cases', keywords: ['品牌案例', '品牌传播', '营销案例'] },
	{ slug: 'growth-analytics', keywords: ['漏斗', '归因', '数据分析', '埋点'] },
	{ slug: 'conversion-tools', keywords: ['落地页', '表单', '转化', 'survey'] },
	{ slug: 'monetization-tools', keywords: ['revenuecat', 'adapty', 'stripe', '订阅', '支付'] },

	{ slug: 'social-content', keywords: ['小红书', '公众号', '内容创作', '社媒', '文案', '视频脚本'] },
	{ slug: 'content-publishing', keywords: ['排版', '发布', '一键分发', 'schedule'] },
	{ slug: 'short-video-tools', keywords: ['短视频', '视频剪辑', '字幕', '配音', '封面'] },
	{ slug: 'seo-tools', keywords: ['seo', 'serp', 'keyword', 'ahrefs', 'semrush'] },
	{ slug: 'ads-tools', keywords: ['投放', '广告', 'ads', '归因', 'creative'] },
	{ slug: 'affiliate-marketing', keywords: ['淘客', '返佣', '联盟营销', 'duomai', '导购'] },
	{ slug: 'industry-media', keywords: ['36氪', '虎嗅', '财经', '商业媒体', '行业媒体'] },
	{ slug: 'forum-communities', keywords: ['论坛', '社区', 'super_index', 'reddit', '贴吧'] },
	{ slug: 'creator-communities', keywords: ['创作者', '知识星球', '小鹅通', '社区服务'] },

	{ slug: 'cross-border-platforms', keywords: ['amazon', 'shopee', 'etsy', 'mercado', 'jumia', 'alibaba', 'aliexpress', 'temu'] },
	{ slug: 'sourcing-selection', keywords: ['1688', '货源', '选品', '分销', '采购'] },
	{ slug: 'commerce-directory', keywords: ['amz123', '电商导航', '淘客导航', '跨境电商导航'] },
	{ slug: 'store-tools', keywords: ['采集', '转链', '插件', '店铺工具', '选品工具'] },
	{ slug: 'logistics-payments', keywords: ['收款', '物流', '支付', 'vat', '财税', '结汇'] },
	{ slug: 'compliance-ip', keywords: ['商标', '专利', '合规', '备案', '知识产权'] },
	{ slug: 'global-directory', keywords: ['出海导航', '看国外', '国外网站大全', '海外导航', 'chuhai2345'] },
	{ slug: 'localization-tools', keywords: ['本地化', '多语言', '翻译', 'localization'] },
	{ slug: 'overseas-resources', keywords: ['海外资源', '国外网站', 'overseas'] },

	{ slug: 'docs-sheets', keywords: ['feishu', '飞书', '文档', '表格', 'docs.qq', 'kdocs'] },
	{ slug: 'presentation-tools', keywords: ['ppt', 'keynote', 'slidev', '演示', '幻灯'] },
	{ slug: 'knowledge-management', keywords: ['知识库', 'wiki', 'notion', 'obsidian', '笔记'] },
	{ slug: 'system-tools', keywords: ['mac', 'ntfs', '系统工具', '清理', 'drbuho'] },
	{ slug: 'conversion-download', keywords: ['下载', '转换', 'parser', 'mp4', 'mp3', '格式转换'] },
	{ slug: 'capture-recording', keywords: ['截图', '录屏', '录制', 'screen capture'] },
	{ slug: 'search-engines', keywords: ['百度', 'google', 'bing', 'search'] },
	{ slug: 'common-websites', keywords: ['163邮箱', 'gmail', 'mail', '常用网站'] },
	{ slug: 'general-tools', keywords: ['工具箱', 'toolbox', '网址大全', '实用工具', 'software'] },

	{ slug: 'sketch-figma-learning', keywords: ['sketch', 'figma', 'sketchchina'] },
	{ slug: 'ui-design-learning', keywords: ['ui教程', '设计教程', 'ux教程', 'imooc'] },
	{ slug: 'creative-courses', keywords: ['创意课程', '课程', '包装设计规范'] },
	{ slug: 'programming-tutorials', keywords: ['nodejs', 'swiftui', '程序设计', '教程', '入门'] },
	{ slug: 'git-engineering-learning', keywords: ['git', '工程实践', '代码规范', 'objc-zen'] },
	{ slug: 'tech-blogs', keywords: ['博客', 'blog', 'fatbobman', '阮一峰', '技术文章'] },
	{ slug: 'digital-literacy', keywords: ['数字素养', 'excel', 'office', '通识'] },
	{ slug: 'career-growth', keywords: ['求职', '职业成长', 'freelancer', '成长'] },
	{ slug: 'course-communities', keywords: ['训练营', '课程社区', '学习社区'] },

	{ slug: 'icon-resources', keywords: ['icon', '图标', 'iconfont', 'yesicon', 'glyphs'] },
	{ slug: 'illustration-resources', keywords: ['插画', 'illustration'] },
	{ slug: 'emoji-symbols', keywords: ['emoji', 'character', '符号'] },
	{ slug: 'website-templates', keywords: ['template', 'framer templates', '网站模板', 'saas模板'] },
	{ slug: 'ppt-templates', keywords: ['ppt模板', 'presentation template'] },
	{ slug: 'components-mockups', keywords: ['component', 'mockup', '组件', '样机'] },
	{ slug: 'image-libraries', keywords: ['图库', '图片', 'photo', '500px'] },
	{ slug: 'font-libraries', keywords: ['字体', 'font', '字库'] },
	{ slug: 'video-audio-assets', keywords: ['视频素材', 'bgm', '音效', '音频素材'] },

	{ slug: 'domain-services', keywords: ['域名', 'dns', 'whois'] },
	{ slug: 'site-builders', keywords: ['wordpress', 'webflow', 'framer', '建站'] },
	{ slug: 'site-hosting-tools', keywords: ['托管', 'hosting', '部署'] },
	{ slug: 'analytics-tools', keywords: ['analytics', '统计', '流量分析'] },
	{ slug: 'tracking-monitoring', keywords: ['监控', '日志', 'tracking'] },
	{ slug: 'feedback-tools', keywords: ['feedback', 'roadmap', '用户反馈'] },
	{ slug: 'seo-resources', keywords: ['seo', '站长'] },
	{ slug: 'indexing-submission', keywords: ['收录', '提交', 'sitemap', 'webmaster'] },
	{ slug: 'growth-automation', keywords: ['自动化', '批量', 'automation'] },

	{ slug: 'interior-home', keywords: ['家装', '室内', '装修', '酷家乐', '三维家'] },
	{ slug: '3d-models', keywords: ['3d模型', '3dwarehouse', 'sketchup', '模型'] },
	{ slug: 'interior-cases', keywords: ['室内案例', '别墅图库', '拓者设计吧'] },
	{ slug: 'bidding-gov', keywords: ['招投标'] },
	{ slug: 'public-services', keywords: ['政务', '公共服务'] },
	{ slug: 'enterprise-services', keywords: ['企业服务', 'b2b'] },
	{ slug: 'travel-sites', keywords: ['旅游', 'trip', '地图', '旅行'] },
	{ slug: 'health-sites', keywords: ['急救', '医疗', '健康'] },
	{ slug: 'education-exam-sites', keywords: ['考试', '教育', '软考', '认证'] },

	{ slug: 'ai-directory', keywords: ['ai导航', 'deepdh', 'ainav', 'aigc', 'ai-bot', '工具集'] },
	{ slug: 'creative-directory', keywords: ['设计导航', '优设导航', 'uxmap', '设计达人'] },
	{ slug: 'global-dev-directory', keywords: ['amz123', '开源工具导航', '看国外', '出海导航', 'publicapis'] },
	{ slug: 'directory-seeds', keywords: ['导航源', '网址大全', 'directory'] },
	{ slug: 'common-toolbox', keywords: ['常用工具', '网址大全', 'toolbox'] },
	{ slug: 'backlog-sites', keywords: [] }
];

function collectText(input: NavigationCurationInput) {
	return [
		input.name,
		input.url,
		input.desc ?? '',
		...(input.tags ?? [])
	]
		.join(' ')
		.toLowerCase();
}

function scoreRule(rule: Rule, domain: string, text: string) {
	let score = 0;
	for (const keyword of rule.keywords ?? []) {
		if (text.includes(keyword.toLowerCase())) score += 2;
	}
	for (const candidate of rule.domains ?? []) {
		if (domain === candidate || domain.endsWith(`.${candidate}`)) score += 4;
	}
	return score;
}

export function looksLikeNavigationSource(input: NavigationCurationInput) {
	const text = `${input.name} ${input.url}`.toLowerCase();
	return NAV_SOURCE_PATTERNS.some((pattern) => pattern.test(text));
}

export function shouldExcludeNavigationSite(input: NavigationCurationInput) {
	const domain = input.normalized_domain || normalizeDomain(input.url);
	const text = collectText(input);

	if (!domain) return true;
	if (BLOCKED_DOMAIN_PATTERNS.some((pattern) => pattern.test(domain))) return true;
	if (BLOCKED_TEXT_PATTERNS.some((pattern) => pattern.test(text))) return true;
	if (!/[\u4e00-\u9fa5a-z0-9]/i.test(input.name)) return true;

	return false;
}

export function inferCategorySlug(input: NavigationCurationInput, categories: FlatCategoryNode[] = DEFAULT_TAXONOMY_ROWS) {
	const text = collectText(input);
	const domain = input.normalized_domain || normalizeDomain(input.url);
	const leafCategories = getLeafCategories(categories);
	let best = findCategoryBySlug(categories, 'backlog-sites') ?? leafCategories[0];
	let bestScore = -1;

	if (looksLikeNavigationSource(input)) {
		if (/ai|aigc|chatgpt|claude|gemini/.test(text)) return 'ai-directory';
		if (/设计|ui|ux|素材|图标/.test(text)) return 'creative-directory';
		if (/出海|跨境|amazon|amz123|开源|api|开发/.test(text)) return 'global-dev-directory';
		return 'directory-seeds';
	}

	for (const leaf of leafCategories) {
		const rule = RULES.find((item) => item.slug === leaf.slug);
		if (!rule) continue;
		const score = scoreRule(rule, domain, text);
		if (score > bestScore) {
			bestScore = score;
			best = leaf;
		}
	}

	return best?.slug ?? 'backlog-sites';
}

export function buildNavigationTags(input: NavigationCurationInput, categorySlug: string) {
	const tags = new Set<string>();
	const text = collectText(input);
	const category = findCategoryBySlug(DEFAULT_TAXONOMY_ROWS, categorySlug);
	const topCategory = category ? buildTopCategoryName(category.id, DEFAULT_TAXONOMY_ROWS) : '';

	if (looksLikeNavigationSource(input)) tags.add('导航源');
	if (text.includes('ai')) tags.add('AI');
	if (/设计|ui|ux|品牌|包装/.test(text)) tags.add('设计');
	if (/开发|代码|api|github|git/.test(text)) tags.add('开发');
	if (/出海|跨境|amazon|shopify|1688|淘客/.test(text)) tags.add('跨境');
	if (/模板|图标|插画|字体|图库/.test(text)) tags.add('素材');
	if (/教程|课程|学习|指南/.test(text)) tags.add('学习');
	if (topCategory) tags.add(topCategory);
	if (categorySlug === 'backlog-sites') tags.add('待整理');

	return Array.from(tags).slice(0, 5);
}

function buildTopCategoryName(categoryId: number, rows: FlatCategoryNode[]) {
	const byId = new Map(rows.map((row) => [row.id, row]));
	let current = byId.get(categoryId);
	while (current?.parent_id) current = byId.get(current.parent_id);
	return current?.name ?? '';
}

export function curateSiteDraft<T extends NavigationCurationInput & { featured?: number; sort?: number }>(
	input: T,
	categories: FlatCategoryNode[] = DEFAULT_TAXONOMY_ROWS
) {
	if (shouldExcludeNavigationSite(input)) return null;
	const normalized_domain = input.normalized_domain || normalizeDomain(input.url);
	const category_slug = inferCategorySlug({ ...input, normalized_domain }, categories);
	const tags = buildNavigationTags({ ...input, normalized_domain }, category_slug);
	return {
		...input,
		normalized_domain,
		category_slug,
		tags,
		featured:
			input.featured ??
			(looksLikeNavigationSource(input) || category_slug !== 'backlog-sites' ? 1 : 0),
		sort: input.sort ?? (looksLikeNavigationSource(input) ? 10 : 100)
	};
}
