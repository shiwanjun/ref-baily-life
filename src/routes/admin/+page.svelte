<script lang="ts">
	import type { Site } from '$lib/ref-data';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const sites = $derived(data.sites as Site[]);
	const categories = $derived(data.categories as string[]);

	let query = $state('');
	let categoryFilter = $state('全部');
	let createMode = $state<'site' | 'category'>('site');
	let selectedSiteId = $state<number | null>(null);

	const categoryCounts = $derived(
		new Map(categories.map((category) => [category, sites.filter((site) => site.category === category).length]))
	);

	const filteredSites = $derived(
		sites.filter((site) => {
			const keyword = query.trim().toLowerCase();
			const inCategory = categoryFilter === '全部' || site.category === categoryFilter;
			if (!keyword) return inCategory;
			return (
				inCategory &&
				`${site.name} ${site.desc} ${site.url} ${site.category} ${site.tags.join(' ')}`
					.toLowerCase()
					.includes(keyword)
			);
		})
	);

	const selectedSite = $derived(
		filteredSites.find((site) => site.id === selectedSiteId) ??
			sites.find((site) => site.id === selectedSiteId) ??
			filteredSites[0] ??
			null
	);

	const summary = $derived({
		total: sites.length,
		featured: sites.filter((site) => Boolean(site.featured)).length,
		hidden: sites.filter((site) => Boolean(site.hide)).length,
		categories: categories.length
	});

	function logoSrc(site: Site) {
		return site.logo?.startsWith('data:') || site.logo?.startsWith('http') ? site.logo : '';
	}

	function urlText(url: string) {
		return url.replace(/^https?:\/\//, '');
	}

	function siteState(site: Site) {
		if (site.hide) return '已隐藏';
		if (site.featured) return '精选';
		return '公开';
	}

	$effect(() => {
		if (!filteredSites.length) {
			selectedSiteId = null;
			return;
		}

		if (!filteredSites.some((site) => site.id === selectedSiteId)) {
			selectedSiteId = filteredSites[0].id;
		}
	});
</script>

<svelte:head>
	<title>推荐管理 — liantang.fun</title>
</svelte:head>

<main class="admin-shell">
	<header class="admin-header">
		<div class="header-main">
			<a href="/" class="back-link">← 返回前台</a>
			<div>
				<p>liantang.fun</p>
				<h1>推荐管理台</h1>
				<span>新增分类、快速录入推荐，并在右侧集中编辑卡片内容。</span>
			</div>
		</div>
		{#if data.loggedIn}
			<form method="POST" action="?/logout">
				<button class="ghost-button">退出</button>
			</form>
		{/if}
	</header>

	{#if form?.error}
		<div class="notice error">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="notice success">{form.success}</div>
	{/if}

	{#if !data.loggedIn}
		<section class="login-panel">
			<h2>管理员登录</h2>
			<p>
				{data.configured
					? '输入管理密码后可以新增分类、录入推荐，并统一编辑卡片内容。'
					: '还没有配置 ADMIN_PASSWORD，后台暂时不能登录。'}
			</p>
			<form method="POST" action="?/login">
				<input name="password" type="password" placeholder="管理密码" required />
				<button>登录</button>
			</form>
		</section>
	{:else if !data.hasDb}
		<section class="login-panel">
			<h2>D1 还没有绑定</h2>
			<p>当前环境没有 DB binding。绑定 D1 后，这个后台就可以管理线上推荐内容。</p>
		</section>
	{:else}
		<section class="stats-grid" aria-label="管理概览">
			<article>
				<small>推荐总数</small>
				<strong>{summary.total}</strong>
			</article>
			<article>
				<small>精选推荐</small>
				<strong>{summary.featured}</strong>
			</article>
			<article>
				<small>隐藏推荐</small>
				<strong>{summary.hidden}</strong>
			</article>
			<article>
				<small>分类数量</small>
				<strong>{summary.categories}</strong>
			</article>
		</section>

		<section class="workspace">
			<aside class="composer-panel">
				<div class="panel-head">
					<div>
						<p>快捷新增</p>
						<h2>先加分类，再录推荐</h2>
					</div>
					<div class="mode-switch" role="tablist" aria-label="新增模式">
						<button
							type="button"
							class:active={createMode === 'site'}
							onclick={() => (createMode = 'site')}
						>
							新增推荐
						</button>
						<button
							type="button"
							class:active={createMode === 'category'}
							onclick={() => (createMode = 'category')}
						>
							新增分类
						</button>
					</div>
				</div>

				{#if createMode === 'site'}
					<form method="POST" action="?/create" class="stack-form">
						<label>
							名称
							<input name="name" required placeholder="例如 GPT 导航站" />
						</label>
						<label>
							链接
							<input name="url" placeholder="https://..." />
						</label>
						<div class="two-cols">
							<label>
								分类
								<select name="category">
									{#each categories as category}
										<option value={category}>{category}</option>
									{/each}
								</select>
							</label>
							<label>
								排序
								<input name="sort" type="number" value="100" />
							</label>
						</div>
						<label>
							提醒备注
							<input name="desc" placeholder="一句介绍、奖励或注意事项" />
						</label>
						<label>
							标签
							<input name="tags" placeholder="AI, 工具, 提效" />
						</label>
						<label>
							Logo URL 或 data:image
							<textarea name="logo" rows="3" placeholder="可留空，后面再补"></textarea>
						</label>
						<div class="checks">
							<label><input name="featured" type="checkbox" /> 精选推荐</label>
							<label><input name="hidden" type="checkbox" /> 先隐藏</label>
						</div>
						<button class="primary">保存并新增推荐</button>
					</form>
				{:else}
					<form method="POST" action="?/createCategory" class="stack-form">
						<label>
							分类名称
							<input name="name" required placeholder="例如 AI模型" />
						</label>
						<label>
							分类说明
							<input name="description" placeholder="一句话描述这个分类放什么内容" />
						</label>
						<label>
							排序
							<input name="sort" type="number" value="100" />
						</label>
						<button class="primary">保存分类</button>
					</form>
				{/if}

				<div class="helper-card">
					<p>操作建议</p>
					<ul>
						<li>先创建分类，再把推荐挂到对应分类。</li>
						<li>常用推荐打上“精选”，首页更容易露出。</li>
						<li>暂时不想展示的内容，可以先勾选“先隐藏”。</li>
					</ul>
				</div>
			</aside>

			<section class="list-panel">
				<div class="panel-head">
					<div>
						<p>内容列表</p>
						<h2>先筛选，再点右侧编辑</h2>
					</div>
					<label class="search-box">
						<span>搜索</span>
						<input bind:value={query} type="search" placeholder="搜索名称、链接、分类、标签" />
					</label>
				</div>

				<div class="category-filter" aria-label="分类筛选">
					<button
						type="button"
						class:active={categoryFilter === '全部'}
						onclick={() => (categoryFilter = '全部')}
					>
						全部 <span>{summary.total}</span>
					</button>
					{#each categories as category}
						<button
							type="button"
							class:active={categoryFilter === category}
							onclick={() => (categoryFilter = category)}
						>
							{category} <span>{categoryCounts.get(category) ?? 0}</span>
						</button>
					{/each}
				</div>

				<div class="list-summary">
					<span>{filteredSites.length} 条结果</span>
					{#if categoryFilter !== '全部'}
						<strong>{categoryFilter}</strong>
					{/if}
				</div>

				<div class="site-list">
					{#if filteredSites.length === 0}
						<div class="empty-state">
							<h3>没有匹配结果</h3>
							<p>可以先切换分类，或者清空搜索后再试。</p>
						</div>
					{:else}
						{#each filteredSites as site}
							<button
								type="button"
								class="site-row"
								class:selected={selectedSiteId === site.id}
								onclick={() => (selectedSiteId = site.id)}
							>
								<div class="logo-preview">
									{#if logoSrc(site)}
										<img src={logoSrc(site)} alt="" />
									{:else}
										<span>{site.name.slice(0, 1)}</span>
									{/if}
								</div>
								<div class="site-row-main">
									<div class="site-row-head">
										<strong>{site.name}</strong>
										<span class="status-pill" data-state={siteState(site)}>{siteState(site)}</span>
									</div>
									<p>{site.desc || '暂无备注，建议补一句使用说明。'}</p>
									<div class="site-row-meta">
										<span>{site.category}</span>
										{#if site.url}<code>{urlText(site.url)}</code>{/if}
									</div>
								</div>
							</button>
						{/each}
					{/if}
				</div>
			</section>

			<section class="editor-panel">
				<div class="panel-head">
					<div>
						<p>卡片编辑</p>
						<h2>{selectedSite ? selectedSite.name : '请选择一条推荐'}</h2>
					</div>
					{#if selectedSite}
						<span class="editor-meta">ID {selectedSite.id}</span>
					{/if}
				</div>

				{#if selectedSite}
					<form method="POST" action="?/update" class="editor-form">
						<input type="hidden" name="id" value={selectedSite.id} />

						<div class="editor-preview">
							<div class="logo-preview large">
								{#if logoSrc(selectedSite)}
									<img src={logoSrc(selectedSite)} alt="" />
								{:else}
									<span>{selectedSite.name.slice(0, 1)}</span>
								{/if}
							</div>
							<div>
								<strong>{selectedSite.name}</strong>
								<p>{selectedSite.desc || '建议补一句简介，让前台卡片更完整。'}</p>
								<div class="site-row-meta">
									<span>{selectedSite.category}</span>
									{#if selectedSite.url}<code>{urlText(selectedSite.url)}</code>{/if}
								</div>
							</div>
						</div>

						<div class="editor-grid">
							<label>
								名称
								<input name="name" value={selectedSite.name} required />
							</label>
							<label>
								链接
								<input name="url" value={selectedSite.url} />
							</label>
							<label>
								分类
								<select name="category" value={selectedSite.category}>
									{#each categories as category}
										<option value={category}>{category}</option>
									{/each}
								</select>
							</label>
							<label>
								排序
								<input name="sort" type="number" value={selectedSite.sort} />
							</label>
							<label class="wide">
								提醒备注
								<textarea name="desc" rows="3">{selectedSite.desc}</textarea>
							</label>
							<label class="wide">
								标签
								<input name="tags" value={selectedSite.tags.join(', ')} />
							</label>
							<label class="wide">
								Logo URL 或 data:image
								<textarea name="logo" rows="4">{selectedSite.logo}</textarea>
							</label>
						</div>

						<div class="checks split">
							<label><input name="featured" type="checkbox" checked={Boolean(selectedSite.featured)} /> 精选推荐</label>
							<label><input name="hidden" type="checkbox" checked={Boolean(selectedSite.hide)} /> 隐藏该卡片</label>
						</div>

						<div class="actions">
							<button class="primary">保存当前卡片</button>
							<button
								class="danger"
								formaction="?/remove"
								onclick={(event) => {
									if (!confirm(`确定删除「${selectedSite.name}」吗？`)) event.preventDefault();
								}}
							>
								删除卡片
							</button>
						</div>
					</form>
				{:else}
					<div class="empty-state editor-empty">
						<h3>还没有可编辑的推荐</h3>
						<p>先在左侧新增推荐，或者切换筛选条件查看已有内容。</p>
					</div>
				{/if}
			</section>
		</section>
	{/if}
</main>

<style>
	.admin-shell {
		min-height: 100vh;
		padding: 24px;
		background:
			radial-gradient(circle at top left, rgba(59, 130, 246, 0.08), transparent 28%),
			#f3f6fb;
		color: #0f172a;
	}

	.admin-header,
	.notice,
	.login-panel,
	.stats-grid,
	.workspace {
		max-width: 1440px;
		margin-right: auto;
		margin-left: auto;
	}

	.admin-header,
	.notice,
	.login-panel,
	.stats-grid article,
	.composer-panel,
	.list-panel,
	.editor-panel,
	.site-row,
	.helper-card,
	.empty-state {
		border: 1px solid rgba(148, 163, 184, 0.2);
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.88);
		box-shadow: 0 18px 50px rgba(15, 23, 42, 0.06);
		backdrop-filter: blur(14px);
	}

	.admin-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding: 20px;
	}

	.header-main {
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}

	.back-link,
	.ghost-button,
	.mode-switch button,
	.category-filter button,
	.site-row,
	button {
		font: inherit;
	}

	.back-link,
	.ghost-button {
		display: inline-flex;
		align-items: center;
		border: 1px solid #dbe3ef;
		border-radius: 12px;
		background: #ffffff;
		padding: 10px 14px;
		color: #475569;
		text-decoration: none;
	}

	.admin-header p,
	.panel-head p,
	.helper-card p {
		margin: 0;
		color: #64748b;
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.admin-header h1,
	.panel-head h2,
	.empty-state h3,
	.login-panel h2 {
		margin: 6px 0 0;
	}

	.admin-header span {
		display: block;
		margin-top: 8px;
		color: #64748b;
		font-size: 14px;
		line-height: 1.6;
	}

	.notice {
		margin-top: 16px;
		padding: 14px 16px;
	}

	.notice.error {
		border-color: #fecaca;
		background: #fef2f2;
		color: #991b1b;
	}

	.notice.success {
		border-color: #bbf7d0;
		background: #f0fdf4;
		color: #166534;
	}

	.login-panel {
		max-width: 520px;
		margin-top: 18px;
		padding: 24px;
	}

	.login-panel p {
		color: #64748b;
		line-height: 1.7;
	}

	.login-panel form {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 10px;
		margin-top: 18px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
		margin-top: 18px;
	}

	.stats-grid article {
		padding: 18px;
	}

	.stats-grid small {
		display: block;
		color: #64748b;
		font-size: 12px;
		font-weight: 700;
	}

	.stats-grid strong {
		display: block;
		margin-top: 10px;
		font-size: 30px;
		line-height: 1;
	}

	.workspace {
		display: grid;
		grid-template-columns: 340px minmax(320px, 0.95fr) minmax(360px, 1.05fr);
		gap: 18px;
		margin-top: 18px;
		align-items: start;
	}

	.composer-panel,
	.list-panel,
	.editor-panel {
		padding: 18px;
	}

	.composer-panel {
		position: sticky;
		top: 18px;
	}

	.panel-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 14px;
	}

	.mode-switch {
		display: inline-flex;
		gap: 6px;
		padding: 4px;
		border-radius: 12px;
		background: #eff6ff;
	}

	.mode-switch button,
	.category-filter button {
		border: 0;
		border-radius: 10px;
		padding: 9px 12px;
		color: #475569;
		background: transparent;
	}

	.mode-switch button.active,
	.category-filter button.active {
		background: #111827;
		color: #ffffff;
	}

	.stack-form,
	.editor-form {
		display: grid;
		gap: 12px;
		margin-top: 16px;
	}

	.two-cols,
	.editor-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	label {
		color: #334155;
		font-size: 13px;
		font-weight: 700;
	}

	input,
	select,
	textarea {
		width: 100%;
		margin-top: 6px;
		border: 1px solid #dbe3ef;
		border-radius: 12px;
		background: #ffffff;
		padding: 11px 12px;
		color: #0f172a;
		font: inherit;
	}

	textarea {
		resize: vertical;
	}

	button {
		border: 0;
		border-radius: 12px;
		padding: 11px 14px;
		font-weight: 700;
	}

	.primary,
	.login-panel button {
		background: #111827;
		color: #ffffff;
	}

	.danger {
		background: #fee2e2;
		color: #991b1b;
	}

	.checks,
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
	}

	.checks label {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		padding: 10px 12px;
		border-radius: 12px;
		background: #f8fafc;
	}

	.checks input {
		width: auto;
		margin: 0;
	}

	.split {
		justify-content: space-between;
	}

	.helper-card {
		margin-top: 14px;
		padding: 16px;
	}

	.helper-card ul {
		margin: 12px 0 0;
		padding-left: 18px;
		color: #64748b;
		line-height: 1.7;
	}

	.search-box {
		min-width: 220px;
	}

	.search-box span {
		display: block;
		color: #64748b;
		font-size: 12px;
		font-weight: 700;
	}

	.category-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 16px;
	}

	.category-filter button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #f8fafc;
	}

	.category-filter button span {
		font-size: 12px;
		opacity: 0.75;
	}

	.list-summary,
	.editor-meta,
	.site-row-meta,
	.site-row p,
	.empty-state p {
		color: #64748b;
	}

	.list-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-top: 16px;
		font-size: 13px;
		font-weight: 700;
	}

	.site-list {
		display: grid;
		gap: 12px;
		margin-top: 14px;
	}

	.site-row {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		gap: 12px;
		width: 100%;
		padding: 14px;
		text-align: left;
		color: inherit;
	}

	.site-row.selected {
		border-color: rgba(37, 99, 235, 0.32);
		box-shadow: 0 22px 44px rgba(37, 99, 235, 0.12);
	}

	.site-row-main {
		min-width: 0;
	}

	.site-row-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
	}

	.site-row strong,
	.editor-preview strong {
		font-size: 16px;
	}

	.site-row p,
	.editor-preview p {
		margin: 6px 0 0;
		font-size: 13px;
		line-height: 1.55;
	}

	.site-row-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 10px;
		font-size: 12px;
	}

	.site-row-meta span,
	.site-row-meta code,
	.status-pill {
		display: inline-flex;
		align-items: center;
		border-radius: 999px;
		padding: 5px 9px;
		background: #eef2ff;
	}

	.site-row-meta code {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.status-pill {
		background: #f8fafc;
		color: #475569;
		font-size: 12px;
		font-weight: 700;
	}

	.status-pill[data-state='精选'] {
		background: rgba(245, 158, 11, 0.14);
		color: #b45309;
	}

	.status-pill[data-state='已隐藏'] {
		background: rgba(148, 163, 184, 0.18);
		color: #475569;
	}

	.logo-preview {
		display: grid;
		width: 48px;
		height: 48px;
		place-items: center;
		overflow: hidden;
		border-radius: 14px;
		background: #eef2ff;
		color: #3730a3;
		font-weight: 800;
	}

	.logo-preview.large {
		width: 64px;
		height: 64px;
		border-radius: 18px;
	}

	.logo-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.editor-preview {
		display: grid;
		grid-template-columns: 64px minmax(0, 1fr);
		gap: 14px;
		padding: 16px;
		border-radius: 16px;
		background: #f8fafc;
	}

	.editor-grid {
		margin-top: 16px;
	}

	.wide {
		grid-column: 1 / -1;
	}

	.empty-state {
		padding: 22px;
	}

	.editor-empty {
		margin-top: 16px;
	}

	@media (max-width: 1260px) {
		.workspace {
			grid-template-columns: 320px minmax(320px, 1fr);
		}

		.editor-panel {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 920px) {
		.admin-shell {
			padding: 14px;
		}

		.admin-header,
		.panel-head,
		.stats-grid,
		.workspace,
		.login-panel form,
		.two-cols,
		.editor-grid {
			grid-template-columns: 1fr;
		}

		.admin-header,
		.header-main {
			flex-direction: column;
		}

		.stats-grid,
		.workspace {
			display: grid;
		}

		.composer-panel {
			position: static;
		}

		.search-box {
			min-width: 0;
		}

		.split,
		.actions {
			flex-direction: column;
			align-items: stretch;
		}

		.editor-preview,
		.site-row {
			grid-template-columns: 1fr;
		}
	}
</style>
