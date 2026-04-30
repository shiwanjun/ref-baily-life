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
				<div>
					<p class="eyebrow">当前范围</p>
					<h2>{selectedCategory?.name ?? '全部导航'}</h2>
					<p>{selectedCategory?.description ?? '从左侧分类树中选择一个大类、中类或小类。'}</p>
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
		background: #f5f7fb;
		color: #152033;
		font-family:
			'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	.shell {
		min-height: 100dvh;
	}

	.topbar {
		display: grid;
		grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
		gap: 24px;
		padding: 24px 28px 18px;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(18px);
		border-bottom: 1px solid #e4e9f2;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.brand-mark {
		width: 48px;
		height: 48px;
		border-radius: 14px;
		background: linear-gradient(135deg, #163a66, #2a8d77);
		color: #fff;
		display: grid;
		place-items: center;
		font-weight: 700;
		font-size: 1.05rem;
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
		color: #5e6d86;
		text-transform: uppercase;
		letter-spacing: 0.08em;
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
		color: #4e5d75;
	}

	.search input {
		width: 100%;
		border: 1px solid #d6ddea;
		border-radius: 14px;
		padding: 12px 14px;
		font: inherit;
		background: #fff;
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.ghost-link,
	.primary-link {
		border-radius: 12px;
		padding: 10px 14px;
		font-size: 0.92rem;
	}

	.ghost-link {
		background: #eef2f8;
	}

	.primary-link {
		background: #173a66;
		color: #fff;
	}

	.layout {
		display: grid;
		grid-template-columns: 320px minmax(0, 1fr);
		min-height: calc(100dvh - 98px);
	}

	.sidebar {
		border-right: 1px solid #e4e9f2;
		background: #f8fafc;
		padding: 22px 18px;
		position: sticky;
		top: 98px;
		align-self: start;
		max-height: calc(100dvh - 98px);
		overflow: auto;
	}

	.sidebar-head {
		margin-bottom: 16px;
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
		color: #64748b;
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
		border: 1px solid #e1e6f0;
		background: #fff;
		border-radius: 14px;
		padding: 11px 12px;
		text-align: left;
		cursor: pointer;
	}

	.tree-node.active {
		border-color: #173a66;
		box-shadow: 0 0 0 1px rgba(23, 58, 102, 0.12);
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
		border: 1px solid #d5deea;
		background: #f6f8fb;
		padding: 0;
		cursor: pointer;
	}

	.tree-dot {
		background: #dce4ef;
	}

	.tree-count {
		font-size: 0.8rem;
		color: #64748b;
	}

	.content {
		padding: 24px 28px 40px;
		display: grid;
		gap: 20px;
	}

	.hero,
	.panel,
	.empty {
		background: #fff;
		border: 1px solid #e4e9f2;
		border-radius: 24px;
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 18px;
		padding: 24px;
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(92px, 1fr));
		gap: 12px;
	}

	.hero-stats div {
		padding: 14px 16px;
		border-radius: 18px;
		background: #f4f7fb;
		display: grid;
		gap: 6px;
	}

	.hero-stats strong {
		font-size: 1.35rem;
	}

	.hero-stats span {
		font-size: 0.84rem;
		color: #64748b;
	}

	.panel {
		padding: 22px;
		display: grid;
		gap: 18px;
	}

	.panel-head {
		display: grid;
		gap: 6px;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 14px;
	}

	.site-card {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr);
		gap: 14px;
		padding: 16px;
		border-radius: 18px;
		background: #f8fafc;
		border: 1px solid #e6ebf2;
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.site-card:hover {
		transform: translateY(-2px);
		border-color: #c9d6e6;
		box-shadow: 0 18px 38px -24px rgba(21, 32, 51, 0.28);
	}

	.site-card img {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: #fff;
		border: 1px solid #e4e9f2;
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
		color: #5c6a81;
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
		color: #64748b;
	}

	.site-meta,
	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag-row span {
		padding: 4px 8px;
		border-radius: 999px;
		background: #eef3f8;
	}

	.featured .site-card,
	.site-card.featured {
		background: linear-gradient(180deg, #f8fbff, #f3f8f6);
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
	}

	.empty {
		padding: 34px 24px;
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
