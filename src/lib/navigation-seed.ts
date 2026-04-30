import type { ImportBundle } from './server/navigation-import';

export const bundledNavigationSeed: ImportBundle = {
  "categories": [
    {
      "id": 1,
      "name": "AI工具",
      "slug": "ai-tools",
      "description": "AI 模型、创作、效率和导航工具总览。",
      "parent_id": null,
      "level": 1,
      "sort": 10
    },
    {
      "id": 2,
      "name": "AI设计",
      "slug": "ai-design",
      "description": "AI 驱动的界面、视觉和品牌设计工具。",
      "parent_id": 1,
      "level": 2,
      "sort": 10
    },
    {
      "id": 3,
      "name": "UI生成",
      "slug": "ui-generation",
      "description": "生成界面草图、组件和页面结构。",
      "parent_id": 2,
      "level": 3,
      "sort": 10
    },
    {
      "id": 4,
      "name": "Logo生成",
      "slug": "logo-generation",
      "description": "品牌标识与视觉符号生成。",
      "parent_id": 2,
      "level": 3,
      "sort": 20
    },
    {
      "id": 5,
      "name": "配色工具",
      "slug": "color-tools",
      "description": "颜色搭配、主题和视觉风格工具。",
      "parent_id": 2,
      "level": 3,
      "sort": 30
    },
    {
      "id": 6,
      "name": "原型与界面草图",
      "slug": "wireframe-prototype",
      "description": "低保真原型、界面草图和流程图。",
      "parent_id": 2,
      "level": 3,
      "sort": 40
    },
    {
      "id": 7,
      "name": "AI写作",
      "slug": "ai-writing",
      "description": "文案、内容改写和社媒创作。",
      "parent_id": 1,
      "level": 2,
      "sort": 20
    },
    {
      "id": 8,
      "name": "文案生成",
      "slug": "copywriting",
      "description": "品牌、产品和营销文案创作。",
      "parent_id": 7,
      "level": 3,
      "sort": 10
    },
    {
      "id": 9,
      "name": "内容改写",
      "slug": "rewriting",
      "description": "润色、摘要、重写和翻译工具。",
      "parent_id": 7,
      "level": 3,
      "sort": 20
    },
    {
      "id": 10,
      "name": "社媒创作",
      "slug": "social-content",
      "description": "小红书、公众号、短内容创作。",
      "parent_id": 7,
      "level": 3,
      "sort": 30
    },
    {
      "id": 11,
      "name": "AI图像与视频",
      "slug": "ai-media",
      "description": "图片、视频和音频生成工具。",
      "parent_id": 1,
      "level": 2,
      "sort": 30
    },
    {
      "id": 12,
      "name": "图片生成",
      "slug": "image-generation",
      "description": "图像生成、编辑和风格化工具。",
      "parent_id": 11,
      "level": 3,
      "sort": 10
    },
    {
      "id": 13,
      "name": "视频生成",
      "slug": "video-generation",
      "description": "AI 视频生成与角色动画工具。",
      "parent_id": 11,
      "level": 3,
      "sort": 20
    },
    {
      "id": 14,
      "name": "配音与本地化",
      "slug": "voice-localization",
      "description": "配音、翻译和视频本地化工具。",
      "parent_id": 11,
      "level": 3,
      "sort": 30
    },
    {
      "id": 15,
      "name": "AI效率",
      "slug": "ai-productivity",
      "description": "AI 客户端、OCR、文档和效率增强工具。",
      "parent_id": 1,
      "level": 2,
      "sort": 40
    },
    {
      "id": 16,
      "name": "OCR",
      "slug": "ocr",
      "description": "图文识别、扫描和文字提取。",
      "parent_id": 15,
      "level": 3,
      "sort": 10
    },
    {
      "id": 17,
      "name": "PDF工具",
      "slug": "pdf-tools",
      "description": "PDF 转换、编辑和结构化处理。",
      "parent_id": 15,
      "level": 3,
      "sort": 20
    },
    {
      "id": 18,
      "name": "AI客户端",
      "slug": "ai-clients",
      "description": "桌面端、网页端和多模型 AI 客户端。",
      "parent_id": 15,
      "level": 3,
      "sort": 30
    },
    {
      "id": 19,
      "name": "AI导航",
      "slug": "ai-navigation",
      "description": "AI 导航入口与工具目录。",
      "parent_id": 1,
      "level": 2,
      "sort": 50
    },
    {
      "id": 20,
      "name": "AI综合导航",
      "slug": "ai-directory",
      "description": "综合 AI 导航站与入口页。",
      "parent_id": 19,
      "level": 3,
      "sort": 10
    },
    {
      "id": 21,
      "name": "AIGC导航",
      "slug": "aigc-directory",
      "description": "AIGC 工具与创作导航。",
      "parent_id": 19,
      "level": 3,
      "sort": 20
    },
    {
      "id": 22,
      "name": "AI工具目录",
      "slug": "ai-tool-directory",
      "description": "聚焦 AI 工具的目录型站点。",
      "parent_id": 19,
      "level": 3,
      "sort": 30
    },
    {
      "id": 23,
      "name": "设计",
      "slug": "design",
      "description": "设计导航、灵感、工具与学习资源。",
      "parent_id": null,
      "level": 1,
      "sort": 20
    },
    {
      "id": 24,
      "name": "设计导航",
      "slug": "design-navigation",
      "description": "综合设计导航与资源站入口。",
      "parent_id": 23,
      "level": 2,
      "sort": 10
    },
    {
      "id": 25,
      "name": "综合设计导航",
      "slug": "design-directory",
      "description": "设计导航首页和综合入口。",
      "parent_id": 24,
      "level": 3,
      "sort": 10
    },
    {
      "id": 26,
      "name": "设计资源站",
      "slug": "design-resources",
      "description": "设计资源、素材和聚合站点。",
      "parent_id": 24,
      "level": 3,
      "sort": 20
    },
    {
      "id": 27,
      "name": "设计灵感入口",
      "slug": "design-inspiration-entry",
      "description": "灵感集合、作品展示和案例入口。",
      "parent_id": 24,
      "level": 3,
      "sort": 30
    },
    {
      "id": 28,
      "name": "UI/UX",
      "slug": "ui-ux",
      "description": "界面案例、交互与组件参考。",
      "parent_id": 23,
      "level": 2,
      "sort": 20
    },
    {
      "id": 29,
      "name": "界面案例",
      "slug": "ui-cases",
      "description": "真实产品页面和界面案例。",
      "parent_id": 28,
      "level": 3,
      "sort": 10
    },
    {
      "id": 30,
      "name": "交互参考",
      "slug": "interaction-reference",
      "description": "交互模式、流程与体验细节。",
      "parent_id": 28,
      "level": 3,
      "sort": 20
    },
    {
      "id": 31,
      "name": "空状态与组件",
      "slug": "components-empty-states",
      "description": "组件库、空状态和局部模式。",
      "parent_id": 28,
      "level": 3,
      "sort": 30
    },
    {
      "id": 32,
      "name": "设计工具",
      "slug": "design-tools",
      "description": "原型、动效、展示和演示工具。",
      "parent_id": 23,
      "level": 2,
      "sort": 30
    },
    {
      "id": 33,
      "name": "Mockup",
      "slug": "mockup",
      "description": "展示图、包装图和设备样机。",
      "parent_id": 32,
      "level": 3,
      "sort": 10
    },
    {
      "id": 34,
      "name": "动效",
      "slug": "motion",
      "description": "动画、过渡和演示动效。",
      "parent_id": 32,
      "level": 3,
      "sort": 20
    },
    {
      "id": 35,
      "name": "演示与幻灯",
      "slug": "slides-presentation",
      "description": "演示、幻灯和展示型文档。",
      "parent_id": 32,
      "level": 3,
      "sort": 30
    },
    {
      "id": 36,
      "name": "设计学习",
      "slug": "design-learning",
      "description": "设计课程、文章和社区。",
      "parent_id": 23,
      "level": 2,
      "sort": 40
    },
    {
      "id": 37,
      "name": "Sketch",
      "slug": "sketch-learning",
      "description": "Sketch 与界面设计学习。",
      "parent_id": 36,
      "level": 3,
      "sort": 10
    },
    {
      "id": 38,
      "name": "产品设计文章",
      "slug": "product-design-articles",
      "description": "产品设计、交互和方法论文章。",
      "parent_id": 36,
      "level": 3,
      "sort": 20
    },
    {
      "id": 39,
      "name": "设计社区",
      "slug": "design-community",
      "description": "设计作品社区与交流平台。",
      "parent_id": 36,
      "level": 3,
      "sort": 30
    },
    {
      "id": 40,
      "name": "产品与增长",
      "slug": "product-growth",
      "description": "产品、增长和发布相关资源。",
      "parent_id": null,
      "level": 1,
      "sort": 30
    },
    {
      "id": 41,
      "name": "产品方法",
      "slug": "product-methods",
      "description": "产品思维、方法论与案例。",
      "parent_id": 40,
      "level": 2,
      "sort": 10
    },
    {
      "id": 42,
      "name": "产品教程",
      "slug": "product-tutorials",
      "description": "产品流程、方法论和入门内容。",
      "parent_id": 41,
      "level": 3,
      "sort": 10
    },
    {
      "id": 43,
      "name": "增长案例",
      "slug": "growth-cases",
      "description": "增长分析、案例与实践。",
      "parent_id": 41,
      "level": 3,
      "sort": 20
    },
    {
      "id": 44,
      "name": "发布指南",
      "slug": "launch-guides",
      "description": "Product Hunt、发布和营销指南。",
      "parent_id": 41,
      "level": 3,
      "sort": 30
    },
    {
      "id": 45,
      "name": "内容与运营",
      "slug": "content-ops",
      "description": "内容生产、社媒和私域增长。",
      "parent_id": 40,
      "level": 2,
      "sort": 20
    },
    {
      "id": 46,
      "name": "社媒工具",
      "slug": "social-tools",
      "description": "社媒发布、数据和排版工具。",
      "parent_id": 45,
      "level": 3,
      "sort": 10
    },
    {
      "id": 47,
      "name": "邮件与私域",
      "slug": "crm-growth",
      "description": "邮件、CRM 和用户运营工具。",
      "parent_id": 45,
      "level": 3,
      "sort": 20
    },
    {
      "id": 48,
      "name": "品牌与案例",
      "slug": "brand-cases",
      "description": "品牌、案例和增长素材。",
      "parent_id": 45,
      "level": 3,
      "sort": 30
    },
    {
      "id": 49,
      "name": "出海与跨境",
      "slug": "global-expansion",
      "description": "跨境电商、出海工具和本地化资源。",
      "parent_id": null,
      "level": 1,
      "sort": 40
    },
    {
      "id": 50,
      "name": "出海导航",
      "slug": "global-directory",
      "description": "出海和跨境资源导航。",
      "parent_id": 49,
      "level": 2,
      "sort": 10
    },
    {
      "id": 51,
      "name": "出海资源导航",
      "slug": "global-resources",
      "description": "出海资源和服务入口。",
      "parent_id": 50,
      "level": 3,
      "sort": 10
    },
    {
      "id": 52,
      "name": "跨境电商导航",
      "slug": "cross-border-commerce",
      "description": "跨境电商和平台导航。",
      "parent_id": 50,
      "level": 3,
      "sort": 20
    },
    {
      "id": 53,
      "name": "海外网址导航",
      "slug": "overseas-directory",
      "description": "海外站点和外部导航集合。",
      "parent_id": 50,
      "level": 3,
      "sort": 30
    },
    {
      "id": 54,
      "name": "跨境工具",
      "slug": "global-tools",
      "description": "页面部署、本地化和内容生产工具。",
      "parent_id": 49,
      "level": 2,
      "sort": 20
    },
    {
      "id": 55,
      "name": "页面部署",
      "slug": "page-deployment",
      "description": "静态站、边缘部署和托管平台。",
      "parent_id": 54,
      "level": 3,
      "sort": 10
    },
    {
      "id": 56,
      "name": "本地化工具",
      "slug": "localization-tools",
      "description": "翻译、配音和国际化工具。",
      "parent_id": 54,
      "level": 3,
      "sort": 20
    },
    {
      "id": 57,
      "name": "内容生成",
      "slug": "global-content",
      "description": "跨境内容生产和营销工具。",
      "parent_id": 54,
      "level": 3,
      "sort": 30
    },
    {
      "id": 58,
      "name": "开发与开源",
      "slug": "dev-open-source",
      "description": "开发工具、API 和开源资源。",
      "parent_id": null,
      "level": 1,
      "sort": 50
    },
    {
      "id": 59,
      "name": "开源导航",
      "slug": "open-source-directory",
      "description": "开源工具目录与导航入口。",
      "parent_id": 58,
      "level": 2,
      "sort": 10
    },
    {
      "id": 60,
      "name": "开源工具导航",
      "slug": "open-source-tools",
      "description": "开源应用和效率工具。",
      "parent_id": 59,
      "level": 3,
      "sort": 10
    },
    {
      "id": 61,
      "name": "API目录",
      "slug": "api-directory",
      "description": "公共 API 和开发资源目录。",
      "parent_id": 59,
      "level": 3,
      "sort": 20
    },
    {
      "id": 62,
      "name": "开发导航",
      "slug": "dev-directory",
      "description": "开发学习、文档和技术导航。",
      "parent_id": 59,
      "level": 3,
      "sort": 30
    },
    {
      "id": 63,
      "name": "开发工具",
      "slug": "developer-tools",
      "description": "分析、文档与开发支持工具。",
      "parent_id": 58,
      "level": 2,
      "sort": 20
    },
    {
      "id": 64,
      "name": "分析工具",
      "slug": "analytics-tools",
      "description": "分析与性能观测工具。",
      "parent_id": 63,
      "level": 3,
      "sort": 10
    },
    {
      "id": 65,
      "name": "文档工具",
      "slug": "docs-tools",
      "description": "文档、知识库和技术写作工具。",
      "parent_id": 63,
      "level": 3,
      "sort": 20
    },
    {
      "id": 66,
      "name": "工程效率",
      "slug": "engineering-productivity",
      "description": "开发协作、工程和效率工具。",
      "parent_id": 63,
      "level": 3,
      "sort": 30
    },
    {
      "id": 67,
      "name": "资源与素材",
      "slug": "resources-assets",
      "description": "资源、素材、模板和图库。",
      "parent_id": null,
      "level": 1,
      "sort": 60
    },
    {
      "id": 68,
      "name": "素材资源",
      "slug": "assets",
      "description": "模板、图标、样机和可复用资源。",
      "parent_id": 67,
      "level": 2,
      "sort": 10
    },
    {
      "id": 69,
      "name": "模板",
      "slug": "templates",
      "description": "页面、组件和产品模板。",
      "parent_id": 68,
      "level": 3,
      "sort": 10
    },
    {
      "id": 70,
      "name": "图标与插画",
      "slug": "icons-illustrations",
      "description": "图标、插画和视觉资源。",
      "parent_id": 68,
      "level": 3,
      "sort": 20
    },
    {
      "id": 71,
      "name": "图库与图片",
      "slug": "image-libraries",
      "description": "图片、摄影和图像资源。",
      "parent_id": 68,
      "level": 3,
      "sort": 30
    },
    {
      "id": 72,
      "name": "综合导航",
      "slug": "general-directory",
      "description": "跨主题综合导航与行业入口。",
      "parent_id": null,
      "level": 1,
      "sort": 70
    },
    {
      "id": 73,
      "name": "行业导航",
      "slug": "industry-directory",
      "description": "行业型、专业型导航入口。",
      "parent_id": 72,
      "level": 2,
      "sort": 10
    },
    {
      "id": 74,
      "name": "招投标与政企",
      "slug": "bidding-gov",
      "description": "招投标和专业行业导航。",
      "parent_id": 73,
      "level": 3,
      "sort": 10
    },
    {
      "id": 75,
      "name": "室内与家装",
      "slug": "interior-home",
      "description": "室内设计与家装相关导航。",
      "parent_id": 73,
      "level": 3,
      "sort": 20
    },
    {
      "id": 76,
      "name": "电商与淘客",
      "slug": "ecommerce-affiliate",
      "description": "电商、淘客与导购导航。",
      "parent_id": 73,
      "level": 3,
      "sort": 30
    },
    {
      "id": 77,
      "name": "通用收录",
      "slug": "general-collection",
      "description": "暂无法细分、但具备收录价值的常用站点。",
      "parent_id": 72,
      "level": 2,
      "sort": 20
    },
    {
      "id": 78,
      "name": "常用工具",
      "slug": "general-tools",
      "description": "通用工具、效率站点和常用入口。",
      "parent_id": 77,
      "level": 3,
      "sort": 10
    },
    {
      "id": 79,
      "name": "导航源",
      "slug": "directory-seeds",
      "description": "作为数据源的导航站入口。",
      "parent_id": 77,
      "level": 3,
      "sort": 20
    },
    {
      "id": 80,
      "name": "待整理站点",
      "slug": "backlog-sites",
      "description": "暂存与后续细化整理的站点。",
      "parent_id": 77,
      "level": 3,
      "sort": 30
    }
  ],
  "sites": [
    {
      "name": "爱情守望者_致力于分享最精彩的互联网",
      "url": "http://www.waitsun.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=waitsun.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "waitsun.com",
      "category_slug": "general-tools"
    },
    {
      "name": "玩转苹果 - 苹果改变世界！",
      "url": "http://www.ifunmac.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ifunmac.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "ifunmac.com",
      "category_slug": "general-tools"
    },
    {
      "name": "精品MAC应用分享",
      "url": "http://xclient.info/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=xclient.info",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "xclient.info",
      "category_slug": "general-tools"
    },
    {
      "name": "史蒂芬周的博客 | 软硬兼施，娱乐共享",
      "url": "http://www.sdifen.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=sdifen.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "sdifen.com",
      "category_slug": "general-tools"
    },
    {
      "name": "PC6苹果网_苹果软件游戏下载门户网站",
      "url": "http://www.pc6.com/apple/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=pc6.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "pc6.com",
      "category_slug": "general-tools"
    },
    {
      "name": "少数派 - 高品质数字消费指南",
      "url": "https://sspai.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=sspai.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "sspai.com",
      "category_slug": "general-tools"
    },
    {
      "name": "盒子部落 - 互联网资源分享平台",
      "url": "https://hezibuluo.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=hezibuluo.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "hezibuluo.com",
      "category_slug": "general-tools"
    },
    {
      "name": "实用的 Vim 命令速查表 - Linux开发社区 | CTOLib码库",
      "url": "https://www.ctolib.com/cheatsheets-Vim.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ctolib.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "ctolib.com",
      "category_slug": "general-tools"
    },
    {
      "name": "图片转文字在线 - 图片文字提取 - 网页OCR文字识别 - 白描网页版",
      "url": "https://web.baimiaoapp.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=web.baimiaoapp.com",
      "catelog": "OCR",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "web.baimiaoapp.com",
      "category_slug": "ocr"
    },
    {
      "name": "mac软件推荐_分享优质mac软件游戏_苹果软件盒子",
      "url": "https://www.macappbox.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=macappbox.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "macappbox.com",
      "category_slug": "general-tools"
    },
    {
      "name": "MacEnjoy-macOS破解资源分享站",
      "url": "https://www.macenjoy.co/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=macenjoy.co",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "macenjoy.co",
      "category_slug": "general-tools"
    },
    {
      "name": "XMac.App",
      "url": "https://xmac.app/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=xmac.app",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "xmac.app",
      "category_slug": "general-tools"
    },
    {
      "name": "MAC小站-免费的MAC破解软件",
      "url": "https://macxz.top/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=macxz.top",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "macxz.top",
      "category_slug": "general-tools"
    },
    {
      "name": "苹果系统之家 - mac软件｜macOS镜像｜macOS教程｜黑苹果教程软件分享",
      "url": "https://macoshome.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=macoshome.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "macoshome.com",
      "category_slug": "general-tools"
    },
    {
      "name": "MAC软件宝库,一站式苹果软件安装指导",
      "url": "https://macbv.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=macbv.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "macbv.com",
      "category_slug": "general-tools"
    },
    {
      "name": "在线下载 Twitter 视频 | Twitter 下载器 #1 - SaveTwitter",
      "url": "https://savetwitter.net/zh-cn",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=savetwitter.net",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "savetwitter.net",
      "category_slug": "general-tools"
    },
    {
      "name": "Cmacked - Cracked Mac Apps & Games",
      "url": "https://cmacked.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=cmacked.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "cmacked.com",
      "category_slug": "general-tools"
    },
    {
      "name": "【NTFS for Mac】BuhoNTFS - 輕鬆在 Mac 上讀寫 NTFS 硬碟/隨身碟",
      "url": "https://www.drbuho.com/zh-tw/buhontfs",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=drbuho.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "drbuho.com",
      "category_slug": "general-tools"
    },
    {
      "name": "macOS - 超赞合集 awesome list chinese",
      "url": "https://asmcn.icopy.site/awesome/awesome-macOS/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=asmcn.icopy.site",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "asmcn.icopy.site",
      "category_slug": "general-tools"
    },
    {
      "name": "前言 · jekorx's blog",
      "url": "https://www.wdg.pub/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=wdg.pub",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "wdg.pub",
      "category_slug": "general-tools"
    },
    {
      "name": "MacWk - 精品mac软件下载",
      "url": "https://macwk.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=macwk.cn",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "macwk.cn",
      "category_slug": "general-tools"
    },
    {
      "name": "Программы для macOS скачать торрент бесплатно (ARM, x86)",
      "url": "https://appstorrent.ru/programs/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=appstorrent.ru",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "appstorrent.ru",
      "category_slug": "general-tools"
    },
    {
      "name": "macOS defaults list",
      "url": "https://macos-defaults.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=macos-defaults.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "macos-defaults.com",
      "category_slug": "general-tools"
    },
    {
      "name": "Catppuccin 配色",
      "url": "https://catppuccin.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=catppuccin.com",
      "catelog": "配色工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "catppuccin.com",
      "category_slug": "color-tools"
    },
    {
      "name": "好小说 - 在线阅读网络小说故事和小说",
      "url": "https://www.goodnovel.com/create_book",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=goodnovel.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / mac 软件下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / mac 软件下载",
      "normalized_domain": "goodnovel.com",
      "category_slug": "general-tools"
    },
    {
      "name": "OpenTu - 我的画板1",
      "url": "https://opentu.ai/?board=3f4d6d8f-ea93-4b02-8cad-7ff7938c4a44",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=opentu.ai",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / AI免费图和提示词。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI免费图和提示词",
      "normalized_domain": "opentu.ai",
      "category_slug": "backlog-sites"
    },
    {
      "name": "国家社会保险公共服务平台",
      "url": "http://si.12333.gov.cn/index.jhtml",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=si.12333.gov.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "si.12333.gov.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "深圳市社会保险基金管理局-个人网上服务",
      "url": "https://sipub.sz.gov.cn/hspms/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=sipub.sz.gov.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "sipub.sz.gov.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "国家税务总局上海市电子税务局",
      "url": "https://etax.shanghai.chinatax.gov.cn/wszx-web/bszm/apps/views/beforeLogin/indexBefore/pageIndex.html#/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=etax.shanghai.chinatax.gov.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "etax.shanghai.chinatax.gov.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "深圳市统一电子印章管理平台",
      "url": "https://dzyz.sz.gov.cn/#/officialHome",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=dzyz.sz.gov.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "dzyz.sz.gov.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "公共服务平台-积分管理",
      "url": "http://jzzjf.rsj.sh.gov.cn/jzzjf/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=jzzjf.rsj.sh.gov.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "jzzjf.rsj.sh.gov.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "上海居住证有效期查询",
      "url": "https://www.962222.net/index.html?0.10775694750368148",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=962222.net",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "962222.net",
      "category_slug": "backlog-sites"
    },
    {
      "name": "长三角政务服务“一网通办”",
      "url": "https://csj.sh.gov.cn/govService/index?access_token=385b4a57-aa04-43c6-8e08-6cebeb01d9c0&countryToken=n1zrn4XvUdtvTDUogHwsWh3eYBz6a1tbxOrYzQqKYpniWBHtl5mbyRaP+chzic50+Nt0BQtJsCEaek2P4qPP2sTqr17j23olrTiEy5oORu0=",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=csj.sh.gov.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "csj.sh.gov.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "中华人民共和国国家档案局（试运行）",
      "url": "https://cxly.saac.gov.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=cxly.saac.gov.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "cxly.saac.gov.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "上海教育",
      "url": "https://shrxbm.edu.sh.gov.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=shrxbm.edu.sh.gov.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "shrxbm.edu.sh.gov.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "一网通办",
      "url": "http://zwdt.sh.gov.cn/govPortals/stRegionIndex.do?stRegion=SH00PD",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=zwdt.sh.gov.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 政府/社保/公积金。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 政府/社保/公积金",
      "normalized_domain": "zwdt.sh.gov.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "OrbStack · macOS 上快速、轻便、简单的 Docker 和 Linux",
      "url": "https://orbstack.dev/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=orbstack.dev",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / Mac开发/工具。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Mac开发/工具",
      "normalized_domain": "orbstack.dev",
      "category_slug": "general-tools"
    },
    {
      "name": "[官方] Dr.Buho：專注簡單 iOS/macOS 應用，簡化數字生活",
      "url": "https://www.drbuho.com/zh-tw",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=drbuho.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / Mac开发/工具。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Mac开发/工具",
      "normalized_domain": "drbuho.com",
      "category_slug": "general-tools"
    },
    {
      "name": "国光的 macOS Ventura 13 优化配置（基于 ARM 平台） | 国光",
      "url": "https://www.sqlsec.com/2023/07/ventura.html#Oh-My-Zsh",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=sqlsec.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / Mac开发/工具。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Mac开发/工具",
      "normalized_domain": "sqlsec.com",
      "category_slug": "general-tools"
    },
    {
      "name": "SwiftIO 游乐场",
      "url": "https://www.crowdsupply.com/madmachine-limited/swiftio-playground",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=crowdsupply.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / Mac开发/工具。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Mac开发/工具",
      "normalized_domain": "crowdsupply.com",
      "category_slug": "general-tools"
    },
    {
      "name": "老谭 | mac 开发",
      "url": "http://www.tanhao.me/page/4",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=tanhao.me",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / Mac开发/工具。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Mac开发/工具",
      "normalized_domain": "tanhao.me",
      "category_slug": "general-tools"
    },
    {
      "name": "提示词优化，应该基于真实结果",
      "url": "https://always200.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=always200.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / AI创作提示词 / 提示词优化。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI创作提示词 / 提示词优化",
      "normalized_domain": "always200.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Midjourney Prompts, Video, SREF Codes Library and Guides",
      "url": "https://promptsref.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=promptsref.com",
      "catelog": "AIGC导航",
      "desc": "来源书签分组：书签栏 / AI创作提示词。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI创作提示词",
      "normalized_domain": "promptsref.com",
      "category_slug": "aigc-directory"
    },
    {
      "name": "飞搜 - 飞书文档搜索引擎 | AI智能搜索飞书知识库、教程与干货资源",
      "url": "https://feisou.app/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=feisou.app",
      "catelog": "文档工具",
      "desc": "来源书签分组：书签栏 / AI创作提示词。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI创作提示词",
      "normalized_domain": "feisou.app",
      "category_slug": "docs-tools"
    },
    {
      "name": "HeroUI v3（以前称为 NextUI）——默认美观，设计上可自定义。",
      "url": "https://heroui.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=heroui.com",
      "catelog": "空状态与组件",
      "desc": "来源书签分组：书签栏 / 解意。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 解意",
      "normalized_domain": "heroui.com",
      "category_slug": "components-empty-states"
    },
    {
      "name": "旅途星辰：TripStar · AI旅行引擎——2025文旅智能体创新大赛 · 创空间",
      "url": "https://modelscope.cn/studios/lcclxy/Journey-to-the-China",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=modelscope.cn",
      "catelog": "社媒创作",
      "desc": "来源书签分组：书签栏 / 自媒体 / 旅途星辰。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 自媒体 / 旅途星辰",
      "normalized_domain": "modelscope.cn",
      "category_slug": "social-content"
    },
    {
      "name": "MD2Card - Markdown 转知识卡片工具",
      "url": "https://md2card.com/zh",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=md2card.com",
      "catelog": "文案生成",
      "desc": "来源书签分组：书签栏 / 自媒体 / 一键排版。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 自媒体 / 一键排版",
      "normalized_domain": "md2card.com",
      "category_slug": "copywriting"
    },
    {
      "name": "酷宣AI｜你的超级智能体：AI排版 · AI图文 · AIPPT · AI作图 · AI修图 · AI动图 · AI视频",
      "url": "https://kuxuanai.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=kuxuanai.com",
      "catelog": "文案生成",
      "desc": "来源书签分组：书签栏 / 自媒体 / 一键排版。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 自媒体 / 一键排版",
      "normalized_domain": "kuxuanai.com",
      "category_slug": "copywriting"
    },
    {
      "name": "录咖-在线AI语音/录音转文字、文字转语音、字幕生成、视频翻译工具",
      "url": "https://reccloud.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=reccloud.cn",
      "catelog": "配音与本地化",
      "desc": "来源书签分组：书签栏 / 自媒体 / 视频生成。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 自媒体 / 视频生成",
      "normalized_domain": "reccloud.cn",
      "category_slug": "voice-localization"
    },
    {
      "name": "LazySo 懒人去水印 - 免费无损消除 Gemini/AI 图片水印 (纯前端隐私保护)",
      "url": "https://clean.lazyso.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=clean.lazyso.com",
      "catelog": "社媒创作",
      "desc": "来源书签分组：书签栏 / 自媒体 / 水印。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 自媒体 / 水印",
      "normalized_domain": "clean.lazyso.com",
      "category_slug": "social-content"
    },
    {
      "name": "Wikimedia Commons",
      "url": "https://commons.wikimedia.org/wiki/Main_Page",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=commons.wikimedia.org",
      "catelog": "社媒创作",
      "desc": "来源书签分组：书签栏 / 自媒体 / 书籍下载地址。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 自媒体 / 书籍下载地址",
      "normalized_domain": "commons.wikimedia.org",
      "category_slug": "social-content"
    },
    {
      "name": "Compare Domain Prices – Full List of Top-Level Domains",
      "url": "https://tld-list.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=tld-list.com",
      "catelog": "社媒创作",
      "desc": "来源书签分组：书签栏 / 自媒体 / 域名优惠查询。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 自媒体 / 域名优惠查询",
      "normalized_domain": "tld-list.com",
      "category_slug": "social-content"
    },
    {
      "name": "ZenMux（模型聚合）",
      "url": "https://zenmux.ai/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=zenmux.ai",
      "catelog": "社媒创作",
      "desc": "来源书签分组：书签栏 / 自媒体。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 自媒体",
      "normalized_domain": "zenmux.ai",
      "category_slug": "social-content"
    },
    {
      "name": "中华古籍智慧化服务平台",
      "url": "https://guji.nlc.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=guji.nlc.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 古籍开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 古籍开发",
      "normalized_domain": "guji.nlc.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "适用于任何网站的快速视频下载器 - DataTool.vip",
      "url": "https://www.datatool.vip/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=datatool.vip",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 视频下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频下载",
      "normalized_domain": "datatool.vip",
      "category_slug": "general-tools"
    },
    {
      "name": "免费视频下载_哔哩哔哩B站视频下载_抖音无水印视频下载_YouTube油管视频下载-GreenVideo视频下载",
      "url": "https://greenvideo.cc/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=greenvideo.cc",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 视频下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频下载",
      "normalized_domain": "greenvideo.cc",
      "category_slug": "general-tools"
    },
    {
      "name": "免费视频万能解析下载器 - 在线下载MP4视频、MP3音频、图片与字幕 | SnapWC",
      "url": "https://snapwc.com/zh",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=snapwc.com",
      "catelog": "配音与本地化",
      "desc": "来源书签分组：书签栏 / 视频下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频下载",
      "normalized_domain": "snapwc.com",
      "category_slug": "voice-localization"
    },
    {
      "name": "CutCut - Free Online Video Downloader & Trimmer | Best CapCut Alternative",
      "url": "https://cutcut.top/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=cutcut.top",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 视频下载。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频下载",
      "normalized_domain": "cutcut.top",
      "category_slug": "general-tools"
    },
    {
      "name": "片源网",
      "url": "http://pianyuan.org/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=pianyuan.org",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 视频/影视资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频/影视资源",
      "normalized_domain": "pianyuan.org",
      "category_slug": "backlog-sites"
    },
    {
      "name": "TG资源网-又一个TG资源站点",
      "url": "https://pp2x.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=pp2x.com",
      "catelog": "设计资源站",
      "desc": "来源书签分组：书签栏 / 视频/影视资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频/影视资源",
      "normalized_domain": "pp2x.com",
      "category_slug": "design-resources"
    },
    {
      "name": "BTNull - 无名小站",
      "url": "https://www.gyg.si/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=gyg.si",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 视频/影视资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频/影视资源",
      "normalized_domain": "gyg.si",
      "category_slug": "backlog-sites"
    },
    {
      "name": "最好的高清2160P 4K电影下载网站 | MINI4K迷客电影",
      "url": "https://www.mini4k.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=mini4k.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 视频/影视资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频/影视资源",
      "normalized_domain": "mini4k.com",
      "category_slug": "general-tools"
    },
    {
      "name": "奈菲影视 – 分享世界的精彩",
      "url": "https://www.nfyingshi.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=nfyingshi.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 视频/影视资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频/影视资源",
      "normalized_domain": "nfyingshi.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "爱壹帆-海量高清视频免费在线观看",
      "url": "https://www.iyf.lv/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=iyf.lv",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 视频/影视资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频/影视资源",
      "normalized_domain": "iyf.lv",
      "category_slug": "backlog-sites"
    },
    {
      "name": "电影小站",
      "url": "https://www.xn--wcv59z.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=xn--wcv59z.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 视频/影视资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 视频/影视资源",
      "normalized_domain": "xn--wcv59z.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "GoodNovel - Read Web Novel Stories & Fiction Online",
      "url": "https://www.goodnovel.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=goodnovel.com",
      "catelog": "文案生成",
      "desc": "来源书签分组：书签栏 / 海外小说写作平台。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 海外小说写作平台",
      "normalized_domain": "goodnovel.com",
      "category_slug": "copywriting"
    },
    {
      "name": "1Panel",
      "url": "https://demo.1panel.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=demo.1panel.cn",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "demo.1panel.cn",
      "category_slug": "dev-directory"
    },
    {
      "name": "应用内订阅变得简单 – RevenueCat",
      "url": "https://www.revenuecat.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=revenuecat.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "revenuecat.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "iOS代码库 - iOS代码库 - OSCHINA 社区",
      "url": "https://www.oschina.net/ios/codingList/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=oschina.net",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "oschina.net",
      "category_slug": "dev-directory"
    },
    {
      "name": "Adapty SDK： 應用程式內購買與訂閱基礎架構",
      "url": "https://adapty.io/zh/sdk/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=adapty.io",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "adapty.io",
      "category_slug": "dev-directory"
    },
    {
      "name": "Explore SwiftUI - Visual Library for SwiftUI Components | Explore SwiftUI",
      "url": "https://exploreswiftui.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=exploreswiftui.com",
      "catelog": "空状态与组件",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "exploreswiftui.com",
      "category_slug": "components-empty-states"
    },
    {
      "name": "Shadowsocks/SS ios客户端下载 - V2ray XTLS黑科技",
      "url": "https://v2xtls.org/shadowsocks-ss-ios%e5%ae%a2%e6%88%b7%e7%ab%af%e4%b8%8b%e8%bd%bd/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=v2xtls.org",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "v2xtls.org",
      "category_slug": "dev-directory"
    },
    {
      "name": "Categories | Swift with Majid",
      "url": "https://swiftwithmajid.com/categories/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=swiftwithmajid.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "swiftwithmajid.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "README | SwiftGG",
      "url": "https://gitbook.swiftgg.team/swift",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=gitbook.swiftgg.team",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "gitbook.swiftgg.team",
      "category_slug": "dev-directory"
    },
    {
      "name": "uikit图片免费下载_uikit素材_uikit模板-千图网www.58pic.com",
      "url": "http://www.58pic.com/tupian/uikit.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=58pic.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发",
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "58pic.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "Swifter - Swift 必备 tips",
      "url": "http://swifter.tips/optional-map/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=swifter.tips",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "swifter.tips",
      "category_slug": "dev-directory"
    },
    {
      "name": "iOS 10 GUI — Great Simple Studio",
      "url": "http://ios10.greatsimple.io/?.36kr.com",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ios10.greatsimple.io",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / Swift/iOS开发。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / Swift/iOS开发",
      "normalized_domain": "ios10.greatsimple.io",
      "category_slug": "dev-directory"
    },
    {
      "name": "ChatGPT toolbox",
      "url": "https://gpt.candobear.com/toolbox",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=gpt.candobear.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 开发工具/技术。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "开发"
      ],
      "featured": 1,
      "source_site": "ChatGPT toolbox",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "gpt.candobear.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "ToolAI 全球最完整最全面的AI人工智能工具集合",
      "url": "https://toolai.io/zh/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=toolai.io",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 开发工具/技术。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI",
        "开发"
      ],
      "featured": 1,
      "source_site": "ToolAI 全球最完整最全面的AI人工智能工具集合",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "toolai.io",
      "category_slug": "directory-seeds"
    },
    {
      "name": "AItoolkit - The best AI Tools & Resources Directory",
      "url": "https://www.aitoolkit.org/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=aitoolkit.org",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 开发工具/技术。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI",
        "开发"
      ],
      "featured": 1,
      "source_site": "AItoolkit - The best AI Tools & Resources Directory",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "aitoolkit.org",
      "category_slug": "directory-seeds"
    },
    {
      "name": "API Store_为开发者提供最全面的API服务",
      "url": "http://apistore.baidu.com/?weibo",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=apistore.baidu.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "apistore.baidu.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "API - 航班信息",
      "url": "https://zh.flightaware.com/commercial/data/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=zh.flightaware.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "zh.flightaware.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "免费API - 提供免费接口调用平台",
      "url": "https://api.aa1.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=api.aa1.cn",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "api.aa1.cn",
      "category_slug": "dev-directory"
    },
    {
      "name": "Public APIs — A directory of free and public apis",
      "url": "https://publicapis.io/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=publicapis.io",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 开发工具/技术。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "开发"
      ],
      "featured": 1,
      "source_site": "Public APIs — A directory of free and public apis",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "publicapis.io",
      "category_slug": "directory-seeds"
    },
    {
      "name": "Supercharge your mobile apps | Emerge Tools",
      "url": "https://www.emergetools.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=emergetools.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "emergetools.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "Free Public APIs",
      "url": "https://www.freepublicapis.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=freepublicapis.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "freepublicapis.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "证书、标识符和配置文件 - Apple Developer",
      "url": "https://developer.apple.com/account/resources/identifiers/list",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=developer.apple.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "developer.apple.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "Jitter · Fast and simple motion design tool.",
      "url": "https://jitter.video/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=jitter.video",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "jitter.video",
      "category_slug": "dev-directory"
    },
    {
      "name": "DrawingSpinUp: 3D Animation from Single Character Drawings",
      "url": "https://lordliang.github.io/DrawingSpinUp/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=lordliang.github.io",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "lordliang.github.io",
      "category_slug": "dev-directory"
    },
    {
      "name": "模拟器游戏文件合集",
      "url": "https://www.kdocs.cn/l/cuq4qQYaj6Ah",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=kdocs.cn",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "kdocs.cn",
      "category_slug": "dev-directory"
    },
    {
      "name": "【介绍】60s API - 60s API",
      "url": "https://docs.60s-api.viki.moe/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=docs.60s-api.viki.moe",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "docs.60s-api.viki.moe",
      "category_slug": "dev-directory"
    },
    {
      "name": "iOS 开发舆图 | 星光社 - 戴铭的博客",
      "url": "https://ming1016.github.io/2019/07/29/ios-map/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ming1016.github.io",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "ming1016.github.io",
      "category_slug": "dev-directory"
    },
    {
      "name": "Free Online Tools - AllinOne.Tools",
      "url": "https://allinone.tools/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=allinone.tools",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "allinone.tools",
      "category_slug": "dev-directory"
    },
    {
      "name": "AMD CPU云服务器全国首推---业界领先性价比 限时特价低至17元/月",
      "url": "https://cloud.tencent.com/act/special/amd?from=toolbar",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=cloud.tencent.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "cloud.tencent.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "家庭账本",
      "url": "https://docs.qq.com/sheet/DRk5sQlJWZ1VyaVVi?tab=s9qdgq",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=docs.qq.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "docs.qq.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "Office|WPS Office|Office教程|office视频教程|office基础教程|office办公软件教程",
      "url": "https://www.officeapi.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=officeapi.cn",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "officeapi.cn",
      "category_slug": "dev-directory"
    },
    {
      "name": "⁤ ​⁡‬⁢⁣⁢​‍​⁡‬⁤⁣​⁤‌‌‬​⁣⁡⁤‌‍​⁢​‌⁣‬‌​⁢⁢​⁤​​‬⁤⁡‍‬​​⁢⁢解决非法访问api - 飞书云文档",
      "url": "https://laiyifen.feishu.cn/wiki/FZJYw3cwGisknvksihncs2AknnW",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=laiyifen.feishu.cn",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "laiyifen.feishu.cn",
      "category_slug": "dev-directory"
    },
    {
      "name": "维易淘宝客API-高佣API-淘客联盟高佣金转链接口-第三方淘宝客淘口令二合一解密API",
      "url": "http://wsd.591hufu.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=wsd.591hufu.com",
      "catelog": "跨境电商导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "wsd.591hufu.com",
      "category_slug": "cross-border-commerce"
    },
    {
      "name": "Leading AI video localization & dubbing tool",
      "url": "https://www.rask.ai/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=rask.ai",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "rask.ai",
      "category_slug": "dev-directory"
    },
    {
      "name": "Docs",
      "url": "https://gd7dcarg0g.feishu.cn/docx/Wxkcds3Lzow8Z1x3M0EcJS1GnPX",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=gd7dcarg0g.feishu.cn",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "gd7dcarg0g.feishu.cn",
      "category_slug": "dev-directory"
    },
    {
      "name": "Blender 3.6 参考手册 — Blender Manual",
      "url": "https://docs.blender.org/manual/zh-hans/latest/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=docs.blender.org",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "docs.blender.org",
      "category_slug": "dev-directory"
    },
    {
      "name": "装在 Docker 里面的 Beego",
      "url": "https://github.com/lei-cao/beego-in-action/blob/master/zh/beego-in-docker.md",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=github.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "github.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "代码规范",
      "url": "https://github.com/objc-zen/objc-zen-book",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=github.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "github.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "七天学会NodeJS",
      "url": "http://nqdeng.github.io/7-days-nodejs/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=nqdeng.github.io",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "nqdeng.github.io",
      "category_slug": "dev-directory"
    },
    {
      "name": "docker-compose上手 - Yeqown's Blog",
      "url": "https://yeqown.github.io/2018/01/24/Docker-Compose%E4%B8%8A%E6%89%8B/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=yeqown.github.io",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "yeqown.github.io",
      "category_slug": "dev-directory"
    },
    {
      "name": "缘份居国学研究开发者API",
      "url": "https://doc.yuanfenju.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=doc.yuanfenju.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "doc.yuanfenju.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "swift详细资料 · GitHub",
      "url": "https://github.com/ipader/SwiftGuide",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=github.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "github.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "swift2.0文档",
      "url": "https://github.com/CocoaChina-editors/Welcome-to-Swift",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=github.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "github.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "XDNetworking/XDNetworking.m at master · caixindong/XDNetworking",
      "url": "https://github.com/caixindong/XDNetworking/blob/master/XDNetworking/XDNetworking/XDNetworking/XDNetworking.m",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=github.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "github.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "Free Web & Mobile Prototyping (Web, iOS, Android) and UI Mockup Tool | InVision",
      "url": "https://www.invisionapp.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=invisionapp.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "invisionapp.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "yang2507366",
      "url": "https://github.com/yang2507366",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=github.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "github.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "Git版本控制软件结合GitHub从入门到精通常用命令学习手册 – 爱分享",
      "url": "http://www.ihref.com/read-16369.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ihref.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "ihref.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "lexVim/ide.md at master · lexkong/lexVim",
      "url": "https://github.com/lexkong/lexVim/blob/master/doc/ide.md",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=github.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "github.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "git - the simple guide - no deep shit!",
      "url": "http://rogerdudler.github.io/git-guide/index.zh.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=rogerdudler.github.io",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "rogerdudler.github.io",
      "category_slug": "dev-directory"
    },
    {
      "name": "猴子都能懂的GIT入门 | 贝格乐（Backlog）",
      "url": "http://backlogtool.com/git-guide/cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=backlogtool.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "backlogtool.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "Docs",
      "url": "https://tgfa0mvtu5.feishu.cn/docx/IdxadqTiboXQKvxzl06ccl4knmb",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=tgfa0mvtu5.feishu.cn",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "tgfa0mvtu5.feishu.cn",
      "category_slug": "dev-directory"
    },
    {
      "name": "Get started with Mastra | Mastra Docs",
      "url": "https://mastra.ai/docs",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=mastra.ai",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 开发工具/技术。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 开发工具/技术",
      "normalized_domain": "mastra.ai",
      "category_slug": "dev-directory"
    },
    {
      "name": "设计导航-好设计从这里开始|Uxmap",
      "url": "http://www.uxmap.cn/page/#/uxmap/home",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=uxmap.cn",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / UI/UX设计。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计"
      ],
      "featured": 1,
      "source_site": "设计导航-好设计从这里开始|Uxmap",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "uxmap.cn",
      "category_slug": "directory-seeds"
    },
    {
      "name": "优设导航官网 - 设计导航 - 国内专业设计师网站导航",
      "url": "https://hao.uisdc.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=hao.uisdc.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / UI/UX设计。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计"
      ],
      "featured": 1,
      "source_site": "优设导航官网 - 设计导航 - 国内专业设计师网站导航",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "hao.uisdc.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "Choose from 1000+ Framer templates",
      "url": "https://www.framer.com/templates/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=framer.com",
      "catelog": "模板",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "framer.com",
      "category_slug": "templates"
    },
    {
      "name": "In-depth Product Hunt launch guide",
      "url": "https://www.demandcurve.com/playbooks/product-hunt-launch",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=demandcurve.com",
      "catelog": "发布指南",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "demandcurve.com",
      "category_slug": "launch-guides"
    },
    {
      "name": "UI Notes - 真实产品 UI 设计灵感库",
      "url": "https://uinotes.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=uinotes.com",
      "catelog": "设计灵感入口",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "uinotes.com",
      "category_slug": "design-inspiration-entry"
    },
    {
      "name": "PPT | Slidev",
      "url": "https://cn.sli.dev/guide/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=cn.sli.dev",
      "catelog": "演示与幻灯",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "cn.sli.dev",
      "category_slug": "slides-presentation"
    },
    {
      "name": "Cheap VPS Hosting - Fast & Reliable Virtual Private Servers | Hostwinds",
      "url": "https://www.hostwinds.com/vps/unmanaged-linux",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=hostwinds.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "hostwinds.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Shots - Create Amazing Mockups",
      "url": "https://shots.so/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=shots.so",
      "catelog": "设计资源站",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "shots.so",
      "category_slug": "design-resources"
    },
    {
      "name": "最易懂的教程：产品思维培养入门–一起做个简单的登录吧 | 人人都是产品经理",
      "url": "http://www.woshipm.com/pd/326331.html?plg_nld=1&plg_usr=1&plg_vkey=1&plg_auth=1&plg_dev=1&plg_uin=1&plg_nld=1",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=woshipm.com",
      "catelog": "产品设计文章",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "woshipm.com",
      "category_slug": "product-design-articles"
    },
    {
      "name": "静电的sketch3视频课程-sketch中国社区-中国Sketch粉丝第一站",
      "url": "http://www.sketchchina.com/special-1",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=sketchchina.com",
      "catelog": "Sketch",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "sketchchina.com",
      "category_slug": "sketch-learning"
    },
    {
      "name": "hixulei的设计作品-UI中国-专业界面交互设计平台",
      "url": "http://i.ui.cn/ucenter/84039",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=i.ui.cn",
      "catelog": "交互参考",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "i.ui.cn",
      "category_slug": "interaction-reference"
    },
    {
      "name": "Empty States -手机UI设计范例",
      "url": "http://pttrns.com/?did=1&scid=30",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=pttrns.com",
      "catelog": "界面案例",
      "desc": "来源书签分组：书签栏 / UI/UX设计。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / UI/UX设计",
      "normalized_domain": "pttrns.com",
      "category_slug": "ui-cases"
    },
    {
      "name": "ChatGPT 应用汇总及操作手册",
      "url": "https://www.mojidoc.com/05dbc-uvhdkr22fjazlowmiihngdoxvq-00b",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=mojidoc.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "mojidoc.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "AI写作、绘画、游戏、编程……一窥AIGC时代下APP的最新发展趋势|AI_新浪财经_新浪网",
      "url": "https://finance.sina.com.cn/jjxw/2023-02-21/doc-imyhmtay8727832.shtml",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=finance.sina.com.cn",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / AI/ChatGPT。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI"
      ],
      "featured": 1,
      "source_site": "AI写作、绘画、游戏、编程……一窥AIGC时代下APP的最新发展趋势|AI_新浪财经_新浪网",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "finance.sina.com.cn",
      "category_slug": "directory-seeds"
    },
    {
      "name": "AI研究所 - 国内外AI工具资讯首发站",
      "url": "https://www.aiyjs.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=aiyjs.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "aiyjs.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "bloop | Find Code. Fast.",
      "url": "https://bloop.ai/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=bloop.ai",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "bloop.ai",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "AI导航 | 深度导航",
      "url": "https://www.deepdh.com/ai",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=deepdh.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / AI/ChatGPT。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI"
      ],
      "featured": 1,
      "source_site": "AI导航 | 深度导航",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "deepdh.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "AI工具集导航 | 500+ AI工具导航和AI工具箱集合，国内外AI工具集合网站大全",
      "url": "https://ai-bot.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ai-bot.cn",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / AI/ChatGPT。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI"
      ],
      "featured": 1,
      "source_site": "AI工具集导航 | 500+ AI工具导航和AI工具箱集合，国内外AI工具集合网站大全",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "ai-bot.cn",
      "category_slug": "directory-seeds"
    },
    {
      "name": "注册chat-gpt的简明教程",
      "url": "https://696988.xyz/post/22",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=696988.xyz",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "696988.xyz",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "Ai导航 | 最新最前沿的ai产品",
      "url": "https://www.ainavpro.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ainavpro.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / AI/ChatGPT。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI"
      ],
      "featured": 1,
      "source_site": "Ai导航 | 最新最前沿的ai产品",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "ainavpro.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "AI脑图",
      "url": "https://whimsical.com/a",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=whimsical.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "whimsical.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "AIGC工具导航 | 发现全球优质AIGC工具，与创作者一同成长",
      "url": "https://aigc.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=aigc.cn",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / AI/ChatGPT。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI"
      ],
      "featured": 1,
      "source_site": "AIGC工具导航 | 发现全球优质AIGC工具，与创作者一同成长",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "aigc.cn",
      "category_slug": "directory-seeds"
    },
    {
      "name": "多种草AI-免费在线小红书AI创作工具",
      "url": "https://duozhongcao.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=duozhongcao.com",
      "catelog": "社媒创作",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "duozhongcao.com",
      "category_slug": "social-content"
    },
    {
      "name": "国外网站大全_国外网址导航_看国外",
      "url": "https://www.kanguowai.com/index.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=kanguowai.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / AI/ChatGPT。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI"
      ],
      "featured": 1,
      "source_site": "国外网站大全_国外网址导航_看国外",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "kanguowai.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "急救指南",
      "url": "https://m.youlai.cn/jijiu",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=m.youlai.cn",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "m.youlai.cn",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "Your friend sent you 200 free credits! - Recraft",
      "url": "https://www.recraft.ai/invite/g6qoCp33BW",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=recraft.ai",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "recraft.ai",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "AI Colors(颜色搭配)",
      "url": "https://aicolors.co/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=aicolors.co",
      "catelog": "配色工具",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "aicolors.co",
      "category_slug": "color-tools"
    },
    {
      "name": "Chatbox AI官网：办公学习的AI好助手，全平台AI客户端，官方免费下载",
      "url": "https://chatboxai.app/zh",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=chatboxai.app",
      "catelog": "AI客户端",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "chatboxai.app",
      "category_slug": "ai-clients"
    },
    {
      "name": "EdgeOne Pages: 快速构建和部署您的网页应用",
      "url": "https://edgeone.ai/zh/products/pages",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=edgeone.ai",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "edgeone.ai",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "亚洲最佳CDN、边缘和安全解决方案 - Tencent EdgeOne",
      "url": "https://edgeone.ai/zh",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=edgeone.ai",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "edgeone.ai",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "按号码进行电话追踪 - 通过 scannero.io 的电话号码查找位置",
      "url": "https://scannero.io/cn/email/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=scannero.io",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "scannero.io",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "Sleek: AI Mobile App Designer | Create App Mockups in Minutes",
      "url": "https://sleek.design/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=sleek.design",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "sleek.design",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "MkSaaS - Make Your AI SaaS Product in a Weekend",
      "url": "https://mksaas.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=mksaas.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "mksaas.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "PDF派 - 20个免费的在线PDF工具包",
      "url": "https://www.pdfpai.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=pdfpai.com",
      "catelog": "PDF工具",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "pdfpai.com",
      "category_slug": "pdf-tools"
    },
    {
      "name": "服务器 - 轻量应用服务器 - 控制台",
      "url": "https://console.cloud.tencent.com/lighthouse/instance/index?action=DescribeInstanceLoginKeyPair",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=console.cloud.tencent.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "console.cloud.tencent.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "Vidu AI - 参考生视频",
      "url": "https://www.vidu.cn/create/character2video",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=vidu.cn",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "vidu.cn",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "‍‌⁢‍​‍⁤‬​ ⁤⁡​⁡​‌​⁡‬‍ ⁡​⁣⁤‍‬⁣⁢⁢​‌‍‌​⁤⁢​​‬‍ ⁣‌​​⁢‍‬‍iOS -提测模版 - 飞书云文档",
      "url": "https://laiyifen.feishu.cn/wiki/NVxewXTYXiDQrskhyetcpub1nBK",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=laiyifen.feishu.cn",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "laiyifen.feishu.cn",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "出海电商AI内容智造机",
      "url": "https://ai.zhisuitech.com/#/title?channel=aigc_dny123",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ai.zhisuitech.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / AI/ChatGPT。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI",
        "设计",
        "出海"
      ],
      "featured": 1,
      "source_site": "出海电商AI内容智造机",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "ai.zhisuitech.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "iThinkScene 官网 - 小红书图文AI写作神器 | 一键批量创作小红书图文、短视频、公众号文章",
      "url": "https://app.ithinkai.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=app.ithinkai.cn",
      "catelog": "文案生成",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "app.ithinkai.cn",
      "category_slug": "copywriting"
    },
    {
      "name": "2345出海导航 | 为您分享全面的出海资源、资讯和资源对接",
      "url": "http://www.chuhai2345.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=chuhai2345.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / AI/ChatGPT。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "AI",
        "出海"
      ],
      "featured": 1,
      "source_site": "2345出海导航 | 为您分享全面的出海资源、资讯和资源对接",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "chuhai2345.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "爱好论坛 - AiHao.Cc!",
      "url": "https://www.aihao.cc/forum.php",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=aihao.cc",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "aihao.cc",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "ChatGPT学习宝典",
      "url": "https://gpt.candobear.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=gpt.candobear.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "gpt.candobear.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "树莓派实验室 | Raspberry Pi中文资讯站，提供丰富的树莓派使用教程和DIY资讯",
      "url": "https://shumeipai.nxez.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=shumeipai.nxez.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "shumeipai.nxez.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "Zappfree - IPA Library [Daily Updated]",
      "url": "https://zappfree.com/ipa-library/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=zappfree.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "zappfree.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "Docker部署golang微服务项目 - CSDN博客",
      "url": "https://blog.csdn.net/fong_613/article/details/80323279",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=blog.csdn.net",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "blog.csdn.net",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "如何在OS X 10.7上开发一个简单的应用教程（一） - Mamong的专栏 - 博客频道 - CSDN.NET",
      "url": "http://blog.csdn.net/mamong/article/details/8458224",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=blog.csdn.net",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "blog.csdn.net",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "iOS基础面试题（一） - 寻亚楠的专栏 - 博客频道 - CSDN.NET",
      "url": "http://blog.csdn.net/xunyn/article/details/8302787",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=blog.csdn.net",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "blog.csdn.net",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "Sketch3 常用快捷键手册-UI中国-专业界面交互设计平台",
      "url": "http://www.ui.cn/detail/17479.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ui.cn",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "ui.cn",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "UI设计_ UI界面设计视频教程 - 麦子学院",
      "url": "http://www.maiziedu.com/course/ui/?yy=zh1604",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=maiziedu.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "maiziedu.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "sketch八个高效的快捷方式（上）-UI中国-专业界面交互设计平台",
      "url": "http://www.ui.cn/detail/15738.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ui.cn",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "ui.cn",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "Git教程首页 - Git教程™",
      "url": "http://www.yiibai.com/git/home.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=yiibai.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "yiibai.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "The AI Native Creation Engine · Refly",
      "url": "https://refly.ai/share/canvas/can-vtujj2ioegi4t340q7xnl0e1",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=refly.ai",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "refly.ai",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "拼多多管理后台",
      "url": "https://seller.kuajingmaihuo.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=seller.kuajingmaihuo.com",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / AI/ChatGPT。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / AI/ChatGPT",
      "normalized_domain": "seller.kuajingmaihuo.com",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "MingCute Icon _ Carefully Designed Icon Library",
      "url": "https://www.mingcute.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=mingcute.com",
      "catelog": "图标与插画",
      "desc": "来源书签分组：书签栏 / 设计/创意。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计/创意",
      "normalized_domain": "mingcute.com",
      "category_slug": "icons-illustrations"
    },
    {
      "name": "Glyphs - The Complete Icon Design System",
      "url": "https://glyphs.fyi/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=glyphs.fyi",
      "catelog": "图标与插画",
      "desc": "来源书签分组：书签栏 / 设计/创意。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计/创意",
      "normalized_domain": "glyphs.fyi",
      "category_slug": "icons-illustrations"
    },
    {
      "name": "Flutter Ducafecat - 开发中常用优秀 Dart Flutter 插件包列表",
      "url": "https://flutter.ducafecat.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=flutter.ducafecat.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 设计/创意。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计/创意",
      "normalized_domain": "flutter.ducafecat.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "yft-design",
      "url": "https://yft.design/zh/editor",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=yft.design",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 设计/创意。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计/创意",
      "normalized_domain": "yft.design",
      "category_slug": "backlog-sites"
    },
    {
      "name": "https://designcode.io",
      "url": "https://designcode.io/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=designcode.io",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 设计/创意。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计/创意",
      "normalized_domain": "designcode.io",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Swift编程语言中文教程（六）：使用函数-控件新闻-慧都控件网",
      "url": "http://www.evget.com/article/2014/6/5/21113.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=evget.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 设计/创意。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计/创意",
      "normalized_domain": "evget.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "给iOS开发者的Sketch入门教程_慕课手记",
      "url": "http://www.imooc.com/article/5053",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=imooc.com",
      "catelog": "Sketch",
      "desc": "来源书签分组：书签栏 / 设计/创意。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计/创意",
      "normalized_domain": "imooc.com",
      "category_slug": "sketch-learning"
    },
    {
      "name": "掘金设计",
      "url": "http://gold.xitu.io/explore/design",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=gold.xitu.io",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 设计/创意。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计/创意",
      "normalized_domain": "gold.xitu.io",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Remix Icon - Open source icon library",
      "url": "https://remixicon.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=remixicon.com",
      "catelog": "设计资源站",
      "desc": "来源书签分组：书签栏 / 设计资源/素材。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计资源/素材",
      "normalized_domain": "remixicon.com",
      "category_slug": "design-resources"
    },
    {
      "name": "animation icon - 动态图标",
      "url": "https://www.mingcute.com/animation",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=mingcute.com",
      "catelog": "设计资源站",
      "desc": "来源书签分组：书签栏 / 设计资源/素材。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计资源/素材",
      "normalized_domain": "mingcute.com",
      "category_slug": "design-resources"
    },
    {
      "name": "洋芋田",
      "url": "https://www.potatofield.cn/fontlibrary",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=potatofield.cn",
      "catelog": "设计资源站",
      "desc": "来源书签分组：书签栏 / 设计资源/素材。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计资源/素材",
      "normalized_domain": "potatofield.cn",
      "category_slug": "design-resources"
    },
    {
      "name": "Icons | Font Awesome",
      "url": "https://fontawesome.com/icons",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=fontawesome.com",
      "catelog": "设计资源站",
      "desc": "来源书签分组：书签栏 / 设计资源/素材。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计资源/素材",
      "normalized_domain": "fontawesome.com",
      "category_slug": "design-resources"
    },
    {
      "name": "AE模板精品站|全面AE模板分享 AE模板免费下载",
      "url": "https://www.adobeae.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=adobeae.com",
      "catelog": "设计资源站",
      "desc": "来源书签分组：书签栏 / 设计资源/素材。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计资源/素材",
      "normalized_domain": "adobeae.com",
      "category_slug": "design-resources"
    },
    {
      "name": "色彩配置 - Adobe Color CC",
      "url": "https://color.adobe.com/zh/create/color-wheel/?base=2&rule=Analogous&selected=0&name=%E6%88%91%E7%9A%84%20Color%20%E4%B8%BB%E9%A1%8C&mode=rgb&rgbvalues=1,0.11994899900013234,0.07690233256161205,0.91,0.065657045374933,0.04550000000000004,1,0,0,0.91,0.04550000000000004,0.11460986985750278,1,0.050000000000000044,0.2018898238619955&swatchOrder=0,1,2,3,4",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=color.adobe.com",
      "catelog": "Logo生成",
      "desc": "来源书签分组：书签栏 / 设计资源/素材。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计资源/素材",
      "normalized_domain": "color.adobe.com",
      "category_slug": "logo-generation"
    },
    {
      "name": "Login | Unsplash",
      "url": "https://unsplash.com/login",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=unsplash.com",
      "catelog": "设计资源站",
      "desc": "来源书签分组：书签栏 / 设计资源/素材。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 设计资源/素材",
      "normalized_domain": "unsplash.com",
      "category_slug": "design-resources"
    },
    {
      "name": "开源工具导航 | 收集最新的应用和科技，提升自我和工作效率",
      "url": "https://nav.newzone.top/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=nav.newzone.top",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 设计导航/资源站。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计"
      ],
      "featured": 1,
      "source_site": "开源工具导航 | 收集最新的应用和科技，提升自我和工作效率",
      "source_category_path": "书签栏 / 设计导航/资源站",
      "normalized_domain": "nav.newzone.top",
      "category_slug": "directory-seeds"
    },
    {
      "name": "中国招投标导航网",
      "url": "https://www.zgztbdh.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=zgztbdh.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 设计导航/资源站。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计"
      ],
      "featured": 1,
      "source_site": "中国招投标导航网",
      "source_category_path": "书签栏 / 设计导航/资源站",
      "normalized_domain": "zgztbdh.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "拓者设计吧|室内设计|室内设计师",
      "url": "https://www.tuozhe8.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=tuozhe8.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 设计导航/资源站。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计"
      ],
      "featured": 1,
      "source_site": "拓者设计吧|室内设计|室内设计师",
      "source_category_path": "书签栏 / 设计导航/资源站",
      "normalized_domain": "tuozhe8.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "酷家乐 - 在线3D云设计平台",
      "url": "https://www.kujiale.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=kujiale.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 设计导航/资源站。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计"
      ],
      "featured": 1,
      "source_site": "酷家乐 - 在线3D云设计平台",
      "source_category_path": "书签栏 / 设计导航/资源站",
      "normalized_domain": "kujiale.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "室内家装装修效果图设计软件-在线家装设计软件-三维家官网",
      "url": "https://www.3vjia.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=3vjia.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 设计导航/资源站。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计"
      ],
      "featured": 1,
      "source_site": "室内家装装修效果图设计软件-在线家装设计软件-三维家官网",
      "source_category_path": "书签栏 / 设计导航/资源站",
      "normalized_domain": "3vjia.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "AMZ123亚马逊导航-跨境电商出海门户",
      "url": "https://www.amz123.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=amz123.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 设计导航/资源站。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计",
        "出海"
      ],
      "featured": 1,
      "source_site": "AMZ123亚马逊导航-跨境电商出海门户",
      "source_category_path": "书签栏 / 设计导航/资源站",
      "normalized_domain": "amz123.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "淘宝客导航",
      "url": "http://daohang.taokeplus.com/#a7",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=daohang.taokeplus.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 设计导航/资源站。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计"
      ],
      "featured": 1,
      "source_site": "淘宝客导航",
      "source_category_path": "书签栏 / 设计导航/资源站",
      "normalized_domain": "daohang.taokeplus.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "设计导航 - 精选最好的设计网站大全",
      "url": "http://hao.shejidaren.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=hao.shejidaren.com",
      "catelog": "导航源",
      "desc": "导航源入口，来源路径：书签栏 / 设计导航/资源站。",
      "sort": 10,
      "hide": 0,
      "tags": [
        "导航源",
        "设计"
      ],
      "featured": 1,
      "source_site": "设计导航 - 精选最好的设计网站大全",
      "source_category_path": "书签栏 / 设计导航/资源站",
      "normalized_domain": "hao.shejidaren.com",
      "category_slug": "directory-seeds"
    },
    {
      "name": "Claude Code深度教程 - 100%免费从入门到精通100万字完全教程",
      "url": "https://claudecode.tangshuang.net/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=claudecode.tangshuang.net",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "claudecode.tangshuang.net",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "NoCode-零代码应用生成平台",
      "url": "https://nocode.cn/#/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=nocode.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "nocode.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "编程宝库 - 技术改变世界",
      "url": "http://www.codebaoku.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=codebaoku.com",
      "catelog": "开发导航",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "codebaoku.com",
      "category_slug": "dev-directory"
    },
    {
      "name": "开源、零代码游戏引擎。 | GDevelop",
      "url": "https://gdevelop.io/zh-cn/game-makers",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=gdevelop.io",
      "catelog": "开源工具导航",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "gdevelop.io",
      "category_slug": "open-source-tools"
    },
    {
      "name": "1.1 Claude Code是什么 | Claude Code深度教程，免费从入门到精通",
      "url": "https://claudecode.tangshuang.net/tutorial/1.1%20Claude%20Code%E6%98%AF%E4%BB%80%E4%B9%88",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=claudecode.tangshuang.net",
      "catelog": "AI工具目录",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "claudecode.tangshuang.net",
      "category_slug": "ai-tool-directory"
    },
    {
      "name": "网道 - 互联网开发文档",
      "url": "https://wangdoc.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=wangdoc.com",
      "catelog": "文档工具",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "wangdoc.com",
      "category_slug": "docs-tools"
    },
    {
      "name": "2020上半年软件设计师考试报名时间-培训教程-试题真题答案-成绩查询-希赛网",
      "url": "https://www.educity.cn/rk/prog/index.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=educity.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "educity.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "懒人Excel - Excel 函数公式、操作技巧、数据分析、图表模板、VBA、数据透视表教程",
      "url": "https://www.lanrenexcel.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=lanrenexcel.com",
      "catelog": "模板",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "lanrenexcel.com",
      "category_slug": "templates"
    },
    {
      "name": "编程",
      "url": "https://hourofcode.com/ca/cn/learn",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=hourofcode.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "hourofcode.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "代码随想录",
      "url": "https://programmercarl.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=programmercarl.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "programmercarl.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "OI Wiki - OI Wiki",
      "url": "https://oi-wiki.org/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=oi-wiki.org",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "oi-wiki.org",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Git - 图文教程",
      "url": "https://www.atlassian.com/git/tutorials/using-branches/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=atlassian.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "atlassian.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Learn Git Branching 游戏练习",
      "url": "http://learngitbranching.js.org/?demo",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=learngitbranching.js.org",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 编程学习/教程。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 编程学习/教程",
      "normalized_domain": "learngitbranching.js.org",
      "category_slug": "backlog-sites"
    },
    {
      "name": "书格",
      "url": "https://new.shuge.org/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=new.shuge.org",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 阅读/学习资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 阅读/学习资源",
      "normalized_domain": "new.shuge.org",
      "category_slug": "backlog-sites"
    },
    {
      "name": "热速美斯，只为一份精美简历",
      "url": "https://www.resumeis.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=resumeis.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 阅读/学习资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 阅读/学习资源",
      "normalized_domain": "resumeis.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "OfficePLUS- 让PPT制作更简单 | 微软官方打造的PPT制作一站式服务平台，助你摆脱办公焦虑",
      "url": "https://www.officeplus.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=officeplus.cn",
      "catelog": "演示与幻灯",
      "desc": "来源书签分组：书签栏 / 办公/PPT/Excel。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 办公/PPT/Excel",
      "normalized_domain": "officeplus.cn",
      "category_slug": "slides-presentation"
    },
    {
      "name": "研报客官网-全球智库研报|全行业研究报告|调查调研报告|趋势前景深度报告-实时更新免费下载pdf/doc/ppt",
      "url": "https://www.yanbaoke.com/index",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=yanbaoke.com",
      "catelog": "PDF工具",
      "desc": "来源书签分组：书签栏 / 办公/PPT/Excel。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 办公/PPT/Excel",
      "normalized_domain": "yanbaoke.com",
      "category_slug": "pdf-tools"
    },
    {
      "name": "Yesicon - 精选全球高品质、开源、免费的矢量图标库",
      "url": "https://yesicon.app/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=yesicon.app",
      "catelog": "图标与插画",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "yesicon.app",
      "category_slug": "icons-illustrations"
    },
    {
      "name": "More than analytics for iOS and Android in-app subscriptions – Apphud",
      "url": "https://apphud.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=apphud.com",
      "catelog": "分析工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "apphud.com",
      "category_slug": "analytics-tools"
    },
    {
      "name": "In-App Purchase Platform Built for Growth – Qonversion",
      "url": "https://qonversion.io/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=qonversion.io",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "qonversion.io",
      "category_slug": "general-tools"
    },
    {
      "name": "EasyApp - Ship Fast Mobile Apps",
      "url": "https://www.easyapp.site/zh",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=easyapp.site",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "easyapp.site",
      "category_slug": "general-tools"
    },
    {
      "name": "Content & Software localization on autopilot",
      "url": "https://localazy.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=localazy.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "localazy.com",
      "category_slug": "general-tools"
    },
    {
      "name": "Rive - Build interactive motion graphics that run anywhere",
      "url": "https://rive.app/?ref=blog.duolingo.com",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=rive.app",
      "catelog": "动效",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "rive.app",
      "category_slug": "motion"
    },
    {
      "name": "WildCard | 一分钟注册，轻松订阅海外软件服务",
      "url": "https://bewildcard.com/?code=APPSTORE",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=bewildcard.com",
      "catelog": "海外网址导航",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "bewildcard.com",
      "category_slug": "overseas-directory"
    },
    {
      "name": "Appwrite - Build like a team of hundreds",
      "url": "https://appwrite.io/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=appwrite.io",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "appwrite.io",
      "category_slug": "general-tools"
    },
    {
      "name": "RoutineHub • Your Community for Discovering, Sharing, and Version Controlling Apple Shortcuts",
      "url": "https://routinehub.co/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=routinehub.co",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "routinehub.co",
      "category_slug": "general-tools"
    },
    {
      "name": "HappyShip - SaaS模板配置平台",
      "url": "https://happyship.app/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=happyship.app",
      "catelog": "模板",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "happyship.app",
      "category_slug": "templates"
    },
    {
      "name": "AppIconGenerator - Free App Icon Generator for iOS & Android",
      "url": "https://www.appicongenerator.org/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=appicongenerator.org",
      "catelog": "图标与插画",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "appicongenerator.org",
      "category_slug": "icons-illustrations"
    },
    {
      "name": "APP截图",
      "url": "https://appscreenshots.net/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=appscreenshots.net",
      "catelog": "界面案例",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "appscreenshots.net",
      "category_slug": "ui-cases"
    },
    {
      "name": "json转model工具",
      "url": "https://app.quicktype.io/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=app.quicktype.io",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "app.quicktype.io",
      "category_slug": "general-tools"
    },
    {
      "name": "Browse iOS Apps | Mobbin",
      "url": "https://mobbin.com/browse/ios/apps#",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=mobbin.com",
      "catelog": "界面案例",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "mobbin.com",
      "category_slug": "ui-cases"
    },
    {
      "name": "Web Apps by 123apps - 编辑、转换、创建",
      "url": "https://123apps.com/cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=123apps.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "123apps.com",
      "category_slug": "general-tools"
    },
    {
      "name": "Learn Touch Typing Free - TypingClub",
      "url": "https://www.typingclub.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=typingclub.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "typingclub.com",
      "category_slug": "general-tools"
    },
    {
      "name": "WeChatTweak-macOS | A dynamic library tweak for WeChat macOS - 首款微信 macOS 客户端撤回拦截与多开",
      "url": "https://tweaks.app/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=tweaks.app",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "tweaks.app",
      "category_slug": "general-tools"
    },
    {
      "name": "作品更新和发布",
      "url": "https://code.pieces.app/updates",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=code.pieces.app",
      "catelog": "发布指南",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "code.pieces.app",
      "category_slug": "launch-guides"
    },
    {
      "name": "minux / goios / Downloads — Bitbucket",
      "url": "https://bitbucket.org/minux/goios/downloads",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=bitbucket.org",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "bitbucket.org",
      "category_slug": "general-tools"
    },
    {
      "name": "顶级工作 - freelancer.cn",
      "url": "https://www.freelancer.cn/jobs/?keyword=iOS&status=all",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=freelancer.cn",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "freelancer.cn",
      "category_slug": "general-tools"
    },
    {
      "name": "Json Parser Online",
      "url": "http://json.parser.online.fr/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=json.parser.online.fr",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "json.parser.online.fr",
      "category_slug": "general-tools"
    },
    {
      "name": "探讨 SwiftUI 中的关键属性包装器：@State、@Binding、@StateObject、@ObservedObject、@EnvironmentObject 和 @Environment | 肘子的 Swift 记事本",
      "url": "https://fatbobman.com/zh/posts/exploring-key-property-wrappers-in-swiftui/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=fatbobman.com",
      "catelog": "空状态与组件",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "fatbobman.com",
      "category_slug": "components-empty-states"
    },
    {
      "name": "UI合集",
      "url": "http://www.invisionapp.com/chat",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=invisionapp.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 工具/资源。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 工具/资源",
      "normalized_domain": "invisionapp.com",
      "category_slug": "general-tools"
    },
    {
      "name": "Screen Studio — 在几分钟内制作精美的屏幕录像",
      "url": "https://www.screen.studio/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=screen.studio",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "screen.studio",
      "category_slug": "general-tools"
    },
    {
      "name": "奇迹秀工具箱",
      "url": "https://www.qijishow.com/down/index.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=qijishow.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "qijishow.com",
      "category_slug": "general-tools"
    },
    {
      "name": "奇迹秀效率工具",
      "url": "https://www.qijishow.com/down/efficiency.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=qijishow.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "qijishow.com",
      "category_slug": "general-tools"
    },
    {
      "name": "识典古籍-古籍在线阅读平台",
      "url": "https://www.shidianguji.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=shidianguji.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "shidianguji.com",
      "category_slug": "general-tools"
    },
    {
      "name": "SSL/TLS安全评估报告",
      "url": "https://myssl.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=myssl.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "myssl.com",
      "category_slug": "general-tools"
    },
    {
      "name": "Z2H字帖 | 超级好用的字帖生成工具",
      "url": "https://paper.z2h.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=paper.z2h.cn",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "paper.z2h.cn",
      "category_slug": "general-tools"
    },
    {
      "name": "易撰自媒体工具_让内容创作更高效",
      "url": "https://www.yizhuan5.com/work.html#1-4",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=yizhuan5.com",
      "catelog": "社媒创作",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "yizhuan5.com",
      "category_slug": "social-content"
    },
    {
      "name": "编辑 PDF |安全 PDF 在线编辑器",
      "url": "https://xodo.com/zh_cn/redact-pdf",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=xodo.com",
      "catelog": "PDF工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "xodo.com",
      "category_slug": "pdf-tools"
    },
    {
      "name": "田字格字帖生成器_字帖打印_带笔顺的田字格、米字格、回宫格字帖在线免费生成，支持繁体中文字帖_Chinese Characters Stroke Order Worksheet Creator",
      "url": "https://www.an2.net/zi/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=an2.net",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "an2.net",
      "category_slug": "general-tools"
    },
    {
      "name": "易唱网_吉他谱_吉他入门学习_吉他弹唱教学_曲谱大全网站",
      "url": "http://www.echangwang.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=echangwang.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "echangwang.com",
      "category_slug": "general-tools"
    },
    {
      "name": "食物营养成分与科学食疗方案 - 唤醒食物",
      "url": "https://www.foodwake.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=foodwake.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "foodwake.com",
      "category_slug": "general-tools"
    },
    {
      "name": "指法输入中文打字俱乐部 | TypingClub",
      "url": "https://www.typingclub.com/da-zi",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=typingclub.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 在线工具/实用工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 在线工具/实用工具",
      "normalized_domain": "typingclub.com",
      "category_slug": "general-tools"
    },
    {
      "name": "全家桶激活码 - lookdiv(钥匙)",
      "url": "http://www.lookdiv.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=lookdiv.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 软件激活/工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 软件激活/工具",
      "normalized_domain": "lookdiv.com",
      "category_slug": "general-tools"
    },
    {
      "name": "专属激活码，开启程序人生",
      "url": "https://idea.medeming.com/idea/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=idea.medeming.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 软件激活/工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 软件激活/工具",
      "normalized_domain": "idea.medeming.com",
      "category_slug": "general-tools"
    },
    {
      "name": "爱好网——最大的密钥分享网站！",
      "url": "https://webact.185.hk/sharedkey.php",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=webact.185.hk",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 软件激活/工具。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 软件激活/工具",
      "normalized_domain": "webact.185.hk",
      "category_slug": "general-tools"
    },
    {
      "name": "银河录像局 次世代合租平台",
      "url": "https://nf.video/bNyPY",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=nf.video",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 娱乐/视频。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 娱乐/视频",
      "normalized_domain": "nf.video",
      "category_slug": "backlog-sites"
    },
    {
      "name": "HandBrake: Open Source Video Transcoder",
      "url": "https://handbrake.fr/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=handbrake.fr",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 娱乐/视频。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 娱乐/视频",
      "normalized_domain": "handbrake.fr",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Nginx 可视化神器！复杂配置一键生成，监控管理一条龙！",
      "url": "https://mp.weixin.qq.com/s?__biz=MzI4MDEwNzAzNg==&mid=2649460860&idx=1&sn=3e496da0b52ab76fc77def0435db574b&chksm=f3a2b10fc4d538199443fc4dc22529d26acb81743a45138b07af43ce2187c3381d495b899589#rd",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=mp.weixin.qq.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 新闻/媒体。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 新闻/媒体",
      "normalized_domain": "mp.weixin.qq.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "tds-Shiply｜腾讯端服务旗下面向端的全场景一站式发布平台",
      "url": "https://shiply.tds.qq.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=shiply.tds.qq.com",
      "catelog": "发布指南",
      "desc": "来源书签分组：书签栏 / 新闻/媒体。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 新闻/媒体",
      "normalized_domain": "shiply.tds.qq.com",
      "category_slug": "launch-guides"
    },
    {
      "name": "10个解放双手实用在线工具，有些代码真的不用手写！",
      "url": "https://mp.weixin.qq.com/s/yTp5u2zMbN6x13fIuec1sQ",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=mp.weixin.qq.com",
      "catelog": "常用工具",
      "desc": "来源书签分组：书签栏 / 新闻/媒体。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 新闻/媒体",
      "normalized_domain": "mp.weixin.qq.com",
      "category_slug": "general-tools"
    },
    {
      "name": "Git教程 - 廖雪峰的官方网站",
      "url": "http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=liaoxuefeng.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 新闻/媒体。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 新闻/媒体",
      "normalized_domain": "liaoxuefeng.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "罗布乐思官方网站-腾讯游戏",
      "url": "https://roblox.qq.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=roblox.qq.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 新闻/媒体。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 新闻/媒体",
      "normalized_domain": "roblox.qq.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Flutter 处理主题 Theme 的一些建议 | 猫哥 wiki.ducafecat.tech",
      "url": "https://wiki.ducafecat.tech/blog/2211/6-what-to-consider-when-dealing-with-flutter-theme.html#%E6%96%87%E6%9C%AC%E4%B8%BB%E9%A2%98",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=wiki.ducafecat.tech",
      "catelog": "设计社区",
      "desc": "来源书签分组：书签栏 / 社交媒体/社区。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 社交媒体/社区",
      "normalized_domain": "wiki.ducafecat.tech",
      "category_slug": "design-community"
    },
    {
      "name": "常用 Git 命令清单 - 阮一峰的网络日志",
      "url": "http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ruanyifeng.com",
      "catelog": "设计社区",
      "desc": "来源书签分组：书签栏 / 社交媒体/社区。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 社交媒体/社区",
      "normalized_domain": "ruanyifeng.com",
      "category_slug": "design-community"
    },
    {
      "name": "移除付费墙",
      "url": "https://paywallbuster.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=paywallbuster.com",
      "catelog": "设计社区",
      "desc": "来源书签分组：书签栏 / 社交媒体/社区。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 社交媒体/社区",
      "normalized_domain": "paywallbuster.com",
      "category_slug": "design-community"
    },
    {
      "name": "wx2share淘宝客二合一链接转换",
      "url": "https://www.wx2share.com/home/urlhandle/combolink.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=wx2share.com",
      "catelog": "跨境电商导航",
      "desc": "来源书签分组：书签栏 / 电商/淘客。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 电商/淘客",
      "normalized_domain": "wx2share.com",
      "category_slug": "cross-border-commerce"
    },
    {
      "name": "轻淘客采集 · 18淘客助手(使用帮助) · 看云",
      "url": "https://www.kancloud.cn/zhijian/tkzs/578716",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=kancloud.cn",
      "catelog": "跨境电商导航",
      "desc": "来源书签分组：书签栏 / 电商/淘客。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 电商/淘客",
      "normalized_domain": "kancloud.cn",
      "category_slug": "cross-border-commerce"
    },
    {
      "name": "淘宝客问答 | Taokeplus",
      "url": "https://taokeplus.com/wenda",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=taokeplus.com",
      "catelog": "跨境电商导航",
      "desc": "来源书签分组：书签栏 / 电商/淘客。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 电商/淘客",
      "normalized_domain": "taokeplus.com",
      "category_slug": "cross-border-commerce"
    },
    {
      "name": "WordPress淘宝客插件 (一键获取及自动填充商品信息和推广链接) - wptao",
      "url": "https://wptao.com/wptao.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=wptao.com",
      "catelog": "跨境电商导航",
      "desc": "来源书签分组：书签栏 / 电商/淘客。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 电商/淘客",
      "normalized_domain": "wptao.com",
      "category_slug": "cross-border-commerce"
    },
    {
      "name": "Accio：AI 商业助手，与阿里巴巴联合开发",
      "url": "https://zh.accio.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=zh.accio.com",
      "catelog": "跨境电商导航",
      "desc": "来源书签分组：书签栏 / 电商/淘客。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "开发"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 电商/淘客",
      "normalized_domain": "zh.accio.com",
      "category_slug": "cross-border-commerce"
    },
    {
      "name": "主页 - 证件数码相片质量检测中心",
      "url": "https://hzl.rzzx.com.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=hzl.rzzx.com.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 生活服务/其他。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 生活服务/其他",
      "normalized_domain": "hzl.rzzx.com.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "照片上传 - 证件数码相片质量检测中心",
      "url": "https://hzl.rzzx.com.cn/upload",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=hzl.rzzx.com.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 生活服务/其他。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 生活服务/其他",
      "normalized_domain": "hzl.rzzx.com.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "链滴 - 记录生活，连接点滴",
      "url": "https://ld246.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=ld246.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 生活服务/其他。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 生活服务/其他",
      "normalized_domain": "ld246.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Hitokoto - 一言",
      "url": "https://hitokoto.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=hitokoto.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 生活服务/其他。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 生活服务/其他",
      "normalized_domain": "hitokoto.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "神奇网站(搜索)",
      "url": "https://www.similarsites.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=similarsites.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 生活服务/其他。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 生活服务/其他",
      "normalized_domain": "similarsites.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "主页 — 🇨🇦🧑🏻‍💻信息共享",
      "url": "http://inforun.info/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=inforun.info",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 生活服务/其他。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 生活服务/其他",
      "normalized_domain": "inforun.info",
      "category_slug": "backlog-sites"
    },
    {
      "name": "专为中国用户优化的Skills社区",
      "url": "https://skillhub.tencent.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=skillhub.tencent.com",
      "catelog": "设计社区",
      "desc": "来源书签分组：书签栏 / 生活服务/其他。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 生活服务/其他",
      "normalized_domain": "skillhub.tencent.com",
      "category_slug": "design-community"
    },
    {
      "name": "Anime.js | JavaScript Animation Engine",
      "url": "https://animejs.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=animejs.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "animejs.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "OpenCorporates :: 企业世界的开放数据库",
      "url": "https://opencorporates.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=opencorporates.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "opencorporates.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "World Bank Open Data | Data",
      "url": "https://data.worldbank.org.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=data.worldbank.org.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "data.worldbank.org.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Flutter 库：自定义包、组件和模板",
      "url": "https://www.flutterlibrary.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=flutterlibrary.com",
      "catelog": "空状态与组件",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "素材"
      ],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "flutterlibrary.com",
      "category_slug": "components-empty-states"
    },
    {
      "name": "TiDB Cloud",
      "url": "https://tidbcloud.com/console/clusters/1379661944646198867/overview",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=tidbcloud.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "tidbcloud.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "数字素养-SZSYW.CN|数字素养与技能提升学习社区！",
      "url": "https://szsyw.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=szsyw.cn",
      "catelog": "设计社区",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "szsyw.cn",
      "category_slug": "design-community"
    },
    {
      "name": "iFixit：免费修理手册",
      "url": "https://zh.ifixit.com/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=zh.ifixit.com",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "zh.ifixit.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "二哥的Java进阶之路x沉默王二 | 二哥的Java进阶之路",
      "url": "https://javabetter.cn/home.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=javabetter.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "javabetter.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "QQ图片20190626103335.png",
      "url": "https://img.lcgod.com/2019/06/26/1561516450.png",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=img.lcgod.com",
      "catelog": "图库与图片",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "img.lcgod.com",
      "category_slug": "image-libraries"
    },
    {
      "name": "收藏接口信息--ShowDoc",
      "url": "https://www.showdoc.com.cn/3457/8443853147962907",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=showdoc.com.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "showdoc.com.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "豆腐海外版--ShowDoc",
      "url": "https://www.showdoc.com.cn/329123455469743",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=showdoc.com.cn",
      "catelog": "海外网址导航",
      "desc": "来源书签分组：书签栏 / 其他待整理。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签栏",
      "source_category_path": "书签栏 / 其他待整理",
      "normalized_domain": "showdoc.com.cn",
      "category_slug": "overseas-directory"
    },
    {
      "name": "零零七IDC_专业云计算服务提供商_高效稳定的服务器租用与托管服务",
      "url": "https://www.007idc.cn/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=007idc.cn",
      "catelog": "待整理站点",
      "desc": "来源书签分组：书签栏。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签栏",
      "source_category_path": "书签栏",
      "normalized_domain": "007idc.cn",
      "category_slug": "backlog-sites"
    },
    {
      "name": "Tower - 简单，好用的团队协作工具",
      "url": "https://tower.im/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=tower.im",
      "catelog": "常用工具",
      "desc": "来自导入书签的数据，后续可在后台补充说明。",
      "sort": 100,
      "hide": 0,
      "tags": [],
      "featured": 1,
      "source_site": "书签导入",
      "source_category_path": "",
      "normalized_domain": "tower.im",
      "category_slug": "general-tools"
    },
    {
      "name": "Loading…",
      "url": "http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtTypeEncodings.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=developer.apple.com",
      "catelog": "OCR",
      "desc": "来自导入书签的数据，后续可在后台补充说明。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "设计"
      ],
      "featured": 1,
      "source_site": "书签导入",
      "source_category_path": "",
      "normalized_domain": "developer.apple.com",
      "category_slug": "ocr"
    },
    {
      "name": "详解UIView的 contentStretch属性 - andyddd的专栏 - 博客频道 - CSDN.NET",
      "url": "http://blog.csdn.net/andyddd/article/details/7574885",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=blog.csdn.net",
      "catelog": "待整理站点",
      "desc": "来自导入书签的数据，后续可在后台补充说明。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI",
        "设计",
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签导入",
      "source_category_path": "",
      "normalized_domain": "blog.csdn.net",
      "category_slug": "backlog-sites"
    },
    {
      "name": "iPhone开源项目大全 - OPEN 开发经验库",
      "url": "http://www.open-open.com/lib//view/open1349782799838.html",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=open-open.com",
      "catelog": "开源工具导航",
      "desc": "来自导入书签的数据，后续可在后台补充说明。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "开发"
      ],
      "featured": 1,
      "source_site": "书签导入",
      "source_category_path": "",
      "normalized_domain": "open-open.com",
      "category_slug": "open-source-tools"
    },
    {
      "name": "Git & Cocoapods 小节 - 网易博客",
      "url": "http://gubaojian.blog.163.com/blog/static/16617990820136842533949/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=gubaojian.blog.163.com",
      "catelog": "待整理站点",
      "desc": "来自导入书签的数据，后续可在后台补充说明。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签导入",
      "source_category_path": "",
      "normalized_domain": "gubaojian.blog.163.com",
      "category_slug": "backlog-sites"
    },
    {
      "name": "网盘搜索 | Box123",
      "url": "https://box123.io/archives/favorites/%E7%BD%91%E7%9B%98%E6%90%9C%E7%B4%A2/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=box123.io",
      "catelog": "待整理站点",
      "desc": "来自导入书签的数据，后续可在后台补充说明。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "待整理"
      ],
      "featured": 0,
      "source_site": "书签导入",
      "source_category_path": "",
      "normalized_domain": "box123.io",
      "category_slug": "backlog-sites"
    },
    {
      "name": "盘搜 - 基于TG频道的网盘搜索工具",
      "url": "https://pansou.jkai.de/",
      "logo": "https://www.google.com/s2/favicons?sz=64&domain_url=pansou.jkai.de",
      "catelog": "常用工具",
      "desc": "来自导入书签的数据，后续可在后台补充说明。",
      "sort": 100,
      "hide": 0,
      "tags": [
        "AI"
      ],
      "featured": 1,
      "source_site": "书签导入",
      "source_category_path": "",
      "normalized_domain": "pansou.jkai.de",
      "category_slug": "general-tools"
    }
  ],
  "sources": [
    "https://gpt.candobear.com/toolbox",
    "https://toolai.io/zh/",
    "https://www.aitoolkit.org/",
    "https://publicapis.io/",
    "http://www.uxmap.cn/page/#/uxmap/home",
    "https://hao.uisdc.com/",
    "https://finance.sina.com.cn/jjxw/2023-02-21/doc-imyhmtay8727832.shtml",
    "https://www.deepdh.com/ai",
    "https://ai-bot.cn/",
    "https://www.ainavpro.com/",
    "https://aigc.cn/",
    "https://www.kanguowai.com/index.html",
    "https://ai.zhisuitech.com/#/title?channel=aigc_dny123",
    "http://www.chuhai2345.com/",
    "https://nav.newzone.top/",
    "https://www.zgztbdh.com/",
    "https://www.tuozhe8.com/",
    "https://www.kujiale.com/",
    "https://www.3vjia.com/",
    "https://www.amz123.com/",
    "http://daohang.taokeplus.com/#a7",
    "http://hao.shejidaren.com/"
  ],
  "summary": {
    "totalInput": 313,
    "totalSites": 289,
    "navigationSources": 22,
    "deduped": 14,
    "skipped": 10,
    "failed": 0
  }
};
