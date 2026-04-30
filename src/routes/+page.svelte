<script lang="ts">
	import { page } from '$app/stores';
	import type { CategoryNode, NavigationSite } from '$lib/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const categories = $derived(data.categories);
	const categoryTree = $derived(data.categoryTree as CategoryNode[]);
	const sites = $derived(data.sites as NavigationSite[]);
	const byId = $derived(new Map(categories.map((item) => [item.id, item])));
	const childrenByParent = $derived.by(() => {
		const map = new Map<number | null, number[]>();
		for (const category of categories) {
			const bucket = map.get(category.parent_id) ?? [];
			bucket.push(category.id);
			map.set(category.parent_id, bucket);
		}
		return map;
	});

	function collectDescendantIds(id: number): number[] {
		const output = [id];
		const queue = [id];
		while (queue.length) {
			const current = queue.shift()!;
			for (const child of childrenByParent.get(current) ?? []) {
				output.push(child);
				queue.push(child);
			}
		}
		return output;
	}

	let searchQuery = $state('');
	let selectedCategoryId = $state(0);
	let expandedIds = $state(new Set<number>());

	$effect(() => {
		if (!selectedCategoryId) {
			selectedCategoryId =
				categories.find((item) => item.slug === 'ai-directory')?.id ??
				categories.find((item) => item.level === 3)?.id ??
				categories[0]?.id ??
				0;
		}

		if (!expandedIds.size) {
			expandedIds = new Set(categoryTree.map((item) => item.id));
		}
	});

	const selectedCategory = $derived(byId.get(selectedCategoryId) ?? null);
	const activeIds = $derived(selectedCategoryId ? new Set(collectDescendantIds(selectedCategoryId)) : new Set<number>());
	const filteredSites = $derived(
		sites.filter((site) => {
			const inTree = !selectedCategoryId || activeIds.has(site.category_id);
			if (!inTree || site.hide) return false;
			const keyword = searchQuery.trim().toLowerCase();
			if (!keyword) return true;
			return `${site.name} ${site.desc} ${site.tags.join(' ')} ${site.category_path.join(' ')}`
				.toLowerCase()
				.includes(keyword);
		})
	);

	const featuredSites = $derived(filteredSites.filter((site) => site.featured).slice(0, 8));
	const groupedSites = $derived.by(() => {
		const groups = new Map<string, NavigationSite[]>();
		for (const site of filteredSites) {
			const groupName = site.category_path.at(-1) ?? '未分类';
			const bucket = groups.get(groupName) ?? [];
			bucket.push(site);
			groups.set(groupName, bucket);
		}
		return Array.from(groups.entries());
	});

	function toggleExpand(id: number) {
		const next = new Set(expandedIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		expandedIds = next;
	}

	function categoryCount(categoryId: number) {
		const ids = new Set(collectDescendantIds(categoryId));
		return sites.filter((site) => !site.hide && ids.has(site.category_id)).length;
	}

	function fallbackLogo(url: string) {
		return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}`;
	}
</script>

<svelte:head>
	<title>LT导航</title>
	<meta name="description" content="LT导航，面向 AI、设计、开发、出海与资源场景的三级导航工作台。" />
</svelte:head>

{#snippet categoryBranch(node: CategoryNode, depth = 0)}
	<div class="tree-branch depth-{depth}">
		<div class:active={selectedCategoryId === node.id} class="tree-node">
			<span class="tree-label">
				{#if node.children.length}
					<button class="tree-toggle" type="button" aria-label="切换展开" onclick={() => toggleExpand(node.id)}>
						{expandedIds.has(node.id) ? '−' : '+'}
					</button>
				{:else}
					<span class="tree-dot"></span>
				{/if}
				<button class="tree-select" type="button" onclick={() => selectedCategoryId = node.id}>{node.name}</button>
			</span>
			<span class="tree-count">{categoryCount(node.id)}</span>
		</div>

		{#if node.children.length && expandedIds.has(node.id)}
			<div class="tree-children">
				{#each node.children as child}
					{@render categoryBranch(child, depth + 1)}
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<div class="shell">
	<header class="topbar">
		<div class="brand">
			<a class="brand-mark" href="/">LT</a>
			<div>
				<p class="eyebrow">三级导航工作台</p>
				<h1>LT导航</h1>
			</div>
		</div>

		<div class="toolbar">
			<label class="search">
				<span>搜索</span>
				<input bind:value={searchQuery} type="search" placeholder="搜站点、标签、分类" />
			</label>
			<div class="toolbar-actions">
				<a class="ghost-link" href="mailto:hello@liantang.fun">反馈</a>
				{#if $page.data.loggedIn}
					<a class="primary-link" href="/admin">后台</a>
				{/if}
			</div>
		</div>
	</header>

	<div class="layout">
		<aside class="sidebar">
			<div class="sidebar-head">
				<h2>分类树</h2>
				<p>{categories.filter((item) => item.level === 3).length} 个三级小类</p>
			</div>

			<div class="tree">
				{#each categoryTree as node}
					{@render categoryBranch(node)}
				{/each}
			</div>
		</aside>

		<main class="content">
			<section class="hero">
				<div class="hero-copy">
					<p class="eyebrow">当前范围</p>
					<h2>{selectedCategory?.name ?? '全部导航'}</h2>
					<p>{selectedCategory?.description ?? '从左侧分类树中选择一个大类、中类或小类。'}</p>
					<div class="hero-pills">
						{#each categoryTree as topCategory}
							<button class:active={selectedCategoryId === topCategory.id} class="hero-pill" type="button" onclick={() => selectedCategoryId = topCategory.id}>
								<span>{topCategory.name}</span>
								<small>{categoryCount(topCategory.id)}</small>
							</button>
						{/each}
					</div>
				</div>
				<div class="hero-stats">
					<div>
						<strong>{filteredSites.length}</strong>
						<span>当前站点</span>
					</div>
					<div>
						<strong>{featuredSites.length}</strong>
						<span>精选推荐</span>
					</div>
					<div>
						<strong>{sites.filter((site) => !site.hide).length}</strong>
						<span>总收录</span>
					</div>
				</div>
			</section>

			{#if featuredSites.length}
				<section class="panel">
					<div class="panel-head">
						<h3>精选推荐</h3>
						<p>优先展示更适合直接打开使用的站点。</p>
					</div>
					<div class="card-grid featured">
						{#each featuredSites as site}
							<a class="site-card featured" href={site.url} target="_blank" rel="noreferrer">
								<img alt={site.name} src={site.logo || fallbackLogo(site.url)} />
								<div class="site-copy">
									<div class="site-title-row">
										<strong>{site.name}</strong>
										<span>{site.category_path.at(-1)}</span>
									</div>
									<p>{site.desc}</p>
									<div class="tag-row">
										{#each site.tags.slice(0, 4) as tag}
											<span>{tag}</span>
										{/each}
									</div>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			<section class="panel">
				<div class="panel-head">
					<h3>站点列表</h3>
					<p>
						{#if searchQuery}
							已按 “{searchQuery}” 过滤，共 {filteredSites.length} 条。
						{:else}
							按照三级小类分组展示，便于继续精修内容。
						{/if}
					</p>
				</div>

				{#if groupedSites.length}
					<div class="groups">
						{#each groupedSites as [groupName, groupSites]}
							<section class="group">
								<header class="group-head">
									<h4>{groupName}</h4>
									<span>{groupSites.length} 个站点</span>
								</header>
								<div class="card-grid">
									{#each groupSites as site}
										<a class="site-card" href={site.url} target="_blank" rel="noreferrer">
											<img alt={site.name} src={site.logo || fallbackLogo(site.url)} />
											<div class="site-copy">
												<strong>{site.name}</strong>
												<p>{site.desc}</p>
												<div class="site-meta">
													<span>{site.source_site || site.category_path.at(-2) || '手动整理'}</span>
													<span>{site.normalized_domain}</span>
												</div>
											</div>
										</a>
									{/each}
								</div>
							</section>
						{/each}
					</div>
				{:else}
					<div class="empty">
						<h3>当前没有匹配结果</h3>
						<p>换个关键词，或者从左侧切到其他分类看看。</p>
					</div>
				{/if}
			</section>
		</main>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background:
			radial-gradient(circle at top left, rgba(255, 202, 92, 0.16), transparent 24%),
			radial-gradient(circle at top right, rgba(87, 188, 182, 0.14), transparent 28%),
			#f7f5ef;
		color: #1f2937;
		font-family:
			'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	.shell {
		min-height: 100dvh;
		position: relative;
	}

	.topbar {
		display: grid;
		grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
		gap: 24px;
		padding: 22px 28px 18px;
		background: rgba(255, 251, 244, 0.92);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(210, 197, 173, 0.5);
		position: sticky;
		top: 0;
		z-index: 20;
		box-shadow: 0 14px 36px -34px rgba(53, 44, 25, 0.45);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.brand-mark {
		width: 52px;
		height: 52px;
		border-radius: 18px;
		background: linear-gradient(135deg, #1d5a73, #f0b53f);
		color: #fff;
		display: grid;
		place-items: center;
		font-weight: 700;
		font-size: 1.15rem;
		box-shadow: 0 18px 34px -22px rgba(29, 90, 115, 0.65);
	}

	.brand h1,
	.hero h2,
	.panel-head h3,
	.group-head h4 {
		margin: 0;
	}

	.eyebrow {
		margin: 0 0 6px;
		font-size: 0.75rem;
		color: #8c6f38;
		letter-spacing: 0.12em;
	}

	.toolbar {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 16px;
		align-items: center;
	}

	.search {
		display: grid;
		gap: 8px;
		font-size: 0.84rem;
		color: #5a6472;
	}

	.search input {
		width: 100%;
		border: 1px solid rgba(203, 190, 165, 0.8);
		border-radius: 18px;
		padding: 14px 16px;
		font: inherit;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.ghost-link,
	.primary-link {
		border-radius: 999px;
		padding: 10px 16px;
		font-size: 0.92rem;
	}

	.ghost-link {
		background: rgba(255, 255, 255, 0.85);
		border: 1px solid rgba(211, 201, 180, 0.8);
	}

	.primary-link {
		background: linear-gradient(135deg, #ea9c2d, #cf7c1a);
		color: #fff;
		box-shadow: 0 16px 28px -20px rgba(205, 124, 26, 0.65);
	}

	.layout {
		display: grid;
		grid-template-columns: 320px minmax(0, 1fr);
		min-height: calc(100dvh - 98px);
		max-width: 1540px;
		margin: 0 auto;
		padding: 18px 18px 28px;
		box-sizing: border-box;
	}

	.sidebar {
		border: 1px solid rgba(214, 205, 184, 0.72);
		background: rgba(255, 252, 246, 0.88);
		padding: 22px 18px;
		position: sticky;
		top: 116px;
		align-self: start;
		max-height: calc(100dvh - 132px);
		overflow: auto;
		border-radius: 28px;
		box-shadow: 0 22px 50px -42px rgba(64, 49, 29, 0.55);
	}

	.sidebar-head {
		margin-bottom: 18px;
		padding-bottom: 14px;
		border-bottom: 1px dashed rgba(203, 190, 165, 0.9);
	}

	.sidebar-head h2 {
		margin: 0 0 6px;
		font-size: 1rem;
	}

	.sidebar-head p,
	.panel-head p,
	.hero p,
	.group-head span,
	.empty p {
		margin: 0;
		color: #6b7280;
	}

	.tree {
		display: grid;
		gap: 8px;
	}

	.tree-branch {
		display: grid;
		gap: 8px;
	}

	.tree-children {
		display: grid;
		gap: 8px;
		padding-left: 16px;
	}

	.tree-node {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
		border: 1px solid rgba(223, 214, 193, 0.92);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(251, 247, 239, 0.95));
		border-radius: 18px;
		padding: 12px 14px;
		text-align: left;
		box-shadow: 0 10px 24px -24px rgba(39, 45, 60, 0.28);
	}

	.tree-node.active {
		border-color: rgba(230, 163, 71, 0.9);
		background: linear-gradient(180deg, #fff8e8, #fffdf7);
		box-shadow:
			0 0 0 1px rgba(230, 163, 71, 0.15),
			0 20px 36px -30px rgba(229, 159, 57, 0.5);
	}

	.tree-label {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.tree-select {
		border: 0;
		background: transparent;
		padding: 0;
		cursor: pointer;
		color: inherit;
		text-align: left;
	}

	.tree-toggle,
	.tree-dot {
		width: 18px;
		height: 18px;
		border-radius: 999px;
		display: inline-grid;
		place-items: center;
		flex: 0 0 18px;
	}

	.tree-toggle {
		border: 1px solid rgba(212, 201, 181, 0.85);
		background: #fffbf4;
		padding: 0;
		cursor: pointer;
		color: #8a6b36;
	}

	.tree-dot {
		background: linear-gradient(135deg, #f4c66f, #7ac3b1);
	}

	.tree-count {
		font-size: 0.8rem;
		color: #8a93a2;
	}

	.content {
		padding: 10px 0 0 22px;
		display: grid;
		gap: 20px;
	}

	.hero,
	.panel,
	.empty {
		background: rgba(255, 252, 247, 0.88);
		border: 1px solid rgba(217, 207, 186, 0.76);
		border-radius: 30px;
		box-shadow: 0 24px 60px -46px rgba(52, 43, 27, 0.38);
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 20px;
		padding: 28px;
		background:
			linear-gradient(135deg, rgba(255, 245, 214, 0.92), rgba(255, 255, 255, 0.92)),
			radial-gradient(circle at right top, rgba(104, 197, 182, 0.18), transparent 30%);
	}

	.hero-copy {
		display: grid;
		gap: 14px;
	}

	.hero-copy h2 {
		font-size: clamp(1.8rem, 3vw, 2.7rem);
		letter-spacing: 0.01em;
	}

	.hero-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 4px;
	}

	.hero-pill {
		border: 1px solid rgba(216, 202, 173, 0.9);
		background: rgba(255, 255, 255, 0.78);
		color: #48556a;
		border-radius: 999px;
		padding: 9px 12px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
	}

	.hero-pill.active {
		background: #fff7df;
		border-color: rgba(231, 172, 78, 0.95);
		color: #6f4f14;
	}

	.hero-pill small {
		font-size: 0.74rem;
		color: #8d97a8;
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(92px, 1fr));
		gap: 12px;
	}

	.hero-stats div {
		padding: 16px 16px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.78);
		border: 1px solid rgba(220, 211, 193, 0.74);
		display: grid;
		gap: 6px;
	}

	.hero-stats strong {
		font-size: 1.55rem;
		color: #1f4b66;
	}

	.hero-stats span {
		font-size: 0.84rem;
		color: #7a8495;
	}

	.panel {
		padding: 24px;
		display: grid;
		gap: 18px;
	}

	.panel-head {
		display: grid;
		gap: 8px;
		padding-bottom: 12px;
		border-bottom: 1px dashed rgba(213, 203, 183, 0.92);
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 16px;
	}

	.site-card {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr);
		gap: 14px;
		padding: 18px;
		border-radius: 22px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(250, 247, 240, 0.96));
		border: 1px solid rgba(223, 214, 194, 0.86);
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.site-card:hover {
		transform: translateY(-3px);
		border-color: rgba(231, 170, 78, 0.85);
		box-shadow: 0 22px 42px -28px rgba(89, 70, 34, 0.34);
	}

	.site-card img {
		width: 46px;
		height: 46px;
		border-radius: 14px;
		background: #fff;
		border: 1px solid rgba(226, 218, 200, 0.88);
		object-fit: cover;
	}

	.site-copy {
		display: grid;
		gap: 8px;
		min-width: 0;
	}

	.site-copy strong,
	.site-copy p,
	.site-meta span,
	.tag-row span,
	.site-title-row span {
		overflow-wrap: anywhere;
	}

	.site-copy p {
		margin: 0;
		font-size: 0.92rem;
		color: #5c6778;
		line-height: 1.55;
	}

	.site-title-row {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 8px;
	}

	.site-title-row span,
	.site-meta span,
	.tag-row span {
		font-size: 0.76rem;
		color: #8a93a2;
	}

	.site-meta,
	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 9px;
	}

	.tag-row span {
		padding: 5px 9px;
		border-radius: 999px;
		background: #fff4dc;
		color: #8c6214;
	}

	.featured .site-card,
	.site-card.featured {
		background:
			linear-gradient(180deg, rgba(255, 251, 234, 0.98), rgba(243, 251, 248, 0.98)),
			radial-gradient(circle at right top, rgba(103, 197, 182, 0.15), transparent 35%);
	}

	.groups {
		display: grid;
		gap: 18px;
	}

	.group {
		display: grid;
		gap: 12px;
	}

	.group-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding-left: 2px;
	}

	.empty {
		padding: 42px 24px;
		text-align: center;
	}

	@media (max-width: 1080px) {
		.topbar,
		.layout,
		.hero {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
			max-height: none;
		}

		.content {
			padding-left: 0;
		}
	}

	@media (max-width: 720px) {
		.topbar,
		.content {
			padding-left: 16px;
			padding-right: 16px;
		}

		.sidebar {
			padding: 18px 16px;
		}

		.toolbar {
			grid-template-columns: 1fr;
		}

		.toolbar-actions,
		.hero-stats {
			grid-template-columns: 1fr;
		}
	}
</style>
