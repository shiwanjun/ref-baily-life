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

type TaxonomySeed = {
	name: string;
	slug: string;
	description: string;
	children?: TaxonomySeed[];
};

export const DEFAULT_TAXONOMY: TaxonomySeed[] = [
	{
		name: 'AI工具',
		slug: 'ai-tools',
		description: 'AI 模型、创作、效率和导航工具总览。',
		children: [
			{
				name: 'AI设计',
				slug: 'ai-design',
				description: 'AI 驱动的界面、视觉和品牌设计工具。',
				children: [
					{ name: 'UI生成', slug: 'ui-generation', description: '生成界面草图、组件和页面结构。' },
					{ name: 'Logo生成', slug: 'logo-generation', description: '品牌标识与视觉符号生成。' },
					{ name: '配色工具', slug: 'color-tools', description: '颜色搭配、主题和视觉风格工具。' },
					{ name: '原型与界面草图', slug: 'wireframe-prototype', description: '低保真原型、界面草图和流程图。' }
				]
			},
			{
				name: 'AI写作',
				slug: 'ai-writing',
				description: '文案、内容改写和社媒创作。',
				children: [
					{ name: '文案生成', slug: 'copywriting', description: '品牌、产品和营销文案创作。' },
					{ name: '内容改写', slug: 'rewriting', description: '润色、摘要、重写和翻译工具。' },
					{ name: '社媒创作', slug: 'social-content', description: '小红书、公众号、短内容创作。' }
				]
			},
			{
				name: 'AI图像与视频',
				slug: 'ai-media',
				description: '图片、视频和音频生成工具。',
				children: [
					{ name: '图片生成', slug: 'image-generation', description: '图像生成、编辑和风格化工具。' },
					{ name: '视频生成', slug: 'video-generation', description: 'AI 视频生成与角色动画工具。' },
					{ name: '配音与本地化', slug: 'voice-localization', description: '配音、翻译和视频本地化工具。' }
				]
			},
			{
				name: 'AI效率',
				slug: 'ai-productivity',
				description: 'AI 客户端、OCR、文档和效率增强工具。',
				children: [
					{ name: 'OCR', slug: 'ocr', description: '图文识别、扫描和文字提取。' },
					{ name: 'PDF工具', slug: 'pdf-tools', description: 'PDF 转换、编辑和结构化处理。' },
					{ name: 'AI客户端', slug: 'ai-clients', description: '桌面端、网页端和多模型 AI 客户端。' }
				]
			},
			{
				name: 'AI导航',
				slug: 'ai-navigation',
				description: 'AI 导航入口与工具目录。',
				children: [
					{ name: 'AI综合导航', slug: 'ai-directory', description: '综合 AI 导航站与入口页。' },
					{ name: 'AIGC导航', slug: 'aigc-directory', description: 'AIGC 工具与创作导航。' },
					{ name: 'AI工具目录', slug: 'ai-tool-directory', description: '聚焦 AI 工具的目录型站点。' }
				]
			}
		]
	},
	{
		name: '设计',
		slug: 'design',
		description: '设计导航、灵感、工具与学习资源。',
		children: [
			{
				name: '设计导航',
				slug: 'design-navigation',
				description: '综合设计导航与资源站入口。',
				children: [
					{ name: '综合设计导航', slug: 'design-directory', description: '设计导航首页和综合入口。' },
					{ name: '设计资源站', slug: 'design-resources', description: '设计资源、素材和聚合站点。' },
					{ name: '设计灵感入口', slug: 'design-inspiration-entry', description: '灵感集合、作品展示和案例入口。' }
				]
			},
			{
				name: 'UI/UX',
				slug: 'ui-ux',
				description: '界面案例、交互与组件参考。',
				children: [
					{ name: '界面案例', slug: 'ui-cases', description: '真实产品页面和界面案例。' },
					{ name: '交互参考', slug: 'interaction-reference', description: '交互模式、流程与体验细节。' },
					{ name: '空状态与组件', slug: 'components-empty-states', description: '组件库、空状态和局部模式。' }
				]
			},
			{
				name: '设计工具',
				slug: 'design-tools',
				description: '原型、动效、展示和演示工具。',
				children: [
					{ name: 'Mockup', slug: 'mockup', description: '展示图、包装图和设备样机。' },
					{ name: '动效', slug: 'motion', description: '动画、过渡和演示动效。' },
					{ name: '演示与幻灯', slug: 'slides-presentation', description: '演示、幻灯和展示型文档。' }
				]
			},
			{
				name: '设计学习',
				slug: 'design-learning',
				description: '设计课程、文章和社区。',
				children: [
					{ name: 'Sketch', slug: 'sketch-learning', description: 'Sketch 与界面设计学习。' },
					{ name: '产品设计文章', slug: 'product-design-articles', description: '产品设计、交互和方法论文章。' },
					{ name: '设计社区', slug: 'design-community', description: '设计作品社区与交流平台。' }
				]
			}
		]
	},
	{
		name: '产品与增长',
		slug: 'product-growth',
		description: '产品、增长和发布相关资源。',
		children: [
			{
				name: '产品方法',
				slug: 'product-methods',
				description: '产品思维、方法论与案例。',
				children: [
					{ name: '产品教程', slug: 'product-tutorials', description: '产品流程、方法论和入门内容。' },
					{ name: '增长案例', slug: 'growth-cases', description: '增长分析、案例与实践。' },
					{ name: '发布指南', slug: 'launch-guides', description: 'Product Hunt、发布和营销指南。' }
				]
			},
			{
				name: '内容与运营',
				slug: 'content-ops',
				description: '内容生产、社媒和私域增长。',
				children: [
					{ name: '社媒工具', slug: 'social-tools', description: '社媒发布、数据和排版工具。' },
					{ name: '邮件与私域', slug: 'crm-growth', description: '邮件、CRM 和用户运营工具。' },
					{ name: '品牌与案例', slug: 'brand-cases', description: '品牌、案例和增长素材。' }
				]
			}
		]
	},
	{
		name: '出海与跨境',
		slug: 'global-expansion',
		description: '跨境电商、出海工具和本地化资源。',
		children: [
			{
				name: '出海导航',
				slug: 'global-directory',
				description: '出海和跨境资源导航。',
				children: [
					{ name: '出海资源导航', slug: 'global-resources', description: '出海资源和服务入口。' },
					{ name: '跨境电商导航', slug: 'cross-border-commerce', description: '跨境电商和平台导航。' },
					{ name: '海外网址导航', slug: 'overseas-directory', description: '海外站点和外部导航集合。' }
				]
			},
			{
				name: '跨境工具',
				slug: 'global-tools',
				description: '页面部署、本地化和内容生产工具。',
				children: [
					{ name: '页面部署', slug: 'page-deployment', description: '静态站、边缘部署和托管平台。' },
					{ name: '本地化工具', slug: 'localization-tools', description: '翻译、配音和国际化工具。' },
					{ name: '内容生成', slug: 'global-content', description: '跨境内容生产和营销工具。' }
				]
			}
		]
	},
	{
		name: '开发与开源',
		slug: 'dev-open-source',
		description: '开发工具、API 和开源资源。',
		children: [
			{
				name: '开源导航',
				slug: 'open-source-directory',
				description: '开源工具目录与导航入口。',
				children: [
					{ name: '开源工具导航', slug: 'open-source-tools', description: '开源应用和效率工具。' },
					{ name: 'API目录', slug: 'api-directory', description: '公共 API 和开发资源目录。' },
					{ name: '开发导航', slug: 'dev-directory', description: '开发学习、文档和技术导航。' }
				]
			},
			{
				name: '开发工具',
				slug: 'developer-tools',
				description: '分析、文档与开发支持工具。',
				children: [
					{ name: '分析工具', slug: 'analytics-tools', description: '分析与性能观测工具。' },
					{ name: '文档工具', slug: 'docs-tools', description: '文档、知识库和技术写作工具。' },
					{ name: '工程效率', slug: 'engineering-productivity', description: '开发协作、工程和效率工具。' }
				]
			}
		]
	},
	{
		name: '资源与素材',
		slug: 'resources-assets',
		description: '资源、素材、模板和图库。',
		children: [
			{
				name: '素材资源',
				slug: 'assets',
				description: '模板、图标、样机和可复用资源。',
				children: [
					{ name: '模板', slug: 'templates', description: '页面、组件和产品模板。' },
					{ name: '图标与插画', slug: 'icons-illustrations', description: '图标、插画和视觉资源。' },
					{ name: '图库与图片', slug: 'image-libraries', description: '图片、摄影和图像资源。' }
				]
			}
		]
	},
	{
		name: '综合导航',
		slug: 'general-directory',
		description: '跨主题综合导航与行业入口。',
		children: [
			{
				name: '行业导航',
				slug: 'industry-directory',
				description: '行业型、专业型导航入口。',
				children: [
					{ name: '招投标与政企', slug: 'bidding-gov', description: '招投标和专业行业导航。' },
					{ name: '室内与家装', slug: 'interior-home', description: '室内设计与家装相关导航。' },
					{ name: '电商与淘客', slug: 'ecommerce-affiliate', description: '电商、淘客与导购导航。' }
				]
			},
			{
				name: '通用收录',
				slug: 'general-collection',
				description: '暂无法细分、但具备收录价值的常用站点。',
				children: [
					{ name: '常用工具', slug: 'general-tools', description: '通用工具、效率站点和常用入口。' },
					{ name: '导航源', slug: 'directory-seeds', description: '作为数据源的导航站入口。' },
					{ name: '待整理站点', slug: 'backlog-sites', description: '暂存与后续细化整理的站点。' }
				]
			}
		]
	}
];

export function flattenTaxonomy(tree: TaxonomySeed[] = DEFAULT_TAXONOMY) {
	const rows: FlatCategoryNode[] = [];
	let id = 1;

	function walk(nodes: TaxonomySeed[], parentId: number | null, level: CategoryLevel) {
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
