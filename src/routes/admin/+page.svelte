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

	const stats = $derived({
		total: sites.length,
		featured: sites.filter((site) => Boolean(site.featured)).length,
		hidden: sites.filter((site) => Boolean(site.hide)).length,
		categories: categories.length
	});

	const filteredSites = $derived(
		sites.filter((site) => {
			const keyword = query.trim().toLowerCase();
			const matchCategory = categoryFilter === '全部' || site.category === categoryFilter;
			if (!matchCategory) return false;
			if (!keyword) return true;
			return `${site.name} ${site.desc} ${site.url} ${site.category} ${site.tags.join(' ')}`
				.toLowerCase()
				.includes(keyword);
		})
	);

	const categoryCounts = $derived(
		new Map(categories.map((category) => [category, sites.filter((site) => site.category === category).length]))
	);

	const selectedSite = $derived(
		filteredSites.find((site) => site.id === selectedSiteId) ??
			sites.find((site) => site.id === selectedSiteId) ??
			filteredSites[0] ??
			null
	);

	const highlightedCategories = $derived(
		categories.map((name) => ({
			name,
			count: categoryCounts.get(name) ?? 0
		}))
	);

	function logoSrc(site: Site) {
		return site.logo?.startsWith('data:') || site.logo?.startsWith('http') ? site.logo : '';
	}

	function urlText(url: string) {
		return url.replace(/^https?:\/\//, '');
	}

	function stateText(site: Site) {
		if (site.hide) return 'Hidden';
		if (site.featured) return 'Featured';
		return 'Live';
	}

	function setFieldValue(fieldId: string, value: string) {
		if (typeof document === 'undefined') return;
		const field = document.getElementById(fieldId) as HTMLTextAreaElement | null;
		if (!field) return;
		field.value = value;
		field.dispatchEvent(new Event('input', { bubbles: true }));
		field.dispatchEvent(new Event('change', { bubbles: true }));
	}

	function readFileAsDataUrl(file: File) {
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result ?? ''));
			reader.onerror = () => reject(reader.error ?? new Error('读取图片失败'));
			reader.readAsDataURL(file);
		});
	}

	async function handleLogoFile(event: Event, fieldId: string) {
		const input = event.currentTarget as HTMLInputElement | null;
		const file = input?.files?.[0];
		if (!file) return;

		try {
			const dataUrl = await readFileAsDataUrl(file);
			setFieldValue(fieldId, dataUrl);
		} finally {
			if (input) input.value = '';
		}
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
	<header class="hero-bar">
		<div class="hero-copy">
			<a href="/" class="back-link">← 返回前台</a>
			<p>LT Navigation Console</p>
			<h1>内容运营后台</h1>
			<span>把新增、筛选、编辑拆成三条清晰路径，让分类和推荐维护更像在用编辑器，而不是在滚长表单。</span>
		</div>
		<div class="hero-side">
			<div class="hero-status-grid">
				<article>
					<small>推荐总数</small>
					<strong>{stats.total}</strong>
				</article>
				<article>
					<small>分类数量</small>
					<strong>{stats.categories}</strong>
				</article>
				<article>
					<small>精选推荐</small>
					<strong>{stats.featured}</strong>
				</article>
				<article>
					<small>隐藏内容</small>
					<strong>{stats.hidden}</strong>
				</article>
			</div>
			<div class="hero-actions">
				<div class="status-chip">{data.hasDb ? 'D1 Connected' : 'D1 Missing'}</div>
				{#if data.loggedIn}
					<form method="POST" action="?/logout">
						<button class="ghost-button">退出</button>
					</form>
				{/if}
			</div>
		</div>
	</header>

	{#if form?.error}
		<div class="notice error">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="notice success">{form.success}</div>
	{/if}

	{#if !data.loggedIn}
		<section class="login-shell">
			<div class="login-copy">
				<p>管理员入口</p>
				<h2>先登录，再进入内容控制台</h2>
				<span>
					{data.configured
						? '登录后可以直接创建分类、录入推荐，并在右侧编辑器里维护详情。'
						: '当前还没有配置 ADMIN_PASSWORD，本地环境请先写入 .dev.vars。'}
				</span>
			</div>
			<form method="POST" action="?/login" class="login-form">
				<label>
					管理密码
					<input name="password" type="password" placeholder="输入管理员密码" required />
				</label>
				<button>登录后台</button>
			</form>
		</section>
	{:else if !data.hasDb}
		<section class="login-shell">
			<div class="login-copy">
				<p>数据库状态</p>
				<h2>D1 还没有绑定</h2>
				<span>当前环境没有 DB binding。绑定 D1 后，这个后台才会直接管理线上推荐内容。</span>
			</div>
		</section>
	{:else}
		<section class="workspace">
			<aside class="left-rail">
				<section class="rail-block composer">
					<div class="block-head">
						<p>新增</p>
						<h2>录入台</h2>
					</div>
					<div class="segment">
						<button
							type="button"
							class:active={createMode === 'site'}
							onclick={() => (createMode = 'site')}
						>
							推荐
						</button>
						<button
							type="button"
							class:active={createMode === 'category'}
							onclick={() => (createMode = 'category')}
						>
							分类
						</button>
					</div>

					{#if createMode === 'site'}
						<form method="POST" action="?/create" class="stack-form">
							<label>
								名称
								<input name="name" required placeholder="例如 Perplexity / Claude / Cursor" />
							</label>
							<label>
								链接
								<input name="url" placeholder="https://..." />
							</label>
							<div class="dual-field">
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
								说明
								<textarea name="desc" rows="3" placeholder="一句话说明用途、价格或注意事项"></textarea>
							</label>
							<label>
								标签
								<input name="tags" placeholder="AI, 搜索, 工作流" />
							</label>
							<label>
								Logo URL
								<textarea id="create-logo-field" name="logo" rows="3" placeholder="可贴图片 URL，或下方直接上传本地图片"></textarea>
							</label>
							<label class="file-field">
								本地图片
								<input type="file" accept="image/*" onchange={(event) => handleLogoFile(event, 'create-logo-field')} />
								<small>上传后会自动转成 base64 写入上方 Logo 字段，无需手动转换。</small>
							</label>
							<div class="checks">
								<label><input name="featured" type="checkbox" /> 设为精选</label>
								<label><input name="hidden" type="checkbox" /> 暂时隐藏</label>
							</div>
							<button class="primary">保存推荐</button>
						</form>
					{:else}
						<form method="POST" action="?/createCategory" class="stack-form">
							<label>
								分类名称
								<input name="name" required placeholder="例如 AI模型 / 生产力工具" />
							</label>
							<label>
								分类说明
								<textarea name="description" rows="4" placeholder="说明这个分类放哪类资源"></textarea>
							</label>
							<label>
								排序
								<input name="sort" type="number" value="100" />
							</label>
							<button class="primary">保存分类</button>
						</form>
					{/if}
				</section>

				<section class="rail-block category-library">
					<div class="block-head">
						<p>分类</p>
						<h2>快速切换</h2>
					</div>
					<div class="category-stack">
						<button
							type="button"
							class="category-card"
							class:active={categoryFilter === '全部'}
							onclick={() => (categoryFilter = '全部')}
						>
							<span>全部内容</span>
							<strong>{stats.total}</strong>
						</button>
						{#each highlightedCategories as item}
							<button
								type="button"
								class="category-card"
								class:active={categoryFilter === item.name}
								onclick={() => (categoryFilter = item.name)}
							>
								<span>{item.name}</span>
								<strong>{item.count}</strong>
							</button>
						{/each}
					</div>
				</section>
			</aside>

			<section class="center-pane">
				<section class="pane-strip">
					<div class="block-head">
						<p>浏览</p>
						<h2>推荐列表</h2>
					</div>
					<label class="search-box">
						<span>搜索</span>
						<input bind:value={query} type="search" placeholder="输入名称、链接、标签、分类" />
					</label>
				</section>

				<section class="result-stage">
					<div class="result-head">
						<div>
							<small>当前筛选</small>
							<h3>{categoryFilter}</h3>
						</div>
						<div class="result-count">
							<strong>{filteredSites.length}</strong>
							<span>条结果</span>
						</div>
					</div>

					<div class="site-list">
						{#if filteredSites.length === 0}
							<div class="empty-state">
								<h3>没有匹配结果</h3>
								<p>可以切换分类，或清空搜索后查看全部推荐。</p>
							</div>
						{:else}
							{#each filteredSites as site}
								<button
									type="button"
									class="site-row"
									class:selected={selectedSiteId === site.id}
									onclick={() => (selectedSiteId = site.id)}
								>
									<div class="site-index">{String(site.id).padStart(2, '0')}</div>
									<div class="logo-badge">
										{#if logoSrc(site)}
											<img src={logoSrc(site)} alt="" />
										{:else}
											<span>{site.name.slice(0, 1)}</span>
										{/if}
									</div>
									<div class="site-copy">
										<div class="site-row-head">
											<strong>{site.name}</strong>
											<span class="state-pill" data-state={stateText(site)}>{stateText(site)}</span>
										</div>
										<p>{site.desc || '暂无说明，建议补一句摘要。'}</p>
										<div class="site-meta">
											<span>{site.category}</span>
											{#if site.url}<code>{urlText(site.url)}</code>{/if}
										</div>
									</div>
								</button>
							{/each}
						{/if}
					</div>
				</section>
			</section>

			<aside class="right-pane">
				<section class="rail-block inspector">
					<div class="block-head">
						<p>编辑</p>
						<h2>{selectedSite ? selectedSite.name : '卡片详情'}</h2>
					</div>

					{#if selectedSite}
						<form method="POST" action="?/update" class="stack-form">
							<input type="hidden" name="id" value={selectedSite.id} />

							<div class="preview-card">
								<div class="preview-top">
									<div class="logo-badge large">
										{#if logoSrc(selectedSite)}
											<img src={logoSrc(selectedSite)} alt="" />
										{:else}
											<span>{selectedSite.name.slice(0, 1)}</span>
										{/if}
									</div>
									<div class="preview-copy">
										<small>ID {selectedSite.id}</small>
										<strong>{selectedSite.name}</strong>
										<p>{selectedSite.desc || '建议在这里补一句前台展示文案。'}</p>
									</div>
								</div>
								<div class="site-meta">
									<span>{selectedSite.category}</span>
									{#if selectedSite.url}<code>{urlText(selectedSite.url)}</code>{/if}
								</div>
							</div>

							<div class="dual-field">
								<label>
									名称
									<input name="name" value={selectedSite.name} required />
								</label>
								<label>
									排序
									<input name="sort" type="number" value={selectedSite.sort} />
								</label>
							</div>
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
								说明
								<textarea name="desc" rows="4">{selectedSite.desc}</textarea>
							</label>
							<label>
								标签
								<input name="tags" value={selectedSite.tags.join(', ')} />
							</label>
							<label>
								Logo URL
								<textarea id="edit-logo-field" name="logo" rows="4">{selectedSite.logo}</textarea>
							</label>
							<label class="file-field">
								本地图片
								<input type="file" accept="image/*" onchange={(event) => handleLogoFile(event, 'edit-logo-field')} />
								<small>上传后会自动覆盖上方 Logo 字段内容，并用于保存当前卡片。</small>
							</label>

							<div class="checks">
								<label><input name="featured" type="checkbox" checked={Boolean(selectedSite.featured)} /> 首页精选</label>
								<label><input name="hidden" type="checkbox" checked={Boolean(selectedSite.hide)} /> 隐藏该卡片</label>
							</div>

							<div class="action-bar">
								<button class="primary">保存修改</button>
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
						<div class="empty-state tall">
							<h3>没有可编辑的推荐</h3>
							<p>先在左侧录入推荐，或从中间列表选择一条内容继续编辑。</p>
						</div>
					{/if}
				</section>
			</aside>
		</section>
	{/if}
</main>

<style>
	:global(:root) {
		--admin-bg: #edf1f6;
		--panel: rgba(255, 255, 255, 0.84);
		--panel-strong: #ffffff;
		--line: rgba(148, 163, 184, 0.16);
		--text: #0f172a;
		--muted: #64748b;
		--accent: #0f766e;
		--accent-soft: rgba(15, 118, 110, 0.12);
		--ink: #111827;
		--shadow: 0 22px 48px rgba(15, 23, 42, 0.07);
		--radius-xl: 28px;
		--radius-lg: 22px;
		--radius-md: 16px;
	}

	.admin-shell {
		min-height: 100vh;
		padding: 22px;
		background:
			radial-gradient(circle at top left, rgba(15, 118, 110, 0.08), transparent 24%),
			radial-gradient(circle at top right, rgba(15, 23, 42, 0.06), transparent 22%),
			var(--admin-bg);
		color: var(--text);
	}

	.hero-bar,
	.notice,
	.login-shell,
	.workspace {
		width: min(100%, 1520px);
		margin: 0 auto;
	}

	.hero-bar,
	.notice,
	.login-shell,
	.rail-block,
	.pane-strip,
	.result-stage,
	.site-row,
	.empty-state {
		border: 1px solid var(--line);
		box-shadow: var(--shadow);
		backdrop-filter: blur(16px);
	}

	.hero-bar {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(360px, 0.8fr);
		gap: 18px;
		padding: 22px;
		border-radius: 32px;
		background:
			linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.72)),
			var(--panel);
	}

	.hero-copy p,
	.login-copy p,
	.block-head p {
		margin: 0;
		color: var(--muted);
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.hero-copy h1,
	.login-copy h2,
	.block-head h2,
	.result-head h3,
	.empty-state h3 {
		margin: 8px 0 0;
	}

	.hero-copy h1 {
		font-size: clamp(38px, 4vw, 62px);
		line-height: 0.96;
		letter-spacing: -0.04em;
	}

	.hero-copy span,
	.login-copy span {
		display: block;
		max-width: 62ch;
		margin-top: 12px;
		color: var(--muted);
		font-size: 15px;
		line-height: 1.7;
	}

	.back-link,
	.ghost-button,
	.segment button,
	.category-card,
	.site-row,
	button {
		font: inherit;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		padding: 10px 14px;
		margin-bottom: 18px;
		border: 1px solid #d7e0ec;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.92);
		color: #334155;
		text-decoration: none;
	}

	.hero-side {
		display: grid;
		gap: 12px;
	}

	.hero-status-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	.hero-status-grid article {
		padding: 16px;
		border-radius: 22px;
		background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(255, 255, 255, 0.82));
	}

	.hero-status-grid small {
		display: block;
		color: var(--muted);
		font-size: 12px;
		font-weight: 700;
	}

	.hero-status-grid strong {
		display: block;
		margin-top: 12px;
		font-size: 30px;
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}

	.status-chip,
	.state-pill {
		display: inline-flex;
		align-items: center;
		padding: 6px 10px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 700;
	}

	.status-chip {
		background: #ecfeff;
		color: #155e75;
	}

	.ghost-button {
		border: 1px solid #dbe3ef;
		border-radius: 999px;
		background: var(--panel-strong);
		padding: 10px 14px;
		color: #334155;
	}

	.notice {
		margin-top: 16px;
		padding: 14px 16px;
		border-radius: 20px;
	}

	.notice.error {
		background: rgba(254, 242, 242, 0.96);
		color: #991b1b;
		border-color: #fecaca;
	}

	.notice.success {
		background: rgba(240, 253, 244, 0.96);
		color: #166534;
		border-color: #bbf7d0;
	}

	.login-shell {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 420px;
		gap: 18px;
		margin-top: 18px;
		padding: 18px;
		border-radius: var(--radius-xl);
		background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.74));
	}

	.login-form {
		display: grid;
		align-content: center;
		gap: 14px;
		padding: 24px;
		border-radius: var(--radius-lg);
		background: rgba(248, 250, 252, 0.88);
	}

	.workspace {
		display: grid;
		grid-template-columns: 320px minmax(0, 1fr) 420px;
		gap: 16px;
		margin-top: 18px;
		align-items: start;
	}

	.left-rail,
	.center-pane,
	.right-pane {
		display: grid;
		gap: 16px;
	}

	.left-rail,
	.right-pane {
		position: sticky;
		top: 18px;
	}

	.rail-block,
	.pane-strip,
	.result-stage {
		padding: 18px;
		border-radius: var(--radius-xl);
		background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.74));
	}

	.block-head,
	.pane-strip,
	.result-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}

	.segment {
		display: inline-flex;
		gap: 6px;
		margin-top: 16px;
		padding: 4px;
		border-radius: 999px;
		background: #e2e8f0;
	}

	.segment button {
		border: 0;
		background: transparent;
		color: #475569;
	}

	.segment button {
		padding: 9px 14px;
		border-radius: 999px;
	}

	.segment button.active,
	.category-card.active {
		background: var(--ink);
		color: #ffffff;
	}

	.stack-form {
		display: grid;
		gap: 12px;
		margin-top: 16px;
	}

	.dual-field {
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
		padding: 11px 13px;
		border: 1px solid #dbe3ef;
		border-radius: var(--radius-md);
		background: rgba(255, 255, 255, 0.92);
		color: var(--text);
		font: inherit;
		transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: rgba(15, 118, 110, 0.5);
		box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.1);
		transform: translateY(-1px);
	}

	textarea {
		resize: vertical;
	}

	.file-field input[type='file'] {
		padding: 10px 12px;
		background: rgba(248, 250, 252, 0.92);
	}

	.file-field small {
		display: block;
		margin-top: 8px;
		color: var(--muted);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.6;
	}

	button {
		border: 0;
		border-radius: var(--radius-md);
		padding: 11px 15px;
		font-weight: 700;
		transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
	}

	button:hover {
		transform: translateY(-1px);
	}

	.primary {
		background: var(--ink);
		color: #ffffff;
	}

	.danger {
		background: #fee2e2;
		color: #991b1b;
	}

	.checks,
	.action-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		align-items: center;
	}

	.checks label {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border-radius: 999px;
		background: #f8fafc;
	}

	.checks input {
		width: auto;
		margin: 0;
	}

	.category-stack {
		display: grid;
		gap: 8px;
		margin-top: 16px;
	}

	.category-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 13px 14px;
		border: 1px solid var(--line);
		border-radius: 18px;
		background: rgba(248, 250, 252, 0.84);
		text-align: left;
	}

	.category-card strong {
		font-size: 13px;
	}

	.search-box {
		min-width: 220px;
	}

	.search-box span,
	.result-head small,
	.preview-copy small {
		display: block;
		color: var(--muted);
		font-size: 12px;
		font-weight: 700;
	}

	.result-head h3 {
		font-size: 28px;
		letter-spacing: -0.03em;
	}

	.result-count {
		text-align: right;
	}

	.result-count strong {
		display: block;
		font-size: 28px;
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.result-count span {
		color: var(--muted);
		font-size: 13px;
	}

	.site-list {
		display: grid;
		gap: 10px;
		margin-top: 16px;
	}

	.site-row {
		display: grid;
		grid-template-columns: 34px 52px minmax(0, 1fr);
		gap: 12px;
		width: 100%;
		padding: 14px;
		border-radius: 22px;
		background: rgba(255, 255, 255, 0.78);
		color: inherit;
		text-align: left;
	}

	.site-row:hover {
		box-shadow: 0 24px 42px rgba(15, 23, 42, 0.08);
	}

	.site-row.selected {
		border-color: rgba(15, 118, 110, 0.25);
		box-shadow: 0 24px 46px rgba(15, 118, 110, 0.14);
		background: rgba(255, 255, 255, 0.96);
	}

	.site-index {
		display: grid;
		align-content: start;
		padding-top: 4px;
		color: rgba(100, 116, 139, 0.82);
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.06em;
	}

	.logo-badge {
		display: grid;
		width: 52px;
		height: 52px;
		place-items: center;
		overflow: hidden;
		border-radius: 18px;
		background: linear-gradient(145deg, #e0f2fe, #eef2ff);
		color: #0f172a;
		font-weight: 800;
	}

	.logo-badge.large {
		width: 68px;
		height: 68px;
		border-radius: 22px;
	}

	.logo-badge img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.site-copy,
	.preview-copy {
		min-width: 0;
	}

	.site-row-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
	}

	.site-row-head strong,
	.preview-copy strong {
		font-size: 16px;
	}

	.site-copy p,
	.preview-copy p,
	.empty-state p {
		margin: 6px 0 0;
		color: var(--muted);
		font-size: 13px;
		line-height: 1.55;
	}

	.state-pill {
		background: #f8fafc;
		color: #475569;
	}

	.state-pill[data-state='Featured'] {
		background: rgba(245, 158, 11, 0.14);
		color: #b45309;
	}

	.state-pill[data-state='Hidden'] {
		background: rgba(148, 163, 184, 0.16);
		color: #475569;
	}

	.site-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 10px;
		color: var(--muted);
	}

	.site-meta span,
	.site-meta code {
		display: inline-flex;
		align-items: center;
		padding: 5px 9px;
		border-radius: 999px;
		font-size: 12px;
		background: #eef2ff;
	}

	.site-meta code {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.preview-card {
		padding: 16px;
		border-radius: 22px;
		background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.88));
	}

	.preview-top {
		display: grid;
		grid-template-columns: 68px minmax(0, 1fr);
		gap: 14px;
	}

	.action-bar {
		position: sticky;
		bottom: 0;
		padding-top: 16px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96) 28%);
	}

	.empty-state {
		padding: 28px;
		border-radius: 24px;
		background: rgba(255, 255, 255, 0.88);
	}

	.empty-state.tall {
		min-height: 280px;
	}

	@media (max-width: 1360px) {
		.workspace {
			grid-template-columns: 300px minmax(0, 1fr);
		}

		.right-pane {
			grid-column: 1 / -1;
			position: static;
		}
	}

	@media (max-width: 960px) {
		.admin-shell {
			padding: 14px;
		}

		.hero-bar,
		.login-shell,
		.workspace,
		.dual-field {
			grid-template-columns: 1fr;
		}

		.left-rail,
		.right-pane {
			position: static;
		}

		.hero-actions {
			justify-content: flex-start;
		}

		.search-box {
			min-width: 0;
		}

		.site-row,
		.preview-top {
			grid-template-columns: 1fr;
		}

		.action-bar {
			position: static;
			background: transparent;
		}
	}
</style>
