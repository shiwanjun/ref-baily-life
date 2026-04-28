<script lang="ts">
	import type { Site } from '$lib/ref-data';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let query = $state('');

	const filteredSites = $derived(
		(data.sites as Site[]).filter((site) => {
			const keyword = query.trim().toLowerCase();
			if (!keyword) return true;
			return `${site.name} ${site.desc} ${site.url} ${site.category} ${site.tags.join(' ')}`
				.toLowerCase()
				.includes(keyword);
		})
	);
</script>

<svelte:head>
	<title>推荐管理 — ref.baily.life</title>
</svelte:head>

<main class="admin-shell">
	<header class="admin-header">
		<a href="/" class="back-link">← 返回前台</a>
		<div>
			<p>ref.baily.life</p>
			<h1>推荐管理</h1>
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
				{data.configured ? '输入管理密码后可以新增、编辑、隐藏和删除推荐链接。' : '还没有配置 ADMIN_PASSWORD，后台暂时不能登录。'}
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
		<section class="create-panel">
			<div>
				<p>新增推荐</p>
				<h2>添加一个入口</h2>
			</div>
			<form method="POST" action="?/create" class="editor-grid">
				<label>
					名称
					<input name="name" required placeholder="例如 Rakuten 乐天返利网" />
				</label>
				<label>
					链接
					<input name="url" placeholder="https://..." />
				</label>
				<label>
					分类
					<select name="category">
						{#each data.categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</label>
				<label>
					排序
					<input name="sort" type="number" value="100" />
				</label>
				<label class="wide">
					提醒备注
					<input name="desc" placeholder="奖励、注意事项或一句介绍" />
				</label>
				<label class="wide">
					标签
					<input name="tags" placeholder="美国, 开户奖励, 注意条件" />
				</label>
				<label class="wide">
					Logo URL 或 data:image
					<textarea name="logo" rows="2"></textarea>
				</label>
				<div class="checks">
					<label><input name="featured" type="checkbox" /> 精选</label>
					<label><input name="hidden" type="checkbox" /> 隐藏</label>
				</div>
				<button class="primary wide">新增推荐</button>
			</form>
		</section>

		<section class="toolbar">
			<div>
				<p>当前共有 {data.sites.length} 条</p>
				<h2>编辑推荐</h2>
			</div>
			<input bind:value={query} type="search" placeholder="搜索名称、分类、标签或链接" />
		</section>

		<section class="site-editor-list">
			{#each filteredSites as site}
				<article class:hidden-card={site.hide}>
					<form method="POST" action="?/update" class="editor-grid">
						<input type="hidden" name="id" value={site.id} />
						<div class="site-summary wide">
							<div class="logo-preview">
								{#if site.logo?.startsWith('data:') || site.logo?.startsWith('http')}
									<img src={site.logo} alt="" />
								{:else}
									<span>{site.name.slice(0, 1)}</span>
								{/if}
							</div>
							<div>
								<strong>{site.name}</strong>
								<small>ID {site.id} · {site.category}{site.hide ? ' · 已隐藏' : ''}{site.featured ? ' · 精选' : ''}</small>
							</div>
						</div>
						<label>
							名称
							<input name="name" value={site.name} required />
						</label>
						<label>
							链接
							<input name="url" value={site.url} />
						</label>
						<label>
							分类
							<select name="category" value={site.category}>
								{#each data.categories as category}
									<option value={category}>{category}</option>
								{/each}
							</select>
						</label>
						<label>
							排序
							<input name="sort" type="number" value={site.sort} />
						</label>
						<label class="wide">
							提醒备注
							<input name="desc" value={site.desc} />
						</label>
						<label class="wide">
							标签
							<input name="tags" value={site.tags.join(', ')} />
						</label>
						<details class="wide">
							<summary>Logo 数据</summary>
							<textarea name="logo" rows="4">{site.logo}</textarea>
						</details>
						<div class="checks">
							<label><input name="featured" type="checkbox" checked={Boolean(site.featured)} /> 精选</label>
							<label><input name="hidden" type="checkbox" checked={Boolean(site.hide)} /> 隐藏</label>
						</div>
						<div class="actions">
							<button class="primary">保存</button>
							<button
								class="danger"
								formaction="?/remove"
								onclick={(event) => {
									if (!confirm(`确定删除「${site.name}」吗？`)) event.preventDefault();
								}}
							>
								删除
							</button>
						</div>
					</form>
				</article>
			{/each}
		</section>
	{/if}
</main>

<style>
	.admin-shell {
		min-height: 100vh;
		padding: 22px;
		background: #f6f7fb;
		color: #111827;
	}

	.admin-header,
	.login-panel,
	.create-panel,
	.toolbar,
	.site-editor-list {
		max-width: 1120px;
		margin-right: auto;
		margin-left: auto;
	}

	.admin-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 18px;
	}

	.back-link,
	.ghost-button {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: #ffffff;
		padding: 10px 12px;
		color: #475569;
	}

	.ghost-button {
		font: inherit;
	}

	.admin-header p,
	.create-panel p,
	.toolbar p {
		margin: 0;
		color: #64748b;
		font-size: 13px;
		font-weight: 700;
	}

	h1,
	h2 {
		margin: 4px 0 0;
	}

	.notice,
	.login-panel,
	.create-panel,
	.toolbar,
	.site-editor-list article {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: #ffffff;
	}

	.notice {
		max-width: 1120px;
		margin: 16px auto 0;
		padding: 12px 14px;
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

	.login-panel,
	.create-panel,
	.toolbar {
		margin-top: 18px;
		padding: 18px;
	}

	.login-panel {
		max-width: 520px;
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

	input,
	select,
	textarea {
		width: 100%;
		border: 1px solid #dbe3ef;
		border-radius: 8px;
		background: #ffffff;
		padding: 10px 11px;
		color: #111827;
		font: inherit;
	}

	textarea {
		resize: vertical;
	}

	button {
		border: 0;
		border-radius: 8px;
		padding: 10px 14px;
		font: inherit;
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

	.editor-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		margin-top: 14px;
	}

	label {
		color: #475569;
		font-size: 13px;
		font-weight: 700;
	}

	label input,
	label select,
	label textarea,
	details textarea {
		margin-top: 6px;
	}

	.wide {
		grid-column: 1 / -1;
	}

	.checks,
	.actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.checks label {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.checks input {
		width: auto;
		margin: 0;
	}

	.toolbar {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 16px;
	}

	.toolbar input {
		max-width: 360px;
	}

	.site-editor-list {
		display: grid;
		gap: 14px;
		margin-top: 14px;
	}

	.site-editor-list article {
		padding: 16px;
	}

	.hidden-card {
		opacity: 0.62;
	}

	.site-summary {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.site-summary strong,
	.site-summary small {
		display: block;
	}

	.site-summary small {
		margin-top: 3px;
		color: #64748b;
	}

	.logo-preview {
		display: grid;
		width: 46px;
		height: 46px;
		place-items: center;
		overflow: hidden;
		border-radius: 8px;
		background: #eef2ff;
		color: #3730a3;
		font-weight: 800;
	}

	.logo-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	details {
		border-radius: 8px;
		background: #f8fafc;
		padding: 10px;
	}

	summary {
		cursor: pointer;
		color: #475569;
		font-size: 13px;
		font-weight: 700;
	}

	@media (max-width: 760px) {
		.admin-shell {
			padding: 12px;
		}

		.admin-header,
		.toolbar {
			align-items: stretch;
			flex-direction: column;
		}

		.editor-grid,
		.login-panel form {
			grid-template-columns: 1fr;
		}

		.toolbar input {
			max-width: none;
		}
	}
</style>
