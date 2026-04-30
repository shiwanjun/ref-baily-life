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

	function flattenTree(nodes: CategoryNode[]): number[] {
		return nodes.flatMap((node) => [node.id, ...flattenTree(node.children)]);
	}

	function categoryCount(categoryId: number) {
		const ids = new Set(collectDescendantIds(categoryId));
		return sites.filter((site) => !site.hide && ids.has(site.category_id)).length;
	}

	function fallbackLogo(url: string) {
		return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}`;
	}

	function lineageNames(categoryId: number) {
		const names: string[] = [];
		let current = byId.get(categoryId) ?? null;
		while (current) {
			names.unshift(current.name);
			current = current.parent_id ? byId.get(current.parent_id) ?? null : null;
		}
		return names;
	}

	let searchQuery = $state('');
	let selectedCategoryId = $state(0);
	let expandedIds = $state(new Set<number>());

	$effect(() => {
		if (!selectedCategoryId) {
			selectedCategoryId =
				categories.find((item) => item.level === 1 && categoryCount(item.id) > 0)?.id ??
				categories.find((item) => categoryCount(item.id) > 0)?.id ??
				categories[0]?.id ??
				0;
		}

		if (!expandedIds.size) {
			expandedIds = new Set(flattenTree(categoryTree));
		}
	});

	const selectedCategory = $derived(byId.get(selectedCategoryId) ?? null);
	const selectedPath = $derived(selectedCategory ? lineageNames(selectedCategory.id) : []);
	const activeIds = $derived(
		selectedCategoryId ? new Set(collectDescendantIds(selectedCategoryId)) : new Set<number>()
	);
	const filteredSites = $derived(
		sites.filter((site) => {
			const inTree = !selectedCategoryId || activeIds.has(site.category_id);
			if (!inTree || site.hide) return false;
			const keyword = searchQuery.trim().toLowerCase();
			if (!keyword) return true;
			return `${site.name} ${site.desc} ${site.tags.join(' ')} ${site.category_path.join(' ')} ${site.normalized_domain}`
				.toLowerCase()
				.includes(keyword);
		})
	);
	const featuredSites = $derived.by(() => {
		const featured = filteredSites.filter((site) => site.featured);
		return (featured.length ? featured : filteredSites).slice(0, 6);
	});
	const groupedSites = $derived.by(() => {
		const groups = new Map<string, NavigationSite[]>();
		for (const site of filteredSites) {
			const groupName = site.category_path.at(-1) ?? '未分类';
			const bucket = groups.get(groupName) ?? [];
			bucket.push(site);
			groups.set(groupName, bucket);
		}
		return Array.from(groups.entries()).map(([groupName, groupSites]) => [
			groupName,
			groupSites.sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort - b.sort || a.id - b.id)
		] as const);
	});
	const visibleTopCategories = $derived(
		categoryTree
			.map((node) => ({ node, count: categoryCount(node.id) }))
			.filter((item) => item.count > 0)
			.slice(0, 8)
	);
	const sourceHighlights = $derived.by(() => {
		const counts = new Map<string, number>();
		for (const site of filteredSites) {
			const source = site.source_site?.trim();
			if (!source) continue;
			counts.set(source, (counts.get(source) ?? 0) + 1);
		}
		return Array.from(counts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5);
	});
	const leafCount = $derived(new Set(filteredSites.map((site) => site.category_path.at(-1) ?? '未分类')).size);

	function toggleExpand(id: number) {
		const next = new Set(expandedIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		expandedIds = next;
	}
</script>

<svelte:head>
	<title>LT导航</title>
	<meta name="description" content="LT导航，面向 AI、设计、开发、出海与资源场景的三级导航工作台。" />
</svelte:head>

{#snippet categoryBranch(node: CategoryNode, depth = 0)}
	<div class="tree-branch depth-{depth}">
		<div class:active={selectedCategoryId === node.id} class="tree-node">
			<div class="tree-main">
				{#if node.children.length}
					<button class="tree-toggle" type="button" aria-label="切换展开" onclick={() => toggleExpand(node.id)}>
						{expandedIds.has(node.id) ? '−' : '+'}
					</button>
				{:else}
					<span class="tree-dot"></span>
				{/if}
				<button class="tree-select" type="button" onclick={() => (selectedCategoryId = node.id)}>
					<strong>{node.name}</strong>
					<small>L{node.level}</small>
				</button>
			</div>
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
			<div class="brand-copy">
				<p class="eyebrow">LT NAVIGATION</p>
				<h1>LT导航</h1>
				<p class="brand-note">AI、设计、开发、出海与资源的一站式导航台</p>
			</div>
		</div>

		<div class="toolbar">
			<label class="search">
				<span>全站搜索</span>
				<input bind:value={searchQuery} type="search" placeholder="搜索站点、标签、分类、域名" />
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
				<div>
					<p class="eyebrow">CATEGORY TREE</p>
					<h2>分类导航</h2>
				</div>
				<button class:selected={!selectedCategoryId} class="sidebar-overview" type="button" onclick={() => (selectedCategoryId = 0)}>
					<span>查看全部</span>
					<strong>{sites.filter((site) => !site.hide).length}</strong>
				</button>
			</div>

			<div class="sidebar-stats">
				<div>
					<strong>{categoryTree.length}</strong>
					<span>一级大类</span>
				</div>
				<div>
					<strong>{categories.filter((item) => item.level === 3).length}</strong>
					<span>三级小类</span>
				</div>
			</div>

			<div class="tree">
				{#each categoryTree as node}
					{@render categoryBranch(node)}
				{/each}
			</div>
		</aside>

		<main class="content">
			<section class="overview">
				<div class="overview-main">
					<div class="overview-copy">
						<p class="eyebrow">CURRENT SCOPE</p>
						<div class="breadcrumb">
							{#if selectedPath.length}
								{#each selectedPath as item, index}
									<span>{item}</span>{#if index < selectedPath.length - 1}<i>/</i>{/if}
								{/each}
							{:else}
								<span>全部导航</span>
							{/if}
						</div>
						<h2>{selectedCategory?.name ?? '全部导航'}</h2>
						<p class="overview-note">
							{selectedCategory?.description ??
								'按大类、中类、小类逐层浏览，也可以直接搜索站点、标签和域名。'}
						</p>
					</div>

					<div class="overview-actions">
						{#each visibleTopCategories as { node, count }}
							<button
								class:active={selectedCategoryId === node.id}
								class="scope-chip"
								type="button"
								onclick={() => (selectedCategoryId = node.id)}
							>
								<span>{node.name}</span>
								<small>{count}</small>
							</button>
						{/each}
					</div>
				</div>

				<div class="overview-stats">
					<div>
						<strong>{filteredSites.length}</strong>
						<span>当前站点</span>
					</div>
					<div>
						<strong>{leafCount}</strong>
						<span>覆盖小类</span>
					</div>
					<div>
						<strong>{featuredSites.length}</strong>
						<span>优先推荐</span>
					</div>
					<div>
						<strong>{sites.filter((site) => !site.hide).length}</strong>
						<span>总收录</span>
					</div>
				</div>

				{#if sourceHighlights.length}
					<div class="source-strip">
						<span>来源导航</span>
						<div>
							{#each sourceHighlights as [source, count]}
								<em>{source} · {count}</em>
							{/each}
						</div>
					</div>
				{/if}
			</section>

			{#if featuredSites.length}
				<section class="panel">
					<div class="panel-head">
						<div>
							<p class="eyebrow">HIGHLIGHTS</p>
							<h3>优先看这些</h3>
						</div>
						<p>先把高价值站点抬到第一屏，避免一进来就空空荡荡。</p>
					</div>

					<div class="spotlight-grid">
						{#each featuredSites as site}
							<a class="spotlight-card" href={site.url} target="_blank" rel="noreferrer">
								<div class="spotlight-head">
									<img alt={site.name} src={site.logo || fallbackLogo(site.url)} />
									<div>
										<strong>{site.name}</strong>
										<span>{site.category_path.at(-1)}</span>
									</div>
								</div>
								<p>{site.desc}</p>
								<div class="spotlight-meta">
									<small>{site.source_site || site.category_path.at(-2) || '站点整理'}</small>
									<small>{site.normalized_domain}</small>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			<section class="panel">
				<div class="panel-head">
					<div>
						<p class="eyebrow">DIRECTORY</p>
						<h3>分类站点列表</h3>
					</div>
					<p>
						{#if searchQuery}
							关键词 “{searchQuery}” 共命中 {filteredSites.length} 个站点。
						{:else}
							按三级小类拆分展示，方便继续筛选、补充和精修。
						{/if}
					</p>
				</div>

				{#if groupedSites.length}
					<div class="groups">
						{#each groupedSites as [groupName, groupSites]}
							<section class="group">
								<header class="group-head">
									<div>
										<h4>{groupName}</h4>
										<p>{groupSites[0]?.category_path.slice(0, -1).join(' / ') || '未归类'}</p>
									</div>
									<span>{groupSites.length} 个站点</span>
								</header>

								<div class="card-grid">
									{#each groupSites as site}
										<a class="site-card" href={site.url} target="_blank" rel="noreferrer">
											<img alt={site.name} src={site.logo || fallbackLogo(site.url)} />
											<div class="site-copy">
												<div class="site-title-row">
													<strong>{site.name}</strong>
													{#if site.featured}
														<small class="site-badge">精选</small>
													{/if}
												</div>
												<p>{site.desc}</p>
												<div class="site-meta">
													<span>{site.source_site || site.category_path.at(-2) || '手动整理'}</span>
													<span>{site.normalized_domain}</span>
												</div>
												{#if site.tags.length}
													<div class="tag-row">
														{#each site.tags.slice(0, 3) as tag}
															<em>{tag}</em>
														{/each}
													</div>
												{/if}
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
			radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 24%),
			radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.07), transparent 28%),
			#f3f6fb;
		color: #0f172a;
		font-family:
			'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	:global(button),
	:global(input) {
		font: inherit;
	}

	.shell {
		min-height: 100dvh;
	}

	.topbar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: grid;
		grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
		gap: 24px;
		align-items: center;
		padding: 18px 24px;
		background: rgba(248, 250, 252, 0.86);
		backdrop-filter: blur(18px);
		border-bottom: 1px solid rgba(148, 163, 184, 0.18);
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
		display: grid;
		place-items: center;
		background: linear-gradient(135deg, #0f172a, #2563eb);
		color: #fff;
		font-size: 1.05rem;
		font-weight: 800;
		box-shadow: 0 16px 28px -20px rgba(37, 99, 235, 0.58);
	}

	.brand-copy,
	.overview-copy,
	.sidebar-head,
	.panel-head,
	.site-copy,
	.group {
		display: grid;
		gap: 6px;
	}

	.brand-copy h1,
	.overview-copy h2,
	.panel-head h3,
	.group-head h4 {
		margin: 0;
	}

	.brand-note,
	.overview-note,
	.panel-head p,
	.group-head p,
	.empty p,
	.source-strip span {
		margin: 0;
		color: #64748b;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		color: #2563eb;
		font-weight: 700;
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
		font-size: 0.82rem;
		color: #475569;
	}

	.search input {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid rgba(148, 163, 184, 0.24);
		border-radius: 16px;
		padding: 14px 16px;
		background: rgba(255, 255, 255, 0.94);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.85) inset,
			0 10px 24px -24px rgba(15, 23, 42, 0.35);
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.ghost-link,
	.primary-link,
	.scope-chip,
	.sidebar-overview {
		border-radius: 14px;
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			background 0.18s ease,
			box-shadow 0.18s ease;
	}

	.ghost-link,
	.primary-link {
		padding: 11px 16px;
		font-size: 0.92rem;
		border: 1px solid transparent;
	}

	.ghost-link {
		background: #fff;
		border-color: rgba(148, 163, 184, 0.24);
		color: #0f172a;
	}

	.primary-link {
		background: #2563eb;
		color: #fff;
		box-shadow: 0 14px 24px -18px rgba(37, 99, 235, 0.75);
	}

	.layout {
		display: grid;
		grid-template-columns: 296px minmax(0, 1fr);
		gap: 20px;
		max-width: 1640px;
		margin: 0 auto;
		padding: 20px;
		box-sizing: border-box;
	}

	.sidebar,
	.panel,
	.overview,
	.empty {
		background: rgba(255, 255, 255, 0.92);
		border: 1px solid rgba(148, 163, 184, 0.18);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.9) inset,
			0 28px 48px -40px rgba(15, 23, 42, 0.22);
	}

	.sidebar {
		position: sticky;
		top: 96px;
		align-self: start;
		max-height: calc(100dvh - 116px);
		overflow: auto;
		border-radius: 24px;
		padding: 18px;
	}

	.sidebar-head {
		padding-bottom: 16px;
		border-bottom: 1px solid rgba(226, 232, 240, 0.95);
	}

	.sidebar-overview {
		border: 1px solid rgba(226, 232, 240, 1);
		background: #f8fafc;
		padding: 12px 14px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #0f172a;
		cursor: pointer;
	}

	.sidebar-overview.selected,
	.scope-chip.active {
		background: rgba(37, 99, 235, 0.08);
		border-color: rgba(37, 99, 235, 0.26);
		box-shadow: 0 16px 28px -24px rgba(37, 99, 235, 0.6);
	}

	.sidebar-stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		margin: 16px 0 18px;
	}

	.sidebar-stats div,
	.overview-stats div {
		border-radius: 18px;
		padding: 14px;
		background: #f8fafc;
		border: 1px solid rgba(226, 232, 240, 0.95);
		display: grid;
		gap: 4px;
	}

	.sidebar-stats strong,
	.overview-stats strong {
		font-size: 1.28rem;
	}

	.sidebar-stats span,
	.overview-stats span,
	.tree-count,
	.tree-select small,
	.site-meta span,
	.spotlight-meta small {
		color: #64748b;
	}

	.tree,
	.tree-children,
	.groups {
		display: grid;
		gap: 10px;
	}

	.tree-children {
		padding-left: 14px;
	}

	.tree-node {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 16px;
		border: 1px solid rgba(226, 232, 240, 1);
		background: #fff;
	}

	.tree-node.active {
		border-color: rgba(37, 99, 235, 0.26);
		background: rgba(37, 99, 235, 0.05);
	}

	.tree-main {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.tree-toggle,
	.tree-dot {
		width: 18px;
		height: 18px;
		flex: 0 0 18px;
		border-radius: 999px;
		display: grid;
		place-items: center;
	}

	.tree-toggle {
		border: 1px solid rgba(148, 163, 184, 0.3);
		background: #f8fafc;
		color: #2563eb;
		cursor: pointer;
	}

	.tree-dot {
		background: linear-gradient(135deg, #2563eb, #0ea5e9);
	}

	.tree-select {
		border: 0;
		background: transparent;
		padding: 0;
		display: grid;
		gap: 2px;
		text-align: left;
		cursor: pointer;
		color: inherit;
		min-width: 0;
	}

	.content {
		display: grid;
		gap: 18px;
		min-width: 0;
	}

	.overview,
	.panel,
	.empty {
		border-radius: 28px;
		padding: 22px;
	}

	.overview {
		display: grid;
		gap: 18px;
	}

	.overview-main {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
		gap: 18px;
		align-items: start;
	}

	.breadcrumb {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		color: #475569;
		font-size: 0.92rem;
	}

	.breadcrumb i {
		font-style: normal;
		color: #94a3b8;
	}

	.overview-copy h2 {
		font-size: clamp(2rem, 3vw, 3rem);
		line-height: 1.02;
		letter-spacing: -0.03em;
	}

	.overview-actions {
		display: flex;
		flex-wrap: wrap;
		align-content: start;
		gap: 10px;
	}

	.scope-chip {
		border: 1px solid rgba(226, 232, 240, 1);
		background: #f8fafc;
		padding: 12px 14px;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		cursor: pointer;
		min-width: 138px;
		color: #0f172a;
	}

	.scope-chip small {
		color: #64748b;
	}

	.overview-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
	}

	.source-strip {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-top: 2px;
		border-top: 1px solid rgba(226, 232, 240, 0.9);
	}

	.source-strip div {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.source-strip em,
	.tag-row em,
	.site-badge {
		font-style: normal;
		font-size: 0.76rem;
		border-radius: 999px;
		padding: 4px 8px;
	}

	.source-strip em {
		background: rgba(37, 99, 235, 0.08);
		color: #1d4ed8;
	}

	.panel-head {
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		padding-bottom: 14px;
		border-bottom: 1px solid rgba(226, 232, 240, 0.95);
	}

	.spotlight-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}

	.spotlight-card,
	.site-card {
		border: 1px solid rgba(226, 232, 240, 1);
		background: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.96));
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.spotlight-card:hover,
	.site-card:hover,
	.ghost-link:hover,
	.primary-link:hover,
	.scope-chip:hover,
	.sidebar-overview:hover {
		transform: translateY(-2px);
		border-color: rgba(37, 99, 235, 0.24);
		box-shadow: 0 18px 32px -28px rgba(37, 99, 235, 0.45);
	}

	.spotlight-card {
		border-radius: 22px;
		padding: 18px;
		display: grid;
		gap: 14px;
	}

	.spotlight-head {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		gap: 12px;
		align-items: center;
	}

	.spotlight-head div,
	.site-copy,
	.spotlight-card {
		min-width: 0;
	}

	.spotlight-head strong,
	.site-copy strong,
	.group-head h4 {
		font-size: 1rem;
	}

	.spotlight-head span {
		font-size: 0.8rem;
		color: #64748b;
	}

	.spotlight-card p,
	.site-copy p {
		margin: 0;
		color: #475569;
		line-height: 1.55;
	}

	.spotlight-card img,
	.site-card img {
		width: 48px;
		height: 48px;
		border-radius: 14px;
		object-fit: cover;
		background: #fff;
		border: 1px solid rgba(226, 232, 240, 1);
	}

	.spotlight-meta,
	.site-meta,
	.tag-row,
	.group-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 14px;
	}

	.group {
		gap: 14px;
		padding-top: 6px;
	}

	.group-head {
		align-items: end;
	}

	.group-head div {
		display: grid;
		gap: 4px;
	}

	.group-head span {
		font-size: 0.82rem;
		color: #475569;
	}

	.site-card {
		border-radius: 20px;
		padding: 16px;
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		gap: 14px;
		align-items: start;
	}

	.site-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.site-badge {
		background: rgba(37, 99, 235, 0.08);
		color: #1d4ed8;
	}

	.site-meta,
	.tag-row {
		justify-content: flex-start;
	}

	.tag-row em {
		background: #eff6ff;
		color: #1e40af;
	}

	.empty {
		text-align: center;
	}

	.empty h3 {
		margin: 0 0 8px;
	}

	@media (max-width: 1180px) {
		.topbar,
		.layout,
		.overview-main,
		.spotlight-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
			max-height: none;
		}

		.overview-stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 760px) {
		.topbar,
		.layout {
			padding: 14px;
		}

		.toolbar {
			grid-template-columns: 1fr;
		}

		.toolbar-actions {
			justify-content: flex-start;
		}

		.panel-head {
			grid-template-columns: 1fr;
		}

		.overview-stats,
		.sidebar-stats,
		.card-grid {
			grid-template-columns: 1fr;
		}

		.site-card {
			grid-template-columns: 42px minmax(0, 1fr);
		}
	}
</style>
