export type NavigationTaxonomySeed = {
	name: string;
	slug: string;
	description: string;
	children?: NavigationTaxonomySeed[];
};

export const NAVIGATION_TAXONOMY: NavigationTaxonomySeed[] = [
	{
		name: 'AI工具',
		slug: 'ai-tools',
		description: 'AI 助手、创作、自动化与提效工具。',
		children: [
			{
				name: 'AI助手',
				slug: 'ai-assistants',
				description: '聊天、编程与多模型助手。',
				children: [
					{ name: '通用助手', slug: 'general-ai-assistants', description: 'ChatGPT、Claude、Gemini 一类的通用智能助手。' },
					{ name: '编程助手', slug: 'coding-ai-assistants', description: '面向代码生成、调试与工程协作的 AI 工具。' },
					{ name: 'AI客户端', slug: 'ai-clients', description: '桌面端、网页端和多模型 AI 客户端。' }
				]
			},
			{
				name: 'AI创作',
				slug: 'ai-creation',
				description: 'AI 写作、图像、视频与音频创作。',
				children: [
					{ name: 'AI写作', slug: 'ai-writing', description: '文案、改写、排版与内容创作工具。' },
					{ name: 'AI图像', slug: 'ai-image-tools', description: '图片生成、修图、海报和品牌视觉工具。' },
					{ name: 'AI视频音频', slug: 'ai-video-audio', description: '视频生成、配音、本地化与录音转写。' }
				]
			},
			{
				name: 'AI效率',
				slug: 'ai-productivity',
				description: '文档、识别、自动化与工作流工具。',
				children: [
					{ name: 'OCR识别', slug: 'ocr-tools', description: '图片转文字、票据识别与扫描提取。' },
					{ name: 'PDF与文档', slug: 'pdf-document-tools', description: 'PDF 转换、编辑与结构化处理。' },
					{ name: '工作流自动化', slug: 'ai-automation', description: '自动化流程、智能体与任务编排工具。' }
				]
			}
		]
	},
	{
		name: '设计创意',
		slug: 'design-creative',
		description: '设计灵感、创意工具、界面与品牌视觉资源。',
		children: [
			{
				name: '设计灵感',
				slug: 'design-inspiration',
				description: '真实界面、作品画廊和创意参考。',
				children: [
					{ name: 'UI案例', slug: 'ui-cases', description: '真实产品界面、App 截图与 UI 画廊。' },
					{ name: '交互参考', slug: 'interaction-reference', description: '交互模式、流程细节与体验拆解。' },
					{ name: '品牌与包装', slug: 'brand-packaging', description: '品牌视觉、包装与平面创意案例。' }
				]
			},
			{
				name: '设计工具',
				slug: 'design-tools',
				description: '原型、配色、字体、动效与 3D 工具。',
				children: [
					{ name: '原型设计', slug: 'wireframe-prototype', description: '低保真原型、界面草图和页面搭建工具。' },
					{ name: '配色字体', slug: 'color-font-tools', description: '配色、字体、图标和品牌基础工具。' },
					{ name: '动效与3D', slug: 'motion-3d-tools', description: '动效、3D、Mockup 与展示图工具。' }
				]
			},
			{
				name: '设计社区',
				slug: 'design-community',
				description: '设计导航、UED 团队与设计社区。',
				children: [
					{ name: '设计导航', slug: 'design-directory', description: '优设导航、设计达人、Uxmap 等导航与入口。' },
					{ name: 'UED团队', slug: 'ued-teams', description: '各类企业设计团队、设计博客与风格库。' },
					{ name: '设计社区', slug: 'design-community-sites', description: '设计社区、作品社区与交流平台。' }
				]
			}
		]
	},
	{
		name: '开发编程',
		slug: 'development',
		description: '开发工具、开源资源、云服务与工程效率。',
		children: [
			{
				name: '开发资源',
				slug: 'developer-resources',
				description: 'API、开源、技术文档与工具导航。',
				children: [
					{ name: '开源导航', slug: 'open-source-directory', description: '开源工具目录、Awesome 列表与项目集合。' },
					{ name: 'API资源', slug: 'api-directory', description: '公共 API、接口平台与数据服务目录。' },
					{ name: '开发文档', slug: 'developer-docs', description: '技术文档、知识库和开发参考站点。' }
				]
			},
			{
				name: '云与部署',
				slug: 'cloud-deployment',
				description: '云平台、托管部署、监控与运维。',
				children: [
					{ name: '云平台', slug: 'cloud-platforms', description: '云主机、云服务与开发平台。' },
					{ name: '部署托管', slug: 'deployment-hosting', description: '静态托管、边缘部署与发布平台。' },
					{ name: '监控分析', slug: 'ops-observability', description: '埋点、监控、分析与性能观测工具。' }
				]
			},
			{
				name: '工程效率',
				slug: 'engineering-productivity',
				description: '代码协作、工程辅助与程序员效率工具。',
				children: [
					{ name: '代码协作', slug: 'code-collaboration', description: 'Git、代码规范、协作与版本管理。' },
					{ name: '开发工具', slug: 'developer-tools', description: '程序员常用工具、控制台与辅助服务。' },
					{ name: '工程学习', slug: 'engineering-learning', description: '编程学习、框架教程与技术博客。' }
				]
			}
		]
	},
	{
		name: '产品运营',
		slug: 'product-operations',
		description: '产品方法、用户运营、增长和商业化资源。',
		children: [
			{
				name: '产品方法',
				slug: 'product-methods',
				description: '产品教程、案例分析和发布指南。',
				children: [
					{ name: '产品教程', slug: 'product-tutorials', description: '产品设计、需求分析与方法论。' },
					{ name: '增长案例', slug: 'growth-cases', description: '增长策略、案例拆解与商业分析。' },
					{ name: '发布指南', slug: 'launch-guides', description: 'Product Hunt、发布与冷启动参考。' }
				]
			},
			{
				name: '用户运营',
				slug: 'user-operations',
				description: 'CRM、邮件、私域与用户沟通工具。',
				children: [
					{ name: 'CRM私域', slug: 'crm-growth', description: 'CRM、私域、邮件与用户管理工具。' },
					{ name: '社群运营', slug: 'community-ops', description: '社区、小圈子、问答与社群工具。' },
					{ name: '品牌案例', slug: 'brand-cases', description: '品牌传播、商业案例与运营素材。' }
				]
			},
			{
				name: '增长工具',
				slug: 'growth-tooling',
				description: '增长数据、实验与转化工具。',
				children: [
					{ name: '增长分析', slug: 'growth-analytics', description: '数据分析、漏斗、留存与投放分析。' },
					{ name: '转化工具', slug: 'conversion-tools', description: '表单、落地页、转化与用户触达工具。' },
					{ name: '商业化工具', slug: 'monetization-tools', description: '支付、订阅、定价与营收工具。' }
				]
			}
		]
	},
	{
		name: '内容营销',
		slug: 'content-marketing',
		description: '内容生产、社媒传播、广告投放与资讯社区。',
		children: [
			{
				name: '内容生产',
				slug: 'content-production',
				description: '公众号、小红书、视频与文案工具。',
				children: [
					{ name: '内容创作', slug: 'social-content', description: '社媒文案、小红书、公众号与内容生成。' },
					{ name: '排版发布', slug: 'content-publishing', description: '图文排版、分发与发布工具。' },
					{ name: '短视频工具', slug: 'short-video-tools', description: '短视频剪辑、字幕、封面与配音工具。' }
				]
			},
			{
				name: '广告投放',
				slug: 'ads-seo',
				description: 'SEO、广告、联盟与增长投放。',
				children: [
					{ name: 'SEO工具', slug: 'seo-tools', description: 'SEO、关键词、SERP 与内容优化工具。' },
					{ name: '投放工具', slug: 'ads-tools', description: '广告创意、投放管理与归因工具。' },
					{ name: '联盟营销', slug: 'affiliate-marketing', description: '联盟、返佣、淘客与导购资源。' }
				]
			},
			{
				name: '媒体社区',
				slug: 'media-communities',
				description: '行业媒体、论坛与内容社区。',
				children: [
					{ name: '行业媒体', slug: 'industry-media', description: '行业资讯、商业媒体与观察平台。' },
					{ name: '论坛社区', slug: 'forum-communities', description: '论坛、问答与兴趣社区。' },
					{ name: '创作者社区', slug: 'creator-communities', description: '创作者、知识社群与内容社区。' }
				]
			}
		]
	},
	{
		name: '电商与跨境',
		slug: 'commerce-global',
		description: '电商平台、出海工具、物流合规与海外资源。',
		children: [
			{
				name: '电商平台',
				slug: 'commerce-platforms',
				description: '平台、选品、货源与电商入口。',
				children: [
					{ name: '跨境平台', slug: 'cross-border-platforms', description: 'Amazon、Shopee、独立站与海外平台。' },
					{ name: '货源与选品', slug: 'sourcing-selection', description: '1688、分销、货源与选品资源。' },
					{ name: '电商导航', slug: 'commerce-directory', description: '电商、淘客、跨境导航与聚合站。' }
				]
			},
			{
				name: '服务工具',
				slug: 'commerce-services',
				description: '店铺、物流、收款与合规服务。',
				children: [
					{ name: '店铺工具', slug: 'store-tools', description: '运营、铺货、采集、店铺管理工具。' },
					{ name: '物流收款', slug: 'logistics-payments', description: '物流、支付、结算与财税相关服务。' },
					{ name: '商标合规', slug: 'compliance-ip', description: '商标、专利、注册与合规服务。' }
				]
			},
			{
				name: '出海资源',
				slug: 'global-resources',
				description: '出海导航、本地化与海外资源。',
				children: [
					{ name: '出海导航', slug: 'global-directory', description: '出海资源、跨境信息与导航站。' },
					{ name: '本地化工具', slug: 'localization-tools', description: '翻译、配音、本地化与多语言工具。' },
					{ name: '海外资源', slug: 'overseas-resources', description: '海外网站、国外资源与市场入口。' }
				]
			}
		]
	},
	{
		name: '办公效率',
		slug: 'office-productivity',
		description: '文档协作、通用软件、搜索与效率工具。',
		children: [
			{
				name: '文档协作',
				slug: 'document-collaboration',
				description: '文档、表格、PPT 与知识库工具。',
				children: [
					{ name: '文档表格', slug: 'docs-sheets', description: '文档、表格、云文档与协作工具。' },
					{ name: '演示PPT', slug: 'presentation-tools', description: 'PPT、演示、幻灯与汇报工具。' },
					{ name: '知识管理', slug: 'knowledge-management', description: '知识库、笔记与团队知识管理。' }
				]
			},
			{
				name: '通用软件',
				slug: 'general-software',
				description: '下载、转换、录屏与系统工具。',
				children: [
					{ name: '系统工具', slug: 'system-tools', description: 'Mac、Windows 与系统维护工具。' },
					{ name: '转换下载', slug: 'conversion-download', description: '格式转换、下载与解析工具。' },
					{ name: '录屏截图', slug: 'capture-recording', description: '截图、录屏、标注与演示录制工具。' }
				]
			},
			{
				name: '搜索导航',
				slug: 'search-navigation',
				description: '搜索引擎、常用入口和导航聚合。',
				children: [
					{ name: '搜索引擎', slug: 'search-engines', description: '百度、Google 等搜索入口。' },
					{ name: '常用网站', slug: 'common-websites', description: '邮箱、浏览器常用页与通用入口。' },
					{ name: '效率导航', slug: 'general-tools', description: '通用工具、效率站点和实用入口。' }
				]
			}
		]
	},
	{
		name: '学习教程',
		slug: 'learning',
		description: '设计、开发与通识类学习站点和教程资源。',
		children: [
			{
				name: '设计学习',
				slug: 'design-learning',
				description: 'Sketch、Figma、UI 与创意课程。',
				children: [
					{ name: 'Sketch与Figma', slug: 'sketch-figma-learning', description: 'Sketch、Figma 与界面设计学习。' },
					{ name: 'UI设计教程', slug: 'ui-design-learning', description: 'UI、UX、视觉与创意教程。' },
					{ name: '创意课程', slug: 'creative-courses', description: '品牌、包装、创意相关课程。' }
				]
			},
			{
				name: '开发学习',
				slug: 'developer-learning',
				description: '编程教程、框架实践与技术博客。',
				children: [
					{ name: '编程教程', slug: 'programming-tutorials', description: '编程语言、框架与技术教程。' },
					{ name: 'Git与工程', slug: 'git-engineering-learning', description: 'Git、工程实践、协作与规范学习。' },
					{ name: '技术博客', slug: 'tech-blogs', description: '独立开发者、技术博客与知识文章。' }
				]
			},
			{
				name: '通识成长',
				slug: 'general-learning',
				description: '通识、职业成长与学习社区。',
				children: [
					{ name: '数字素养', slug: 'digital-literacy', description: '数字素养、效率与通识提升。' },
					{ name: '职业成长', slug: 'career-growth', description: '求职、成长、个人品牌与职业发展。' },
					{ name: '课程社区', slug: 'course-communities', description: '训练营、课程社区与知识社群。' }
				]
			}
		]
	},
	{
		name: '资源素材',
		slug: 'resources-assets',
		description: '图标、模板、字体、图库和可复用素材。',
		children: [
			{
				name: '图标插画',
				slug: 'icons-illustrations',
				description: '图标、插画、emoji 与视觉资源。',
				children: [
					{ name: '图标资源', slug: 'icon-resources', description: '图标库、图标系统与矢量资源。' },
					{ name: '插画资源', slug: 'illustration-resources', description: '插画、贴纸与视觉辅助素材。' },
					{ name: '表情符号', slug: 'emoji-symbols', description: 'Emoji、符号与特殊字符资源。' }
				]
			},
			{
				name: '模板组件',
				slug: 'templates-components',
				description: '模板、组件、样机和展示资源。',
				children: [
					{ name: '网站模板', slug: 'website-templates', description: '网站、落地页、SaaS 与应用模板。' },
					{ name: 'PPT模板', slug: 'ppt-templates', description: 'PPT、Keynote 与演示模板。' },
					{ name: '组件样机', slug: 'components-mockups', description: 'UI 组件、Mockup 与素材套件。' }
				]
			},
			{
				name: '图片字体音视频',
				slug: 'media-assets',
				description: '图库、字体、视频和音频资源。',
				children: [
					{ name: '图库图片', slug: 'image-libraries', description: '图片、摄影、图库与参考素材。' },
					{ name: '字体字库', slug: 'font-libraries', description: '字体、字形与字体工具。' },
					{ name: '视频音频素材', slug: 'video-audio-assets', description: '视频、BGM、音效与多媒体素材。' }
				]
			}
		]
	},
	{
		name: '站长建站',
		slug: 'webmaster-growth',
		description: '建站、域名、SEO、统计与网站增长工具。',
		children: [
			{
				name: '建站托管',
				slug: 'site-hosting',
				description: '域名、托管与站点服务。',
				children: [
					{ name: '域名服务', slug: 'domain-services', description: '域名、备案、DNS 与相关服务。' },
					{ name: '建站平台', slug: 'site-builders', description: '建站平台、低代码与落地页工具。' },
					{ name: '托管部署', slug: 'site-hosting-tools', description: '站点托管、静态部署与发布。' }
				]
			},
			{
				name: '数据分析',
				slug: 'site-analytics',
				description: '统计、监控、反馈与站点优化。',
				children: [
					{ name: '网站分析', slug: 'analytics-tools', description: '网站流量、分析与行为数据工具。' },
					{ name: '埋点监控', slug: 'tracking-monitoring', description: '埋点、监控、日志与性能工具。' },
					{ name: '用户反馈', slug: 'feedback-tools', description: '反馈、工单、调研与用户声音。' }
				]
			},
			{
				name: 'SEO增长',
				slug: 'site-growth',
				description: 'SEO、收录与站点增长相关工具。',
				children: [
					{ name: 'SEO资源', slug: 'seo-resources', description: 'SEO 导航、内容优化与搜索工具。' },
					{ name: '收录提交', slug: 'indexing-submission', description: '站点提交、收录、站长平台入口。' },
					{ name: '自动化增长', slug: 'growth-automation', description: '批量发布、自动化和增长辅助工具。' }
				]
			}
		]
	},
	{
		name: '行业垂直',
		slug: 'vertical-industries',
		description: '家装、政企和其它垂直行业站点。',
		children: [
			{
				name: '家装空间',
				slug: 'interior-architecture',
				description: '家装、室内、建筑和 3D 空间资源。',
				children: [
					{ name: '家装设计', slug: 'interior-home', description: '家装设计、案例、灵感与工具。' },
					{ name: '3D模型', slug: '3d-models', description: '3D 模型、SketchUp 与建模资源。' },
					{ name: '室内案例', slug: 'interior-cases', description: '室内设计案例、图库与行业站点。' }
				]
			},
			{
				name: '政企公共',
				slug: 'gov-enterprise',
				description: '招投标、政企与公共服务资源。',
				children: [
					{ name: '招投标', slug: 'bidding-gov', description: '招投标平台和政企相关导航。' },
					{ name: '政企服务', slug: 'public-services', description: '公共服务、政务和行业平台。' },
					{ name: '企业服务', slug: 'enterprise-services', description: '企业工具、B2B 服务与行业平台。' }
				]
			},
			{
				name: '其它垂直',
				slug: 'other-verticals',
				description: '旅游、医疗、考试等其他行业站点。',
				children: [
					{ name: '旅游出行', slug: 'travel-sites', description: '旅游、地图、行程与出行相关站点。' },
					{ name: '医疗健康', slug: 'health-sites', description: '医疗、健康与急救类站点。' },
					{ name: '考试教育', slug: 'education-exam-sites', description: '考试、教育和职业认证资源。' }
				]
			}
		]
	},
	{
		name: '综合导航',
		slug: 'general-directory',
		description: '作为入口的导航站、综合目录和待整理内容。',
		children: [
			{
				name: '专题导航',
				slug: 'specialized-directory',
				description: 'AI、设计、开发和出海导航入口。',
				children: [
					{ name: 'AI导航', slug: 'ai-directory', description: 'AI 工具导航、AIGC 导航与 AI 目录。' },
					{ name: '设计导航', slug: 'creative-directory', description: '设计、素材与创意导航类站点。' },
					{ name: '出海开发导航', slug: 'global-dev-directory', description: '开发、出海、电商等领域导航。' }
				]
			},
			{
				name: '综合目录',
				slug: 'general-collection',
				description: '通用收录、导航源和常用入口。',
				children: [
					{ name: '导航源', slug: 'directory-seeds', description: '作为数据源的导航站入口。' },
					{ name: '常用工具', slug: 'common-toolbox', description: '通用工具、网址大全和实用入口。' },
					{ name: '待整理站点', slug: 'backlog-sites', description: '暂时难以归类、等待后续精修的站点。' }
				]
			}
		]
	}
];
