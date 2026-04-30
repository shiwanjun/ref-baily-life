<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { CategoryNode, FlatCategoryNode, NavigationSite } from '$lib/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const allSites = $derived(data.sites as NavigationSite[]);
	const visibleSites = $derived(allSites.filter((site) => !site.hide));
	const categoryRows = $derived(data.categories as FlatCategoryNode[]);
	const categoryTree = $derived(data.categoryTree as CategoryNode[]);

	let searchQuery = $state('');
	let activeCategoryId = $state<number | null>(null);
	let selectedSite = $state<NavigationSite | null>(null);
	let currentSearchEngine = $state<string | null>(null);
	let activeQuickTag = $state('常用');

	const categoryById = $derived(new Map(categoryRows.map((category) => [category.id, category])));

	function buildDescendantMap(nodes: CategoryNode[]) {
		const map = new Map<number, number[]>();

		function walk(node: CategoryNode): number[] {
			const ids = [node.id, ...node.children.flatMap((child) => walk(child))];
			map.set(node.id, ids);
			return ids;
		}

		nodes.forEach((node) => walk(node));
		return map;
	}

	const descendantIdsByCategory = $derived(buildDescendantMap(categoryTree));

	function resolveTopCategoryId(categoryId: number | null) {
		if (!categoryId) return null;
		let current = categoryById.get(categoryId) ?? null;
		while (current?.parent_id) {
			current = categoryById.get(current.parent_id) ?? current;
		}
		return current?.id ?? categoryId;
	}

	const activeCategory = $derived(activeCategoryId ? categoryById.get(activeCategoryId) ?? null : null);
	const activeTopCategoryId = $derived(resolveTopCategoryId(activeCategoryId));
	const activeCategoryName = $derived(activeCategory?.name ?? '全部网站');
	const activeCategoryDescription = $derived(
		activeCategory?.description || '按分类浏览站点，也可以直接使用搜索快速定位内容。'
	);
	const activeCategoryPath = $derived.by(() => {
		if (!activeCategory) return [];
		const path: string[] = [];
		let current: FlatCategoryNode | undefined | null = activeCategory;
		while (current) {
			path.unshift(current.name);
			current = current.parent_id ? categoryById.get(current.parent_id) : null;
		}
		return path;
	});

	const filteredSites = $derived(
		visibleSites.filter((site) => {
			const matchesSearch =
				!searchQuery ||
				`${site.name} ${site.desc} ${site.category_path.join(' ')} ${site.tags.join(' ')} ${site.normalized_domain}`
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
			const matchesCategory =
				activeCategoryId == null ||
				(descendantIdsByCategory.get(activeCategoryId) ?? [activeCategoryId]).includes(site.category_id);
			return matchesSearch && matchesCategory;
		})
	);

	const groupedSites = $derived.by(() => {
		const output: Record<string, NavigationSite[]> = {};
		for (const site of filteredSites) {
			let key = site.category_path[0] || site.category || '未分类';
			if (activeCategory?.level === 1) {
				key = site.category_path[1] || site.category_path[0] || site.category || '未分类';
			} else if (activeCategory?.level === 2) {
				key = site.category_path[2] || site.category_path[1] || site.category || '未分类';
			} else if (activeCategory?.level === 3) {
				key = activeCategory.name;
			}
			if (!output[key]) output[key] = [];
			output[key].push(site);
		}
		return output;
	});

	const featuredSites = $derived(
		visibleSites.filter((site) => site.featured).slice(0, 8)
	);

	const sortedCategoryNames = $derived(
		Object.keys(groupedSites).sort((a, b) => {
			return a.localeCompare(b, 'zh');
		})
	);

	function handleCategoryClick(categoryId: number | null) {
		activeCategoryId = categoryId;
	}

	function categoryCount(categoryId: number | null) {
		if (categoryId == null) return visibleSites.length;
		const ids = descendantIdsByCategory.get(categoryId) ?? [categoryId];
		return visibleSites.filter((site) => ids.includes(site.category_id)).length;
	}

	function isCategoryActive(categoryId: number) {
		return activeCategoryId === categoryId;
	}

	function isSubtreeOpen(categoryId: number) {
		return activeTopCategoryId === categoryId;
	}

	function handleQuickTagClick(tag: string) {
		activeQuickTag = tag;
		if (tag === '常用') {
			currentSearchEngine = null;
			searchQuery = '';
		} else if (tag === '百度') {
			currentSearchEngine = 'baidu';
		} else if (tag === 'Google') {
			currentSearchEngine = 'google';
		} else if (tag === 'Github') {
			currentSearchEngine = 'github';
		} else if (tag === 'Stack Overflow') {
			currentSearchEngine = 'stackoverflow';
		}
	}

	function handleSearch() {
		if (currentSearchEngine && searchQuery) {
			let searchUrl = '';
			switch (currentSearchEngine) {
				case 'baidu':
					searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`;
					break;
				case 'google':
					searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
					break;
				case 'github':
					searchUrl = `https://github.com/search?q=${encodeURIComponent(searchQuery)}`;
					break;
				case 'stackoverflow':
					searchUrl = `https://stackoverflow.com/search?q=${encodeURIComponent(searchQuery)}`;
					break;
			}
			if (searchUrl) window.open(searchUrl, '_blank');
		}
	}

	function fallbackLogo(url: string) {
		return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}`;
	}
</script>

<svelte:head>
	<title>LT 导航 - 发现优质网站</title>
	<meta name="description" content="LT导航站，为设计师和开发者提供优质网站导航，收录设计教程、UI设计、灵感创意、设计素材等精品网站" />
</svelte:head>

<div class="page">
	<!-- 顶部导航 -->
	<header class="header">
		<div class="header-inner">
			<a href="/" class="logo">
				<div class="logo-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
					</svg>
				</div>
				<div class="logo-text">
					<span class="logo-title">LT导航</span>
					<span class="logo-subtitle">发现优质网站</span>
				</div>
			</a>

			<div class="search-wrapper">
				<div class="search-box">
					<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"/>
						<path d="M21 21l-4.35-4.35"/>
					</svg>
					<input
						type="text"
						placeholder={currentSearchEngine ? `在${activeQuickTag}中搜索` : '搜索网站、工具、资源...'}
						bind:value={searchQuery}
						onkeydown={(e) => e.key === 'Enter' && currentSearchEngine && handleSearch()}
					/>
					{#if currentSearchEngine && searchQuery}
						<button class="search-btn" type="button" aria-label="执行搜索" onclick={handleSearch}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M11 16l-4-4m0 0l4-4m-4 4h14"/>
							</svg>
						</button>
					{:else if searchQuery}
						<button class="clear-btn" type="button" aria-label="清空搜索" onclick={() => searchQuery = ''}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M18 6L6 18M6 6l12 12"/>
							</svg>
						</button>
					{/if}
				</div>
			</div>

			<div class="header-actions">
				<a href="#site-footer" class="header-link">说明</a>
				<a href="mailto:hello@liantang.fun" class="header-link">反馈</a>
				{#if $page.data.user || $page.data.loggedIn}
					<a href="/admin" class="header-btn primary">管理后台</a>
				{:else}
					<a href="/admin" class="header-btn primary">登录</a>
				{/if}
			</div>
		</div>
	</header>

	<!-- 主体区域 -->
	<div class="main-wrapper">
		<!-- 左侧分类导航 -->
		<aside class="sidebar">
			<div class="sidebar-inner">
				<div class="sidebar-section">
					<h3 class="sidebar-title">全部分类</h3>
					<nav class="category-nav">
						<button
							class="nav-item {activeCategoryId === null ? 'active' : ''}"
							onclick={() => handleCategoryClick(null)}
						>
							<span class="nav-icon">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<rect x="3" y="3" width="7" height="7"/>
									<rect x="14" y="3" width="7" height="7"/>
									<rect x="14" y="14" width="7" height="7"/>
									<rect x="3" y="14" width="7" height="7"/>
								</svg>
							</span>
							<span class="nav-text">全部网站</span>
							<span class="nav-count">{categoryCount(null)}</span>
						</button>

						{#each categoryTree as topCategory}
							<div class="nav-group">
								<button
									class="nav-item {isCategoryActive(topCategory.id) ? 'active' : ''}"
									onclick={() => handleCategoryClick(topCategory.id)}
								>
									<span class="nav-icon">
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
										</svg>
									</span>
									<span class="nav-text">{topCategory.name}</span>
									<span class="nav-count">{categoryCount(topCategory.id)}</span>
								</button>

								{#if isSubtreeOpen(topCategory.id)}
									<div class="subnav-panel">
										{#each topCategory.children as secondCategory}
											<div class="subnav-group">
												<button
													class="subnav-item level-2 {isCategoryActive(secondCategory.id) ? 'active' : ''}"
													onclick={() => handleCategoryClick(secondCategory.id)}
												>
													<span class="subnav-dot"></span>
													<span class="subnav-text">{secondCategory.name}</span>
													<span class="subnav-count">{categoryCount(secondCategory.id)}</span>
												</button>

												{#if secondCategory.children.length}
													<div class="subnav-children">
														{#each secondCategory.children as leafCategory}
															<button
																class="subnav-item level-3 {isCategoryActive(leafCategory.id) ? 'active' : ''}"
																onclick={() => handleCategoryClick(leafCategory.id)}
															>
																<span class="subnav-dot"></span>
																<span class="subnav-text">{leafCategory.name}</span>
																<span class="subnav-count">{categoryCount(leafCategory.id)}</span>
															</button>
														{/each}
													</div>
												{/if}
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</nav>
				</div>

				<div class="sidebar-footer">
						<div class="stats">
							<div class="stat-item">
								<span class="stat-value">{visibleSites.length}</span>
								<span class="stat-label">已收录</span>
							</div>
							<div class="stat-item">
							<span class="stat-value">{categoryRows.length}</span>
							<span class="stat-label">分类</span>
						</div>
					</div>
				</div>
			</div>
		</aside>

		<!-- 右侧内容区 -->
		<main class="main-content">
			<!-- 顶部横幅 -->
			<section class="hero-banner" transition:fade={{ duration: 600 }}>
				<div class="banner-inner">
					<h1 class="banner-title">
						<span class="banner-title-part1">发现</span>
						<span class="banner-title-part2">优质网站</span>
					</h1>
					<p class="banner-subtitle">汇聚设计灵感、开发工具、学习资源，为你的创作加速</p>

					<!-- 常用标签 -->
					<div class="quick-tags">
						<button class="quick-tag {activeQuickTag === '常用' ? 'active' : ''}" onclick={() => handleQuickTagClick('常用')}>
							常用
						</button>
						<button class="quick-tag {activeQuickTag === '百度' ? 'active' : ''}" onclick={() => handleQuickTagClick('百度')}>
							百度
						</button>
						<button class="quick-tag {activeQuickTag === 'Google' ? 'active' : ''}" onclick={() => handleQuickTagClick('Google')}>
							Google
						</button>
						<button class="quick-tag {activeQuickTag === 'Github' ? 'active' : ''}" onclick={() => handleQuickTagClick('Github')}>
							Github
						</button>
						<button class="quick-tag {activeQuickTag === 'Stack Overflow' ? 'active' : ''}" onclick={() => handleQuickTagClick('Stack Overflow')}>
							Stack Overflow
						</button>
					</div>

					<!-- 搜索框 -->
					<div class="banner-search">
						<input
							type="text"
							class="banner-search-input"
							placeholder={currentSearchEngine ? `在${activeQuickTag}中搜索...` : '搜索网站、工具、资源...'}
							bind:value={searchQuery}
							onkeydown={(e) => e.key === 'Enter' && currentSearchEngine && handleSearch()}
						/>
						{#if currentSearchEngine}
							<button class="banner-search-btn" onclick={handleSearch}>
								<svg class="search-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M11 16l-4-4m0 0l4-4m-4 4h14"/>
								</svg>
								搜索
							</button>
						{:else if searchQuery}
							<button class="banner-search-btn" type="button" aria-label="清空横幅搜索" onclick={() => searchQuery = ''}>
								<svg class="search-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M18 6L6 18M6 6l12 12"/>
								</svg>
							</button>
						{/if}
					</div>

					<!-- 热门标签 -->
					<div class="hot-tags">
						<span class="hot-label">🔥 热门搜索</span>
						<div class="hot-tags-list">
							<button class="hot-tag" type="button" onclick={() => searchQuery = 'AI'}>AI工具</button>
							<button class="hot-tag" type="button" onclick={() => searchQuery = '设计'}>设计资源</button>
							<button class="hot-tag" type="button" onclick={() => searchQuery = '开发'}>开发文档</button>
							<button class="hot-tag" type="button" onclick={() => searchQuery = '灵感'}>设计灵感</button>
							<button class="hot-tag" type="button" onclick={() => searchQuery = '配色'}>配色方案</button>
							<button class="hot-tag" type="button" onclick={() => searchQuery = '图标'}>图标素材</button>
						</div>
					</div>

					<!-- 装饰图形 -->
					<div class="banner-decoration decoration-1"></div>
					<div class="banner-decoration decoration-2"></div>
					<div class="banner-decoration decoration-3"></div>
				</div>
			</section>

			<!-- 精选推荐 -->
			{#if featuredSites.length > 0 && activeCategoryId === null && !currentSearchEngine && !searchQuery}
				<section class="featured-section" transition:fade={{ duration: 500, delay: 100 }}>
					<div class="section-header">
						<div class="section-title-wrap">
							<span class="section-title-icon">✨</span>
							<h2 class="section-title">精选推荐</h2>
						</div>
						<span class="section-badge">HOT</span>
					</div>
					<div class="featured-grid">
						{#each featuredSites as site, i}
							<button
								class="featured-card"
								transition:fly={{ y: 20, opacity: 0, delay: i * 80, duration: 400 }}
								onclick={() => selectedSite = site}
							>
								<div class="featured-icon">
									<img src={site.logo || fallbackLogo(site.url)} alt={site.name} loading="lazy" />
								</div>
								<div class="featured-info">
									<h3 class="featured-name">{site.name}</h3>
									<p class="featured-desc">{site.desc || site.catelog || '探索更多精彩内容'}</p>
								</div>
								<div class="featured-arrow">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M11 16l-4-4m0 0l4-4m-4 4h14"/>
									</svg>
								</div>
							</button>
						{/each}
					</div>
				</section>
			{/if}

			{#if activeCategoryId !== null}
				<section class="active-category-summary" transition:fade={{ duration: 300 }}>
					<div class="active-category-copy">
						<p class="active-category-label">当前导航</p>
						<h2>{activeCategoryName}</h2>
						<p>{activeCategoryDescription}</p>
					</div>
					<div class="active-category-meta">
						<span>{categoryCount(activeCategoryId)} 个站点</span>
						{#if activeCategoryPath.length}
							<span>{activeCategoryPath.join(' / ')}</span>
						{/if}
					</div>
				</section>
			{/if}

			<!-- 分类内容 -->
			{#each sortedCategoryNames as category, catIndex}
				<section class="category-section" transition:fade={{ duration: 400, delay: catIndex * 50 + 200 }}>
					<div class="section-header">
						<div class="section-title-wrap">
							<span class="section-title-icon">📁</span>
							<h2 class="section-title">{category}</h2>
						</div>
						<span class="section-count">{groupedSites[category].length} 个网站</span>
					</div>
					<div class="sites-grid">
						{#each groupedSites[category] as site, i}
							<button
								class="site-card"
								transition:fly={{ y: 15, opacity: 0, delay: i * 30, duration: 300 }}
								onclick={() => selectedSite = site}
							>
								<div class="site-icon">
									<img src={site.logo || fallbackLogo(site.url)} alt={site.name} loading="lazy" />
								</div>
								<div class="site-info">
									<h3 class="site-name">{site.name}</h3>
									<p class="site-desc">{site.desc || site.catelog || '发现更多精彩'}</p>
								</div>
								<div class="site-arrow">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M9 18l6-6-6-6"/>
									</svg>
								</div>
							</button>
						{/each}
					</div>
				</section>
			{:else}
				<div class="empty-state" transition:fade={{ duration: 400 }}>
					<div class="empty-icon">🔍</div>
					<p class="empty-text">
						{#if searchQuery}
							没有找到匹配 "{searchQuery}" 的网站
						{:else}
							暂无网站，请先在后台添加
						{/if}
					</p>
				</div>
			{/each}

			<!-- 页脚 -->
			<footer class="footer" id="site-footer">
				<div class="footer-content">
					<div class="footer-logo">
						<div class="footer-logo-icon">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
							</svg>
						</div>
						<span class="footer-logo-text">LT导航</span>
					</div>
					<p class="footer-text">© 2025 LT 导航站 · Powered by Cloudflare Workers</p>
				</div>
			</footer>
		</main>
	</div>

	<!-- 网站详情弹窗 -->
	{#if selectedSite}
		<div
			class="modal-overlay"
			in:fade={{ duration: 200 }}
			role="button"
			tabindex="0"
			aria-label="关闭弹窗"
			onclick={() => selectedSite = null}
			onkeydown={(event) => (event.key === 'Enter' || event.key === 'Escape') && (selectedSite = null)}
		>
			<div
				class="modal"
				in:fly={{ y: 20, duration: 300 }}
				role="dialog"
				aria-modal="true"
				tabindex="-1"
				onclick={(event) => event.stopPropagation()}
				onkeydown={(event) => event.stopPropagation()}
			>
				<button class="modal-close" type="button" aria-label="关闭弹窗" onclick={() => selectedSite = null}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12"/>
					</svg>
				</button>
				
				<div class="modal-header">
					<div class="modal-icon">
						<img src={selectedSite.logo || fallbackLogo(selectedSite.url)} alt={selectedSite.name} />
					</div>
					<div class="modal-title-wrap">
						<h2 class="modal-title">{selectedSite.name}</h2>
						<p class="modal-category">{selectedSite.category_path.join(' / ') || '未分类'}</p>
					</div>
				</div>
				
				{#if selectedSite.desc || selectedSite.catelog}
					<div class="modal-desc">
						<p>{selectedSite.desc || selectedSite.catelog}</p>
					</div>
				{/if}
				
				<div class="modal-actions">
					<button class="modal-btn cancel" onclick={() => selectedSite = null}>
						取消
					</button>
					<a 
						href={selectedSite.url} 
						target="_blank" 
						rel="noopener noreferrer"
						class="modal-btn confirm"
						onclick={() => selectedSite = null}
					>
						访问网站
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M11 16l-4-4m0 0l4-4m-4 4h14"/>
						</svg>
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* ==================== 设计系统 ==================== */
	:root {
		/* 配色方案 */
		--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		--primary-gradient-soft: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
		--accent-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		--success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		
		/* 主要颜色 */
		--primary-color: #667eea;
		--primary-dark: #5a67d8;
		--secondary-color: #764ba2;
		--accent-color: #f5576c;
		
		/* 文字颜色 */
		--text-primary: #1a202c;
		--text-secondary: #4a5568;
		--text-tertiary: #718096;
		--text-muted: #a0aec0;
		
		/* 背景颜色 */
		--bg-main: #f7fafc;
		--bg-white: #ffffff;
		--bg-card: #ffffff;
		--bg-hover: #f7fafc;
		
		/* 边框颜色 */
		--border-light: #e2e8f0;
		--border-medium: #cbd5e0;
		
		/* 阴影 */
		--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		
		/* 间距 */
		--spacing-xs: 0.5rem;
		--spacing-sm: 0.75rem;
		--spacing-md: 1rem;
		--spacing-lg: 1.5rem;
		--spacing-xl: 2rem;
		--spacing-2xl: 3rem;
		
		/* 圆角 */
		--radius-sm: 0.375rem;
		--radius-md: 0.5rem;
		--radius-lg: 0.75rem;
		--radius-xl: 1rem;
		--radius-2xl: 1.5rem;
		
		/* 动画 */
		--transition-fast: 150ms ease;
		--transition-normal: 250ms ease;
		--transition-slow: 350ms ease;
	}

	/* ==================== 基础样式 ==================== */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
		background: var(--bg-main);
		color: var(--text-primary);
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main-wrapper {
		flex: 1;
		display: flex;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: var(--spacing-2xl);
		min-width: 0;
	}

	/* ==================== 顶部导航 ==================== */
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--border-light);
	}

	.header-inner {
		max-width: 100%;
		margin: 0 auto;
		padding: var(--spacing-md) var(--spacing-xl);
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		text-decoration: none;
		color: var(--text-primary);
		flex-shrink: 0;
		width: 220px;
		transition: transform var(--transition-fast);
	}

	.logo:hover {
		transform: translateY(-2px);
	}

	.logo-icon {
		width: 48px;
		height: 48px;
		background: var(--primary-gradient);
		border-radius: var(--radius-xl);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		box-shadow: var(--shadow-md), 0 4px 14px rgba(102, 126, 234, 0.3);
	}

	.logo-icon svg {
		width: 26px;
		height: 26px;
	}

	.logo-text {
		display: flex;
		flex-direction: column;
	}

	.logo-title {
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		background: var(--primary-gradient);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.logo-subtitle {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		margin-top: 2px;
	}

	.search-wrapper {
		flex: 1;
		max-width: 520px;
	}

	.search-box {
		display: flex;
		align-items: center;
		background: var(--bg-main);
		border: 2px solid transparent;
		border-radius: var(--radius-2xl);
		padding: var(--spacing-sm) var(--spacing-md);
		transition: all var(--transition-normal);
	}

	.search-box:focus-within {
		background: var(--bg-white);
		border-color: var(--primary-color);
		box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
	}

	.search-icon {
		width: 20px;
		height: 20px;
		color: var(--text-tertiary);
		flex-shrink: 0;
	}

	.search-box input {
		flex: 1;
		border: none;
		background: transparent;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: 0.95rem;
		color: var(--text-primary);
		outline: none;
	}

	.search-box input::placeholder {
		color: var(--text-muted);
	}

	.clear-btn, .search-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: rgba(102, 126, 234, 0.1);
		border-radius: 50%;
		color: var(--primary-color);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.clear-btn:hover, .search-btn:hover {
		background: var(--primary-gradient);
		color: white;
		transform: scale(1.05);
	}

	.clear-btn svg, .search-btn svg {
		width: 16px;
		height: 16px;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		flex-shrink: 0;
	}

	.header-link {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		transition: color var(--transition-fast);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-lg);
	}

	.header-link:hover {
		color: var(--primary-color);
		background: var(--primary-gradient-soft);
	}

	.header-btn {
		padding: var(--spacing-sm) var(--spacing-lg);
		border-radius: var(--radius-2xl);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
		color: var(--text-secondary);
		background: var(--bg-main);
		border: 1px solid var(--border-light);
		transition: all var(--transition-normal);
		cursor: pointer;
	}

	.header-btn:hover {
		background: var(--bg-hover);
		border-color: var(--primary-color);
		transform: translateY(-2px);
		box-shadow: var(--shadow-sm);
	}

	.header-btn.primary {
		background: var(--primary-gradient);
		color: white;
		border: none;
		box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
	}

	.header-btn.primary:hover {
		box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
		transform: translateY(-3px);
	}

	/* ==================== 左侧分类导航 ==================== */
	.sidebar {
		width: 260px;
		flex-shrink: 0;
		background: var(--bg-white);
		border-right: 1px solid var(--border-light);
		position: sticky;
		top: 73px;
		height: calc(100vh - 73px);
		overflow-y: auto;
	}

	.sidebar-inner {
		padding: var(--spacing-xl) 0;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.sidebar-section {
		flex: 1;
		padding: 0 var(--spacing-md);
	}

	.sidebar-title {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0 var(--spacing-sm);
		margin-bottom: var(--spacing-md);
	}

	.category-nav {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.nav-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-sm);
		border: none;
		background: transparent;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--transition-normal);
		text-align: left;
		width: 100%;
	}

	.nav-item:hover {
		background: var(--bg-main);
	}

	.nav-item.active {
		background: var(--primary-gradient-soft);
		color: var(--primary-color);
	}

	.nav-item.active .nav-icon {
		color: var(--primary-color);
	}

	.nav-icon {
		width: 20px;
		height: 20px;
		color: var(--text-tertiary);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.nav-icon svg {
		width: 18px;
		height: 18px;
	}

	.nav-text {
		flex: 1;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.nav-item.active .nav-text {
		color: var(--primary-color);
		font-weight: 600;
	}

	.nav-count {
		font-size: 0.75rem;
		color: var(--text-muted);
		background: var(--bg-main);
		padding: 4px 10px;
		border-radius: var(--radius-2xl);
		font-weight: 600;
		flex-shrink: 0;
	}

	.nav-item.active .nav-count {
		background: var(--primary-gradient);
		color: white;
	}

	.subnav-panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-left: 12px;
		padding: 6px 0 10px 14px;
		border-left: 1px solid rgba(102, 126, 234, 0.14);
	}

	.subnav-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.subnav-children {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-left: 12px;
	}

	.subnav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		border: none;
		background: transparent;
		text-align: left;
		border-radius: var(--radius-md);
		padding: 8px 10px;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.subnav-item:hover {
		background: rgba(102, 126, 234, 0.06);
	}

	.subnav-item.active {
		background: rgba(102, 126, 234, 0.1);
	}

	.subnav-item.level-2 {
		font-weight: 600;
	}

	.subnav-item.level-3 {
		padding-left: 8px;
	}

	.subnav-dot {
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: rgba(118, 75, 162, 0.4);
		flex-shrink: 0;
	}

	.subnav-item.active .subnav-dot {
		background: var(--primary-color);
		box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.12);
	}

	.subnav-text {
		flex: 1;
		font-size: 0.86rem;
		color: var(--text-secondary);
		line-height: 1.35;
	}

	.subnav-item.active .subnav-text {
		color: var(--primary-color);
		font-weight: 700;
	}

	.subnav-count {
		flex-shrink: 0;
		font-size: 0.72rem;
		color: var(--text-muted);
		background: var(--bg-main);
		padding: 3px 8px;
		border-radius: 999px;
	}

	.subnav-item.active .subnav-count {
		background: white;
		color: var(--primary-color);
	}

	.sidebar-footer {
		padding: var(--spacing-lg) var(--spacing-md);
		border-top: 1px solid var(--border-light);
		margin-top: auto;
	}

	.stats {
		display: flex;
		gap: var(--spacing-md);
	}

	.stat-item {
		flex: 1;
		text-align: center;
		padding: var(--spacing-md);
		background: var(--bg-main);
		border-radius: var(--radius-xl);
		transition: transform var(--transition-fast);
	}

	.stat-item:hover {
		transform: translateY(-2px);
	}

	.stat-value {
		display: block;
		font-size: 1.4rem;
		font-weight: 800;
		background: var(--primary-gradient);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		margin-top: 2px;
		font-weight: 500;
	}

	/* ==================== 顶部横幅 ==================== */
	.hero-banner {
		background: var(--primary-gradient);
		border-radius: var(--radius-2xl);
		padding: var(--spacing-2xl);
		margin-bottom: var(--spacing-2xl);
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.banner-inner {
		max-width: 720px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}

	.banner-title {
		font-size: 2.5rem;
		font-weight: 800;
		color: white;
		margin-bottom: var(--spacing-sm);
		letter-spacing: -0.04em;
		line-height: 1.1;
	}

	.banner-title-part1 {
		display: inline-block;
		animation: fadeInUp 0.6s ease;
	}

	.banner-title-part2 {
		display: inline-block;
		animation: fadeInUp 0.6s ease 0.1s both;
	}

	.banner-subtitle {
		font-size: 1.1rem;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: var(--spacing-xl);
		font-weight: 400;
	}

	.quick-tags {
		display: flex;
		justify-content: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xl);
		flex-wrap: wrap;
	}

	.quick-tag {
		padding: var(--spacing-sm) var(--spacing-lg);
		border: 2px solid rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.1);
		color: white;
		font-size: 0.9rem;
		font-weight: 600;
		border-radius: var(--radius-2xl);
		cursor: pointer;
		transition: all var(--transition-normal);
		backdrop-filter: blur(10px);
	}

	.quick-tag:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.5);
		transform: translateY(-2px);
	}

	.quick-tag.active {
		background: white;
		color: var(--primary-color);
		border-color: white;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
	}

	/* 横幅搜索框 */
	.banner-search {
		display: flex;
		justify-content: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xl);
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.banner-search-input {
		flex: 1;
		padding: var(--spacing-md) var(--spacing-lg);
		border: none;
		border-radius: var(--radius-2xl);
		font-size: 1rem;
		background: rgba(255, 255, 255, 0.95);
		color: var(--text-primary);
		outline: none;
		transition: all var(--transition-normal);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}

	.banner-search-input::placeholder {
		color: var(--text-muted);
	}

	.banner-search-input:focus {
		background: white;
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
		transform: translateY(-2px);
	}

	.banner-search-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-md) var(--spacing-xl);
		border: none;
		background: white;
		color: var(--primary-color);
		font-size: 1rem;
		font-weight: 700;
		border-radius: var(--radius-2xl);
		cursor: pointer;
		transition: all var(--transition-normal);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}

	.banner-search-btn:hover {
		background: var(--primary-color);
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
	}

	.search-btn-icon {
		width: 20px;
		height: 20px;
	}

	.hot-tags {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-md);
		flex-wrap: wrap;
	}

	.hot-label {
		font-size: 0.85rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.hot-tags-list {
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
		justify-content: center;
	}

	.hot-tag {
		padding: 6px 14px;
		background: rgba(255, 255, 255, 0.15);
		color: white;
		font-size: 0.8rem;
		font-weight: 500;
		border-radius: var(--radius-2xl);
		text-decoration: none;
		cursor: pointer;
		transition: all var(--transition-normal);
	}

	.hot-tag:hover {
		background: rgba(255, 255, 255, 0.25);
		transform: translateY(-2px);
	}

	/* 装饰图形 */
	.banner-decoration {
		position: absolute;
		border-radius: 50%;
		opacity: 0.15;
	}

	.decoration-1 {
		width: 300px;
		height: 300px;
		background: white;
		top: -120px;
		left: -80px;
		filter: blur(40px);
	}

	.decoration-2 {
		width: 250px;
		height: 250px;
		background: #f093fb;
		top: -60px;
		right: -40px;
		filter: blur(50px);
	}

	.decoration-3 {
		width: 200px;
		height: 200px;
		background: #4facfe;
		bottom: -80px;
		right: 100px;
		filter: blur(40px);
	}

	/* ==================== 章节标题 ==================== */
	.section-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-xl);
	}

	.section-title-wrap {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.section-title-icon {
		font-size: 1.3rem;
	}

	.section-title {
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.02em;
	}

	.section-count {
		font-size: 0.85rem;
		color: var(--text-muted);
		background: var(--bg-main);
		padding: 6px 14px;
		border-radius: var(--radius-2xl);
		font-weight: 600;
	}

	.section-badge {
		font-size: 0.7rem;
		font-weight: 800;
		color: white;
		background: var(--accent-gradient);
		padding: 5px 12px;
		border-radius: var(--radius-2xl);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		box-shadow: 0 4px 14px rgba(245, 87, 108, 0.3);
	}

	/* ==================== 精选推荐 ==================== */
	.featured-section {
		margin-bottom: var(--spacing-2xl);
	}

	.active-category-summary {
		display: flex;
		justify-content: space-between;
		gap: var(--spacing-lg);
		align-items: flex-end;
		padding: var(--spacing-lg) var(--spacing-xl);
		margin-bottom: var(--spacing-xl);
		background: var(--bg-card);
		border: 1px solid rgba(102, 126, 234, 0.14);
		border-radius: var(--radius-2xl);
		box-shadow: var(--shadow-sm);
	}

	.active-category-copy h2 {
		font-size: 1.35rem;
		font-weight: 700;
		margin-bottom: 4px;
	}

	.active-category-copy p:last-child {
		color: var(--text-secondary);
		font-size: 0.92rem;
	}

	.active-category-label {
		margin-bottom: 6px;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--primary-color);
	}

	.active-category-meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 8px;
	}

	.active-category-meta span {
		padding: 6px 12px;
		border-radius: 999px;
		background: var(--primary-gradient-soft);
		color: var(--primary-color);
		font-size: 0.8rem;
		font-weight: 600;
	}

	.featured-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--spacing-lg);
	}

	.featured-card {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		background: var(--bg-card);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-xl);
		cursor: pointer;
		transition: all var(--transition-normal);
		text-align: left;
		position: relative;
		overflow: hidden;
	}

	.featured-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--primary-gradient);
		opacity: 0;
		transition: opacity var(--transition-normal);
	}

	.featured-card:hover {
		border-color: var(--primary-color);
		box-shadow: var(--shadow-lg);
		transform: translateY(-4px);
	}

	.featured-card:hover::before {
		opacity: 1;
	}

	.featured-icon {
		width: 64px;
		height: 64px;
		border-radius: var(--radius-xl);
		overflow: hidden;
		flex-shrink: 0;
		background: var(--bg-main);
		box-shadow: var(--shadow-sm);
	}

	.featured-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.featured-info {
		flex: 1;
		min-width: 0;
	}

	.featured-name {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 4px;
	}

	.featured-desc {
		font-size: 0.85rem;
		color: var(--text-tertiary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.featured-arrow {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		transition: all var(--transition-normal);
		flex-shrink: 0;
	}

	.featured-card:hover .featured-arrow {
		color: var(--primary-color);
		transform: translateX(4px);
	}

	.featured-arrow svg {
		width: 20px;
		height: 20px;
	}

	/* ==================== 分类内容 ==================== */
	.category-section {
		margin-bottom: var(--spacing-2xl);
	}

	.sites-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: var(--spacing-md);
	}

	.site-card {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background: var(--bg-card);
		border: 1px solid var(--border-light);
		border-radius: var(--radius-xl);
		cursor: pointer;
		transition: all var(--transition-normal);
		text-align: left;
	}

	.site-card:hover {
		border-color: var(--primary-color);
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
		background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
	}

	.site-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-lg);
		overflow: hidden;
		flex-shrink: 0;
		background: var(--bg-main);
	}

	.site-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.site-info {
		flex: 1;
		min-width: 0;
	}

	.site-name {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 3px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.site-desc {
		font-size: 0.8rem;
		color: var(--text-tertiary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.site-arrow {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		transition: all var(--transition-normal);
		flex-shrink: 0;
		opacity: 0;
	}

	.site-card:hover .site-arrow {
		opacity: 1;
		color: var(--primary-color);
		transform: translateX(4px);
	}

	.site-arrow svg {
		width: 18px;
		height: 18px;
	}

	/* ==================== 空状态 ==================== */
	.empty-state {
		text-align: center;
		padding: var(--spacing-2xl) var(--spacing-md);
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: var(--spacing-md);
	}

	.empty-text {
		font-size: 1rem;
		color: var(--text-tertiary);
	}

	/* ==================== 页脚 ==================== */
	.footer {
		margin-top: auto;
		padding: var(--spacing-2xl) 0;
		border-top: 1px solid var(--border-light);
	}

	.footer-content {
		text-align: center;
	}

	.footer-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-md);
	}

	.footer-logo-icon {
		width: 32px;
		height: 32px;
		background: var(--primary-gradient);
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.footer-logo-icon svg {
		width: 18px;
		height: 18px;
	}

	.footer-logo-text {
		font-size: 1rem;
		font-weight: 700;
		background: var(--primary-gradient);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.footer-text {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	/* ==================== 弹窗 ==================== */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--spacing-md);
		backdrop-filter: blur(8px);
	}

	.modal {
		background: var(--bg-white);
		border-radius: var(--radius-2xl);
		padding: var(--spacing-xl);
		max-width: 440px;
		width: 100%;
		position: relative;
		box-shadow: var(--shadow-xl);
	}

	.modal-close {
		position: absolute;
		top: var(--spacing-md);
		right: var(--spacing-md);
		width: 40px;
		height: 40px;
		border: none;
		background: var(--bg-main);
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--text-secondary);
		transition: all var(--transition-fast);
	}

	.modal-close:hover {
		background: var(--border-medium);
		color: var(--text-primary);
		transform: rotate(90deg);
	}

	.modal-close svg {
		width: 18px;
		height: 18px;
	}

	.modal-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-lg);
		padding-right: var(--spacing-xl);
	}

	.modal-icon {
		width: 72px;
		height: 72px;
		border-radius: var(--radius-xl);
		overflow: hidden;
		flex-shrink: 0;
		background: var(--bg-main);
		box-shadow: var(--shadow-md);
	}

	.modal-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.modal-title-wrap {
		flex: 1;
		min-width: 0;
	}

	.modal-title {
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 4px;
	}

	.modal-category {
		font-size: 0.85rem;
		color: var(--text-tertiary);
		background: var(--primary-gradient-soft);
		display: inline-block;
		padding: 4px 12px;
		border-radius: var(--radius-2xl);
		color: var(--primary-color);
		font-weight: 600;
	}

	.modal-desc {
		background: var(--bg-main);
		border-radius: var(--radius-xl);
		padding: var(--spacing-lg);
		margin-bottom: var(--spacing-xl);
	}

	.modal-desc p {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.7;
	}

	.modal-actions {
		display: flex;
		gap: var(--spacing-md);
	}

	.modal-btn {
		flex: 1;
		padding: var(--spacing-md) var(--spacing-xl);
		border-radius: var(--radius-xl);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-normal);
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
	}

	.modal-btn.cancel {
		border: 2px solid var(--border-light);
		background: var(--bg-white);
		color: var(--text-secondary);
	}

	.modal-btn.cancel:hover {
		background: var(--bg-main);
		border-color: var(--border-medium);
	}

	.modal-btn.confirm {
		border: none;
		background: var(--primary-gradient);
		color: white;
		box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
	}

	.modal-btn.confirm:hover {
		box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
		transform: translateY(-2px);
	}

	.modal-btn svg {
		width: 18px;
		height: 18px;
	}

	/* ==================== 动画 ==================== */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ==================== 响应式 ==================== */
	@media (max-width: 1024px) {
		.sidebar {
			width: 220px;
		}

		.main-content {
			padding: var(--spacing-xl);
		}

		.featured-grid {
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		}

		.sites-grid {
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		}

		.banner-title {
			font-size: 2.1rem;
		}
	}

	@media (max-width: 768px) {
		.header-inner {
			padding: var(--spacing-sm) var(--spacing-md);
			gap: var(--spacing-md);
		}

		.logo {
			width: auto;
		}

		.logo-text {
			display: none;
		}

		.search-wrapper {
			max-width: none;
		}

		.header-link {
			display: none;
		}

		.main-wrapper {
			flex-direction: column;
		}

		.sidebar {
			width: 100%;
			height: auto;
			position: relative;
			top: 0;
			border-right: none;
			border-bottom: 1px solid var(--border-light);
		}

		.sidebar-inner {
			padding: var(--spacing-md) 0;
		}

		.sidebar-section {
			padding: 0 var(--spacing-md);
		}

		.sidebar-title {
			display: none;
		}

		.category-nav {
			gap: var(--spacing-sm);
		}

		.nav-group {
			gap: 8px;
		}

		.nav-item {
			padding: var(--spacing-sm) var(--spacing-md);
		}

		.subnav-panel {
			margin-left: 8px;
			padding-left: 12px;
		}

		.subnav-children {
			padding-left: 8px;
		}

		.active-category-summary {
			flex-direction: column;
			align-items: flex-start;
			padding: var(--spacing-md) var(--spacing-lg);
		}

		.active-category-meta {
			justify-content: flex-start;
		}

		.sidebar-footer {
			display: none;
		}

		.main-content {
			padding: var(--spacing-md);
		}

		/* 横幅响应式 */
		.hero-banner {
			padding: var(--spacing-xl);
			border-radius: var(--radius-xl);
		}

		.banner-title {
			font-size: 1.7rem;
		}

		.banner-subtitle {
			font-size: 0.95rem;
		}

		.quick-tags {
			gap: var(--spacing-xs);
		}

		.quick-tag {
			padding: var(--spacing-xs) var(--spacing-md);
			font-size: 0.85rem;
		}

		.banner-search {
			flex-direction: column;
		}

		.banner-search-btn {
			width: 100%;
		}

		.hot-tags {
			flex-direction: column;
			align-items: center;
		}

		.featured-grid {
			grid-template-columns: 1fr;
		}

		.sites-grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-sm);
		}
	}

	@media (max-width: 480px) {
		.header-inner {
			gap: var(--spacing-sm);
		}

		.header-btn {
			padding: var(--spacing-xs) var(--spacing-md);
			font-size: 0.85rem;
		}

		.banner-title {
			font-size: 1.4rem;
		}

		.hero-banner {
			padding: var(--spacing-lg);
		}

		.featured-card {
			padding: var(--spacing-md);
		}

		.featured-icon {
			width: 52px;
			height: 52px;
		}

		.sites-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
