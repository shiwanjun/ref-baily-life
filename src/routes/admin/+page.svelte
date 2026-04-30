<script lang="ts">
	import { slugify, type CategoryNode, type NavigationSite } from '$lib/navigation';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const categoryRows = $derived(data.categoryRows);
	const categoryTree = $derived(data.categoryTree as CategoryNode[]);
	const leafCategories = $derived(categoryRows.filter((item) => item.level === 3));
	const categoryNameById = $derived(new Map(categoryRows.map((item) => [item.id, item.name])));
	const allSites = $derived(data.sites as NavigationSite[]);

	let query = $state('');
	let selectedSiteId = $state<number | null>(null);
	let selectedCategoryId = $state<number>(0);
	let bookmarkHtml = $state('');
	let sourceList = $state('');
	let createLogoBase64 = $state('');
	let editLogoBase64 = $state('');

	$effect(() => {
		if (!selectedCategoryId) {
			selectedCategoryId = leafCategories[0]?.id ?? 0;
		}
		if (!sourceList && !data.seedSourceCount) {
			sourceList = 'https://www.uxmap.cn/\nhttps://www.uisdc.com/nav\nhttps://deepdh.ai\nhttps://www.ainavpro.com/\nhttps://www.aigc.cn/tools';
		}
	});

	const selectedSite = $derived(
		selectedSiteId == null ? null : allSites.find((site) => site.id === selectedSiteId) ?? null
	);

	const filteredSites = $derived(
		allSites.filter((site) => {
			const text = `${site.name} ${site.desc} ${site.url} ${site.category_path.join(' ')} ${site.tags.join(' ')}`.toLowerCase();
			const matchesQuery = !query.trim() || text.includes(query.trim().toLowerCase());
			const matchesCategory = !selectedCategoryId || site.category_id === selectedCategoryId;
			return matchesQuery && matchesCategory;
		})
	);

	function defaultCategoryId() {
		return selectedSite?.category_id ?? selectedCategoryId ?? leafCategories[0]?.id ?? 0;
	}

	function handleCreateUpload(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => (createLogoBase64 = String(reader.result ?? ''));
		reader.readAsDataURL(file);
	}

	function handleEditUpload(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => (editLogoBase64 = String(reader.result ?? ''));
		reader.readAsDataURL(file);
	}

	function fillEditor(site: NavigationSite) {
		selectedSiteId = site.id;
		selectedCategoryId = site.category_id;
		editLogoBase64 = site.logo;
	}
</script>

<svelte:head>
	<title>LT导航后台</title>
</svelte:head>

{#snippet categoryItem(node: CategoryNode)}
	<div class="tree-item">
		<button class="tree-button" type="button" onclick={() => selectedCategoryId = node.level === 3 ? node.id : selectedCategoryId}>
			<div>
				<strong>{node.name}</strong>
				<span>L{node.level}</span>
			</div>
			<small>{node.description}</small>
		</button>

		{#if node.children.length}
			<div class="tree-children">
				{#each node.children as child}
					{@render categoryItem(child)}
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<main class="admin-shell">
	<header class="admin-topbar">
		<div class="headline">
			<p class="eyebrow">LT导航后台</p>
			<h1>三级分类与站点管理台</h1>
			<p class="headline-copy">保留现有三栏结构，把分类梳理、站点录入和导入任务放进更清晰的运营工作台里。</p>
		</div>
		<div class="topbar-actions">
			<a class="ghost" href="/">查看前台</a>
			{#if data.loggedIn}
				<form method="POST" action="?/logout">
					<button class="primary" type="submit">退出</button>
				</form>
			{/if}
		</div>
	</header>

	{#if form?.error}
		<div class="notice error">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="notice success">{form.success}</div>
	{/if}

	{#if !data.loggedIn}
		<section class="login-card">
			<h2>管理员登录</h2>
			<p>{data.configured ? '输入后台密码后继续管理分类、站点和导入任务。' : '当前环境还没有配置 ADMIN_PASSWORD。'}</p>
			<form class="login-form" method="POST" action="?/login">
				<input name="password" type="password" placeholder="后台密码" required />
				<button class="primary" type="submit">登录</button>
			</form>
		</section>
	{:else if !data.hasDb}
		<section class="login-card">
			<h2>D1 尚未绑定</h2>
			<p>当前环境没有数据库 binding，后台无法保存数据。</p>
		</section>
	{:else}
		<section class="status-strip">
			<div><strong>{categoryRows.filter((item) => item.level === 1).length}</strong><span>大类</span></div>
			<div><strong>{categoryRows.filter((item) => item.level === 2).length}</strong><span>中类</span></div>
			<div><strong>{leafCategories.length}</strong><span>小类</span></div>
			<div><strong>{data.sites.length}</strong><span>站点</span></div>
		</section>

		<div class="workspace">
			<aside class="column left">
				<section class="panel">
					<div class="panel-head">
						<h2>分类树</h2>
						<p>左侧负责新增与梳理三级分类。</p>
					</div>
					<div class="category-tree">
						{#each categoryTree as node}
							{@render categoryItem(node)}
						{/each}
					</div>
				</section>

				<section class="panel">
					<div class="panel-head">
						<h2>新增分类</h2>
						<p>按级别创建，大类不选父级，中类挂大类，小类挂中类。</p>
					</div>
					<form class="stack-form" method="POST" action="?/createCategoryNode">
						<label>
							<span>分类名称</span>
							<input name="name" placeholder="例如：AI设计" required />
						</label>
						<label>
							<span>Slug</span>
							<input name="slug" placeholder="可留空自动生成" />
						</label>
						<label>
							<span>级别</span>
							<select name="level">
								<option value="1">一级大类</option>
								<option value="2">二级中类</option>
								<option value="3" selected>三级小类</option>
							</select>
						</label>
						<label>
							<span>父分类</span>
							<select name="parent_id">
								<option value="">无</option>
								{#each categoryRows as category}
									<option value={category.id}>{category.name} · L{category.level}</option>
								{/each}
							</select>
						</label>
						<label>
							<span>描述</span>
							<textarea name="description" rows="3" placeholder="简要说明用途"></textarea>
						</label>
						<label>
							<span>排序</span>
							<input name="sort" type="number" value="100" />
						</label>
						<button class="primary" type="submit">创建分类</button>
					</form>
				</section>
			</aside>

			<section class="column middle">
				<section class="panel">
					<div class="panel-head">
						<h2>站点列表</h2>
						<p>中间负责检索、筛选和浏览已有内容。</p>
					</div>
					<div class="filters">
						<input bind:value={query} type="search" placeholder="搜索名称、描述、标签、分类" />
						<select bind:value={selectedCategoryId}>
							<option value={0}>全部三级分类</option>
							{#each leafCategories as category}
							<option value={category.id}>{category.name}</option>
							{/each}
						</select>
						<button class="ghost" type="button" onclick={() => selectedSiteId = null}>新建站点</button>
					</div>
					<div class="site-list">
						{#each filteredSites as site}
							<button class:selected={selectedSiteId === site.id} class="site-row" type="button" onclick={() => fillEditor(site)}>
								<img alt={site.name} src={site.logo} />
								<div>
									<div class="site-row-title">
										<strong>{site.name}</strong>
										{#if site.featured}
											<span class="flag">精选</span>
										{/if}
									</div>
									<p>{site.desc}</p>
									<small>{site.category_path.join(' / ')}</small>
								</div>
							</button>
						{/each}
						{#if !filteredSites.length}
							<div class="empty">当前筛选条件下没有站点。</div>
						{/if}
					</div>
				</section>

				<section class="panel">
					<div class="panel-head">
						<h2>导入区</h2>
						<p>支持内置种子、书签 HTML 和导航源抓取三种方式。</p>
					</div>
					<div class="import-grid">
						<form class="stack-form compact" method="POST" action="?/previewSeedImport">
							<h3>内置种子</h3>
							<p>当前内置 {data.seedSummary.totalSites} 条站点，来源 {data.seedSourceCount} 个种子源。</p>
							<div class="button-row">
								<button class="ghost" type="submit">预览统计</button>
								<button class="primary" type="submit" formaction="?/replaceSeedImport">覆盖导入</button>
							</div>
						</form>

						<form class="stack-form compact" method="POST" action="?/previewBookmarkImport">
							<h3>书签 HTML</h3>
							<textarea bind:value={bookmarkHtml} name="bookmark_html" rows="7" placeholder="粘贴浏览器导出的 Netscape 书签 HTML"></textarea>
							<div class="button-row">
								<button class="ghost" type="submit">预览导入</button>
								<button class="primary" type="submit" formaction="?/replaceBookmarkImport">覆盖导入</button>
							</div>
						</form>

						<form class="stack-form compact" method="POST" action="?/crawlNavigationSources">
							<h3>导航源抓取</h3>
							<textarea bind:value={sourceList} name="source_list" rows="7" placeholder="每行一个导航源 URL"></textarea>
							<div class="button-row">
								<button class="ghost" type="submit">抓取预览</button>
								<button class="primary" type="submit" name="mode" value="replace">抓取并覆盖</button>
							</div>
						</form>
					</div>

					{#if form?.importPreview}
						<div class="preview-box">
							<div><strong>{form.importPreview.totalInput}</strong><span>输入条数</span></div>
							<div><strong>{form.importPreview.totalSites}</strong><span>有效站点</span></div>
							<div><strong>{form.importPreview.navigationSources}</strong><span>导航源</span></div>
							<div><strong>{form.importPreview.deduped}</strong><span>去重</span></div>
							<div><strong>{form.importPreview.skipped}</strong><span>剔除</span></div>
							<div><strong>{form.importPreview.failed}</strong><span>失败</span></div>
						</div>
					{/if}
				</section>
			</section>

			<aside class="column right">
				<section class="panel">
					<div class="panel-head">
						<h2>{selectedSite ? '编辑站点' : '新增站点'}</h2>
						<p>右侧负责当前卡片的详细编辑，减少来回滚动。</p>
					</div>

					<form class="stack-form" method="POST" action={selectedSite ? '?/updateSite' : '?/createSite'}>
						{#if selectedSite}
							<input name="id" type="hidden" value={selectedSite?.id} />
						{/if}
						<label>
							<span>名称</span>
							<input name="name" value={selectedSite?.name ?? ''} required />
						</label>
						<label>
							<span>链接</span>
							<input name="url" type="url" value={selectedSite?.url ?? ''} required />
						</label>
						<label>
							<span>三级分类</span>
							<select name="category_id" value={String(defaultCategoryId())}>
								{#each leafCategories as category}
									<option value={category.id}>{category.name}</option>
								{/each}
							</select>
						</label>
						<input name="categoryName" type="hidden" value={categoryNameById.get(defaultCategoryId()) ?? ''} />
						<label>
							<span>Logo 地址 / Base64</span>
							<input name="logo" value={selectedSite ? editLogoBase64 || selectedSite.logo : createLogoBase64} />
						</label>
						<label>
							<span>上传本地图片（自动转 Base64）</span>
							<input type="file" accept="image/*" onchange={selectedSite ? handleEditUpload : handleCreateUpload} />
						</label>
						<label>
							<span>简介</span>
							<textarea name="desc" rows="4">{selectedSite?.desc ?? ''}</textarea>
						</label>
						<label>
							<span>标签</span>
							<input name="tags" value={selectedSite?.tags.join(', ') ?? ''} placeholder="AI, 设计, 导航源" />
						</label>
						<label>
							<span>来源站点</span>
							<input name="source_site" value={selectedSite?.source_site ?? ''} placeholder="例如：Uxmap" />
						</label>
						<label>
							<span>来源路径</span>
							<input name="source_category_path" value={selectedSite?.source_category_path ?? ''} placeholder="来源分类路径" />
						</label>
						<label>
							<span>归一化域名</span>
							<input name="normalized_domain" value={selectedSite?.normalized_domain ?? ''} placeholder="example.com" />
						</label>
						<div class="inline-fields">
							<label>
								<span>排序</span>
								<input name="sort" type="number" value={selectedSite?.sort ?? 100} />
							</label>
							<label class="check">
								<input name="featured" type="checkbox" checked={Boolean(selectedSite?.featured)} />
								<span>精选</span>
							</label>
							<label class="check">
								<input name="hidden" type="checkbox" checked={Boolean(selectedSite?.hide)} />
								<span>隐藏</span>
							</label>
						</div>
						<label>
							<span>副标题 / 目录名</span>
							<input name="catelog" value={selectedSite?.catelog ?? categoryNameById.get(defaultCategoryId()) ?? ''} />
						</label>
						<div class="button-row">
							<button class="primary" type="submit">{selectedSite ? '保存修改' : '新增站点'}</button>
							{#if selectedSite}
								<button class="ghost" type="button" onclick={() => { selectedSiteId = null; editLogoBase64 = ''; }}>切换为新建</button>
							{/if}
						</div>
					</form>

					{#if selectedSite}
						<form method="POST" action="?/removeSite">
							<input name="id" type="hidden" value={selectedSite?.id} />
							<button class="danger" type="submit">删除当前站点</button>
						</form>
					{/if}
				</section>
			</aside>
		</div>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		background:
			radial-gradient(circle at top left, rgba(96, 181, 163, 0.14), transparent 22%),
			radial-gradient(circle at top right, rgba(255, 197, 102, 0.14), transparent 28%),
			#f5f3ee;
		color: #1d2939;
		font-family:
			'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
	}

	:global(button),
	:global(input),
	:global(select),
	:global(textarea) {
		font: inherit;
	}

	.admin-shell {
		padding: 20px;
		display: grid;
		gap: 18px;
		max-width: 1600px;
		margin: 0 auto;
	}

	.admin-topbar,
	.status-strip,
	.workspace,
	.login-card,
	.notice {
		border-radius: 28px;
		border: 1px solid rgba(216, 207, 188, 0.82);
		background: rgba(255, 251, 245, 0.93);
		box-shadow: 0 24px 60px -46px rgba(63, 50, 27, 0.34);
	}

	.admin-topbar {
		padding: 26px 28px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.headline {
		display: grid;
		gap: 8px;
	}

	.headline-copy {
		max-width: 760px;
		color: #667085;
	}

	.eyebrow {
		margin: 0 0 6px;
		font-size: 0.75rem;
		color: #91723b;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	.topbar-actions,
	.button-row,
	.inline-fields {
		display: flex;
		gap: 10px;
	}

	.primary,
	.ghost,
	.danger {
		border: 0;
		border-radius: 999px;
		padding: 11px 16px;
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.primary {
		background: linear-gradient(135deg, #e9a43c, #cf7e1c);
		color: #fff;
		box-shadow: 0 18px 32px -22px rgba(207, 126, 28, 0.62);
	}

	.ghost {
		background: rgba(255, 255, 255, 0.9);
		color: #334155;
		border: 1px solid rgba(214, 204, 184, 0.92);
	}

	.danger {
		width: 100%;
		background: #fff3f1;
		color: #a03131;
		margin-top: 12px;
	}

	.notice {
		padding: 14px 16px;
	}

	.notice.success {
		border-color: #cfe4d6;
		background: #f6fbf7;
	}

	.notice.error {
		border-color: #f1cfd3;
		background: #fff6f7;
	}

	.login-card {
		padding: 32px;
		max-width: 520px;
	}

	.login-form {
		display: flex;
		gap: 12px;
		margin-top: 16px;
	}

	.login-form input {
		flex: 1;
	}

	.status-strip {
		padding: 18px 20px;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
	}

	.status-strip div {
		padding: 16px;
		border-radius: 20px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(249, 246, 239, 0.94));
		border: 1px solid rgba(223, 214, 196, 0.88);
		display: grid;
		gap: 4px;
	}

	.status-strip strong {
		font-size: 1.5rem;
		color: #1f4d66;
	}

	.status-strip span,
	.panel-head p,
	.tree-button small,
	.site-row small,
	.preview-box span {
		color: #66758d;
	}

	.workspace {
		display: grid;
		grid-template-columns: 280px minmax(0, 1fr) 360px;
		gap: 0;
		overflow: hidden;
	}

	.column {
		padding: 18px;
		display: grid;
		gap: 18px;
		min-height: 0;
		background: rgba(255, 251, 245, 0.5);
	}

	.left,
	.middle {
		border-right: 1px solid #e8edf4;
	}

	.panel {
		border: 1px solid rgba(220, 211, 193, 0.86);
		border-radius: 24px;
		padding: 18px;
		display: grid;
		gap: 14px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(251, 247, 240, 0.96));
		box-shadow: 0 16px 40px -34px rgba(60, 48, 27, 0.34);
		min-height: 0;
	}

	.panel-head {
		display: grid;
		gap: 6px;
		padding-bottom: 12px;
		border-bottom: 1px dashed rgba(213, 202, 181, 0.9);
	}

	.category-tree,
	.site-list {
		display: grid;
		gap: 10px;
		overflow: auto;
	}

	.category-tree {
		max-height: 360px;
		padding-right: 4px;
	}

	.tree-item {
		display: grid;
		gap: 8px;
	}

	.tree-button {
		border: 1px solid rgba(223, 214, 194, 0.88);
		border-radius: 18px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(250, 247, 241, 0.98));
		padding: 12px;
		text-align: left;
		cursor: pointer;
		display: grid;
		gap: 6px;
	}

	.tree-button div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.tree-button span {
		font-size: 0.78rem;
		color: #8b94a3;
	}

	.tree-children {
		padding-left: 14px;
		display: grid;
		gap: 8px;
	}

	.stack-form {
		display: grid;
		gap: 12px;
	}

	.stack-form.compact {
		align-content: start;
	}

	label {
		display: grid;
		gap: 6px;
	}

	label span {
		font-size: 0.84rem;
		color: #47566e;
	}

	input,
	select,
	textarea {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid rgba(214, 204, 184, 0.94);
		border-radius: 16px;
		padding: 12px 13px;
		background: rgba(255, 255, 255, 0.94);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.check {
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1px solid rgba(214, 204, 184, 0.94);
		border-radius: 16px;
		padding: 11px 12px;
		background: rgba(255, 255, 255, 0.92);
	}

	.check input {
		width: auto;
		margin: 0;
	}

	.filters {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 180px auto;
		gap: 10px;
	}

	.site-list {
		max-height: 620px;
		padding-right: 4px;
	}

	.site-row {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr);
		gap: 12px;
		padding: 13px;
		border: 1px solid rgba(221, 213, 195, 0.9);
		border-radius: 18px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 246, 240, 0.96));
		text-align: left;
		cursor: pointer;
	}

	.site-row.selected {
		border-color: rgba(231, 169, 74, 0.92);
		box-shadow:
			0 0 0 1px rgba(231, 169, 74, 0.14),
			0 18px 30px -26px rgba(231, 169, 74, 0.6);
	}

	.site-row img {
		width: 42px;
		height: 42px;
		border-radius: 14px;
		border: 1px solid rgba(223, 214, 194, 0.9);
		background: #f8fafc;
		object-fit: cover;
	}

	.site-row-title {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.flag {
		font-size: 0.72rem;
		padding: 3px 8px;
		border-radius: 999px;
		background: #fff2d7;
		color: #8d6114;
	}

	.site-row div,
	.preview-box {
		display: grid;
		gap: 6px;
	}

	.site-row p,
	.empty {
		color: #5f6d84;
		font-size: 0.9rem;
	}

	.import-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.preview-box {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}

	.preview-box div {
		padding: 12px;
		border-radius: 18px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(247, 244, 237, 0.96));
		border: 1px solid rgba(223, 214, 195, 0.86);
	}

	.preview-box strong {
		font-size: 1.15rem;
		color: #1f4d66;
	}

	.empty {
		padding: 16px 4px;
		text-align: center;
	}

	@media (max-width: 1320px) {
		.workspace {
			grid-template-columns: 1fr;
		}

		.left,
		.middle {
			border-right: 0;
			border-bottom: 1px solid #e8edf4;
		}

		.import-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 860px) {
		.admin-shell {
			padding: 14px;
		}

		.admin-topbar,
		.status-strip {
			grid-template-columns: 1fr;
		}

		.admin-topbar,
		.login-form,
		.filters,
		.inline-fields,
		.button-row,
		.topbar-actions {
			flex-direction: column;
		}

		.status-strip,
		.preview-box {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
