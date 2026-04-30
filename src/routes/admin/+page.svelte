<script lang="ts">
	import type { Site } from '$lib/ref-data';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let query = $state('');
	let activeTab = $state<'list' | 'create'>('list');
	let editingId = $state<number | null>(null);
	let sortBy = $state<'name' | 'category' | 'sort' | 'updated'>('sort');
	let filterCategory = $state<string>('all');
	let showCreateCategory = $state(false);
	let newLogoBase64 = $state('');
	let editLogoBase64 = $state<Record<number, string>>({});

	const filteredSites = $derived(() => {
		let sites = data.sites as Site[];
		
		if (filterCategory !== 'all') {
			sites = sites.filter(s => s.category === filterCategory);
		}
		
		const keyword = query.trim().toLowerCase();
		if (keyword) {
			sites = sites.filter((site) =>
				`${site.name} ${site.desc} ${site.url} ${site.category} ${site.tags.join(' ')}`
					.toLowerCase()
					.includes(keyword)
			);
		}
		
		return sites.toSorted((a, b) => {
			if (sortBy === 'name') return a.name.localeCompare(b.name, 'zh-Hans-CN');
			if (sortBy === 'category') return a.category.localeCompare(b.category, 'zh-Hans-CN');
			if (sortBy === 'sort') return a.sort - b.sort || a.id - b.id;
			return a.id - b.id;
		});
	});

	const stats = $derived(() => {
		const sites = data.sites as Site[];
		return {
			total: sites.length,
			visible: sites.filter(s => !s.hide).length,
			hidden: sites.filter(s => s.hide).length,
			featured: sites.filter(s => s.featured).length
		};
	});

	function startEdit(id: number) {
		editingId = id;
		activeTab = 'list';
	}

	function cancelEdit() {
		editingId = null;
	}

	async function handleImageUpload(event: Event, target: 'new' | number) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			if (target === 'new') {
				newLogoBase64 = result;
			} else {
				editLogoBase64[target] = result;
			}
		};
		reader.readAsDataURL(file);
	}
</script>

<svelte:head>
	<title>推荐管理 — liantang.fun</title>
</svelte:head>

<main class="admin-shell">
	<header class="admin-header">
		<div class="header-brand">
			<a href="/" class="back-link">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
				返回前台
			</a>
			<div class="brand-info">
				<span class="brand-label">liantang.fun</span>
				<h1>推荐管理</h1>
			</div>
		</div>
		{#if data.loggedIn}
			<div class="header-actions">
				<span class="status-badge">已登录</span>
				<form method="POST" action="?/logout">
					<button class="ghost-button" type="submit">退出</button>
				</form>
			</div>
		{/if}
	</header>

	{#if form?.error}
		<div class="notice error">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
			</svg>
			{form.error}
		</div>
	{/if}
	{#if form?.success}
		<div class="notice success">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
			</svg>
			{form.success}
		</div>
	{/if}

	{#if !data.loggedIn}
		<section class="login-panel">
			<div class="login-content">
				<div class="login-icon">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
					</svg>
				</div>
				<h2>管理员登录</h2>
				<p>
					{data.configured 
						? '输入管理密码后可以新增、编辑、隐藏和删除推荐链接。' 
						: '还没有配置 ADMIN_PASSWORD，后台暂时不能登录。'}
				</p>
				<form method="POST" action="?/login" class="login-form">
					<div class="input-group">
						<input name="password" type="password" placeholder="输入管理密码" required />
						<button type="submit">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M5 12h14M12 5l7 7-7 7"/>
							</svg>
							登录
						</button>
					</div>
				</form>
			</div>
		</section>
	{:else if !data.hasDb}
		<section class="login-panel">
			<div class="login-content">
				<div class="login-icon warning">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
						<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
					</svg>
				</div>
				<h2>D1 还没有绑定</h2>
				<p>当前环境没有 DB binding。绑定 D1 后，这个后台就可以管理线上推荐内容。</p>
			</div>
		</section>
	{:else}
		<section class="stats-grid">
			<div class="stat-card">
				<div class="stat-value">{stats().total}</div>
				<div class="stat-label">总推荐数</div>
			</div>
			<div class="stat-card">
				<div class="stat-value success">{stats().visible}</div>
				<div class="stat-label">已显示</div>
			</div>
			<div class="stat-card">
				<div class="stat-value muted">{stats().hidden}</div>
				<div class="stat-label">已隐藏</div>
			</div>
			<div class="stat-card">
				<div class="stat-value featured">{stats().featured}</div>
				<div class="stat-label">精选推荐</div>
			</div>
		</section>

		<section class="action-bar">
			<div class="tabs">
				<button 
					class="tab" 
					class:active={activeTab === 'list'}
					onclick={() => activeTab = 'list'}
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
						<line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
					</svg>
					推荐列表
				</button>
				<button 
					class="tab primary" 
					class:active={activeTab === 'create'}
					onclick={() => { activeTab = 'create'; editingId = null; }}
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
					</svg>
					新增推荐
				</button>
			</div>
		</section>

		{#if activeTab === 'create'}
			<section class="create-panel">
				<form method="POST" action="?/create" class="editor-form">
					<div class="form-header">
						<h2>添加新推荐</h2>
						<p>填写推荐信息，创建新的推荐链接</p>
					</div>
					
					<div class="form-grid">
						<div class="form-group wide">
							<label for="new-name">名称 <span class="required">*</span></label>
							<input id="new-name" name="name" required placeholder="例如：Rakuten 乐天返利网" />
						</div>
						
						<div class="form-group wide">
							<label for="new-url">链接地址</label>
							<input id="new-url" name="url" placeholder="https://..." />
						</div>
						
						<div class="form-group">
							<div class="label-row">
								<label for="new-category">分类</label>
								<button type="button" class="add-cat-btn" onclick={() => showCreateCategory = !showCreateCategory}>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
									</svg>
									新增
								</button>
							</div>
							<select id="new-category" name="category">
								{#each data.categories as category}
									<option value={category}>{category}</option>
								{/each}
							</select>
							
							{#if showCreateCategory}
							<div class="create-category-panel">
								<div class="category-form">
									<div class="cat-form-group">
										<label for="new-cat-name">分类名称</label>
										<input id="new-cat-name" name="categoryName" required placeholder="输入分类名称" />
									</div>
									<div class="cat-form-group">
										<label for="new-cat-desc">描述（可选）</label>
										<input id="new-cat-desc" name="categoryDesc" placeholder="分类描述" />
									</div>
									<div class="cat-form-group">
										<label for="new-cat-sort">排序</label>
										<input id="new-cat-sort" name="categorySort" type="number" value="100" />
									</div>
									<div class="cat-actions">
										<button type="button" class="btn-secondary" onclick={() => showCreateCategory = false}>取消</button>
										<button type="submit" class="btn-primary" formaction="?/createCategory" formmethod="POST">创建分类</button>
									</div>
								</div>
							</div>
							{/if}
						</div>
						
						<div class="form-group">
							<label for="new-sort">排序权重</label>
							<input id="new-sort" name="sort" type="number" value="100" />
							<span class="hint">数字越小越靠前</span>
						</div>
						
						<div class="form-group wide">
							<label for="new-desc">提醒备注</label>
							<input id="new-desc" name="desc" placeholder="奖励、注意事项或一句介绍" />
						</div>
						
						<div class="form-group wide">
							<label for="new-tags">标签</label>
							<input id="new-tags" name="tags" placeholder="美国, 开户奖励, 注意条件" />
							<span class="hint">用逗号分隔，最多 8 个</span>
						</div>
						
						<div class="form-group wide">
							<label for="new-logo">Logo</label>
							<div class="logo-upload-section">
								<div class="logo-upload-area">
									<input type="file" accept="image/*" onchange={(e) => handleImageUpload(e, 'new')} id="new-logo-file" />
									<label for="new-logo-file" class="upload-label">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-5h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
										</svg>
										<span>点击或拖拽上传图片</span>
									</label>
								</div>
								{#if newLogoBase64}
									<div class="logo-preview-box">
										<img src={newLogoBase64} alt="Logo 预览" class="preview-img" />
										<button type="button" class="clear-preview" aria-label="清除新推荐 Logo 预览" onclick={() => newLogoBase64 = ''}>
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
											</svg>
										</button>
									</div>
									<textarea id="new-logo" name="logo" rows="2" bind:value={newLogoBase64} placeholder="或粘贴 Logo URL 或 data:image base64"></textarea>
								{:else}
									<textarea id="new-logo" name="logo" rows="2" placeholder="或粘贴 Logo URL 或 data:image base64"></textarea>
								{/if}
							</div>
						</div>
						
						<div class="form-group wide">
							<div class="checkbox-group">
								<label class="checkbox-label">
									<input name="featured" type="checkbox" />
									<span class="checkbox-custom"></span>
									标记为精选
								</label>
								<label class="checkbox-label">
									<input name="hidden" type="checkbox" />
									<span class="checkbox-custom"></span>
									隐藏此推荐
								</label>
							</div>
						</div>
					</div>
					
					<div class="form-actions">
						<button type="button" class="btn-secondary" onclick={() => activeTab = 'list'}>取消</button>
						<button type="submit" class="btn-primary">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
							</svg>
							创建推荐
						</button>
					</div>
				</form>
			</section>
		{:else}
			<section class="filter-bar">
				<div class="search-box">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
					</svg>
					<input bind:value={query} type="search" placeholder="搜索名称、分类、标签..." />
					{#if query}
						<button class="clear-btn" aria-label="清除搜索" onclick={() => query = ''}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
							</svg>
						</button>
					{/if}
				</div>
				
				<div class="filter-controls">
					<div class="select-wrapper">
						<select bind:value={filterCategory}>
							<option value="all">全部分类</option>
							{#each data.categories as category}
								<option value={category}>{category}</option>
							{/each}
						</select>
					</div>
					
					<div class="select-wrapper">
						<select bind:value={sortBy}>
							<option value="sort">按排序</option>
							<option value="name">按名称</option>
							<option value="category">按分类</option>
						</select>
					</div>
				</div>
			</section>

			<section class="site-list">
				{#if filteredSites().length === 0}
					<div class="empty-state">
						<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
							<circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/>
						</svg>
						<p>没有找到匹配的推荐</p>
						<button class="btn-secondary" onclick={() => { query = ''; filterCategory = 'all'; }}>清除筛选</button>
					</div>
				{:else}
					{#each filteredSites() as site, index (site.id)}
						<article class="site-card" class:hidden={site.hide} class:featured={site.featured} class:editing={editingId === site.id} style="animation-delay: {Math.min(index * 40, 400)}ms">
							{#if editingId === site.id}
								<form method="POST" action="?/update" class="edit-form">
									<input type="hidden" name="id" value={site.id} />
									
									<div class="edit-header">
										<div class="site-preview">
											<div class="logo-preview">
												{#if site.logo?.startsWith('data:') || site.logo?.startsWith('http')}
													<img src={site.logo} alt="" />
												{:else}
													<span>{site.name.slice(0, 1)}</span>
												{/if}
											</div>
											<div class="site-info">
												<span class="site-id">ID: {site.id}</span>
												<span class="site-status">
													{#if site.hide}
														<span class="status-tag hidden">已隐藏</span>
													{/if}
													{#if site.featured}
														<span class="status-tag featured">精选</span>
													{/if}
												</span>
											</div>
										</div>
										<button type="button" class="btn-icon" aria-label="取消编辑" onclick={cancelEdit}>
											<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
											</svg>
										</button>
									</div>
									
									<div class="form-grid compact">
										<div class="form-group">
											<label for="edit-name-{site.id}">名称</label>
											<input id="edit-name-{site.id}" name="name" value={site.name} required />
										</div>
										
										<div class="form-group">
											<label for="edit-url-{site.id}">链接</label>
											<input id="edit-url-{site.id}" name="url" value={site.url} />
										</div>
										
										<div class="form-group">
											<label for="edit-category-{site.id}">分类</label>
											<select id="edit-category-{site.id}" name="category">
												{#each data.categories as category}
													<option value={category} selected={category === site.category}>{category}</option>
												{/each}
											</select>
										</div>
										
										<div class="form-group">
											<label for="edit-sort-{site.id}">排序</label>
											<input id="edit-sort-{site.id}" name="sort" type="number" value={site.sort} />
										</div>
										
										<div class="form-group wide">
											<label for="edit-desc-{site.id}">备注</label>
											<input id="edit-desc-{site.id}" name="desc" value={site.desc} />
										</div>
										
										<div class="form-group wide">
											<label for="edit-tags-{site.id}">标签</label>
											<input id="edit-tags-{site.id}" name="tags" value={site.tags.join(', ')} />
										</div>
										
										<div class="form-group wide">
											<label for="edit-logo-{site.id}">Logo</label>
											<div class="logo-upload-section">
												<div class="logo-upload-area">
													<input type="file" accept="image/*" onchange={(e) => handleImageUpload(e, site.id)} id="edit-logo-file-{site.id}" />
													<label for="edit-logo-file-{site.id}" class="upload-label">
														<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
															<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-5h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
														</svg>
														<span>点击上传新图片</span>
													</label>
												</div>
												{#if editLogoBase64[site.id]}
													<div class="logo-preview-box">
														<img src={editLogoBase64[site.id]} alt="Logo 预览" class="preview-img" />
														<button type="button" class="clear-preview" aria-label="清除 {site.name} Logo 预览" onclick={() => delete editLogoBase64[site.id]}>
															<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
																<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
															</svg>
														</button>
													</div>
													<textarea id="edit-logo-{site.id}" name="logo" rows="2" bind:value={editLogoBase64[site.id]} placeholder="Logo URL 或 data:image base64"></textarea>
												{:else}
													<textarea id="edit-logo-{site.id}" name="logo" rows="2">{site.logo}</textarea>
												{/if}
											</div>
										</div>
										
										<div class="form-group wide">
											<div class="checkbox-group">
												<label class="checkbox-label">
													<input name="featured" type="checkbox" checked={Boolean(site.featured)} />
													<span class="checkbox-custom"></span>
													精选
												</label>
												<label class="checkbox-label">
													<input name="hidden" type="checkbox" checked={Boolean(site.hide)} />
													<span class="checkbox-custom"></span>
													隐藏
												</label>
											</div>
										</div>
									</div>
									
									<div class="edit-actions">
										<button type="button" class="btn-secondary" onclick={cancelEdit}>取消</button>
										<button type="submit" class="btn-primary">
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
											</svg>
											保存修改
										</button>
										<button type="submit" formaction="?/remove" class="btn-danger" onclick={(event) => {
											if (!confirm(`确定删除「${site.name}」吗？此操作不可撤销。`)) event.preventDefault();
										}}>
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
											</svg>
											删除
										</button>
									</div>
								</form>
							{:else}
								<button type="button" class="site-card-content" onclick={() => startEdit(site.id)}>
									<div class="logo-preview">
										{#if site.logo?.startsWith('data:') || site.logo?.startsWith('http')}
											<img src={site.logo} alt="" />
										{:else}
											<span>{site.name.slice(0, 1)}</span>
										{/if}
									</div>
									
									<div class="site-card-info">
										<div class="site-card-header">
											<h3>{site.name}</h3>
											<div class="site-badges">
												{#if site.featured}
													<span class="badge featured">精选</span>
												{/if}
												{#if site.hide}
													<span class="badge hidden">隐藏</span>
												{/if}
											</div>
										</div>
										
										<p class="site-desc">{site.desc || '暂无备注'}</p>
										
										<div class="site-meta">
											<span class="meta-item">
												<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
													<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
												</svg>
												{site.category}
											</span>
											<span class="meta-item">
												<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
													<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
													<line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
												</svg>
												排序 {site.sort}
											</span>
											<span class="meta-item">
												<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
													<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
												</svg>
												ID {site.id}
											</span>
										</div>
										
										{#if site.tags.length > 0}
											<div class="site-tags">
												{#each site.tags.slice(0, 4) as tag}
													<span class="tag">{tag}</span>
												{/each}
												{#if site.tags.length > 4}
													<span class="tag more">+{site.tags.length - 4}</span>
												{/if}
											</div>
										{/if}
									</div>
									
									<div class="site-card-action">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
										</svg>
									</div>
								</button>
							{/if}
						</article>
					{/each}
				{/if}
			</section>
		{/if}
	{/if}
</main>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	.admin-shell {
		min-height: 100dvh;
		background: #f8fafc;
		color: #0f172a;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
	}

	.admin-header {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		border-bottom: 1px solid rgba(15, 23, 42, 0.06);
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(12px);
		padding: 12px 24px;
	}

	.header-brand {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 8px;
		background: transparent;
		padding: 8px 12px;
		color: #64748b;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.back-link:hover {
		background: rgba(15, 23, 42, 0.04);
		color: #0f172a;
	}

	.brand-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.brand-label {
		color: #94a3b8;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}

	h1 {
		margin: 0;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	h2 {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	h3 {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.status-badge {
		border-radius: 999px;
		background: #dcfce7;
		color: #166534;
		padding: 4px 12px;
		font-size: 12px;
		font-weight: 600;
	}

	.ghost-button {
		border: 1px solid rgba(15, 23, 42, 0.1);
		border-radius: 8px;
		background: transparent;
		padding: 8px 16px;
		color: #64748b;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.ghost-button:hover {
		background: rgba(15, 23, 42, 0.04);
		color: #0f172a;
	}

	.notice {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 16px 24px 0;
		border-radius: 10px;
		padding: 12px 16px;
		font-size: 14px;
		font-weight: 500;
		animation: slide-down 0.3s ease;
	}

	.notice.error {
		border: 1px solid #fecaca;
		background: #fef2f2;
		color: #991b1b;
	}

	.notice.success {
		border: 1px solid #bbf7d0;
		background: #f0fdf4;
		color: #166534;
	}

	@keyframes slide-down {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.login-panel {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100dvh - 120px);
		padding: 24px;
	}

	.login-content {
		width: 100%;
		max-width: 420px;
		border: 1px solid rgba(15, 23, 42, 0.06);
		border-radius: 16px;
		background: #ffffff;
		padding: 40px;
		box-shadow: 0 20px 40px -12px rgba(15, 23, 42, 0.08);
		text-align: center;
	}

	.login-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		border-radius: 16px;
		background: #f1f5f9;
		color: #64748b;
		margin-bottom: 20px;
	}

	.login-icon.warning {
		background: #fef3c7;
		color: #d97706;
	}

	.login-content h2 {
		font-size: 24px;
		margin-bottom: 8px;
	}

	.login-content p {
		margin: 0 0 24px;
		color: #64748b;
		font-size: 14px;
		line-height: 1.6;
	}

	.login-form {
		text-align: left;
	}

	.input-group {
		display: flex;
		gap: 8px;
	}

	.input-group input {
		flex: 1;
	}

	.input-group button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		white-space: nowrap;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
		padding: 16px 24px;
	}

	.stat-card {
		border: 1px solid rgba(15, 23, 42, 0.06);
		border-radius: 12px;
		background: #ffffff;
		padding: 16px 20px;
		text-align: center;
	}

	.stat-value {
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.025em;
		color: #0f172a;
	}

	.stat-value.success {
		color: #16a34a;
	}

	.stat-value.muted {
		color: #94a3b8;
	}

	.stat-value.featured {
		color: #d97706;
	}

	.stat-label {
		margin-top: 4px;
		color: #64748b;
		font-size: 12px;
		font-weight: 600;
	}

	.action-bar {
		padding: 0 24px 16px;
	}

	.tabs {
		display: flex;
		gap: 8px;
	}

	.tab {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid rgba(15, 23, 42, 0.1);
		border-radius: 10px;
		background: #ffffff;
		padding: 10px 18px;
		color: #64748b;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab:hover {
		border-color: rgba(15, 23, 42, 0.2);
		color: #0f172a;
	}

	.tab.active {
		border-color: #0f172a;
		background: #0f172a;
		color: #ffffff;
	}

	.tab.primary {
		border-color: #0f172a;
		background: #0f172a;
		color: #ffffff;
	}

	.tab.primary.active {
		background: #1e293b;
	}

	.filter-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 0 24px 16px;
	}

	.search-box {
		position: relative;
		flex: 1;
		max-width: 400px;
	}

	.search-box svg {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: #94a3b8;
		pointer-events: none;
	}

	.search-box input {
		width: 100%;
		border: 1px solid rgba(15, 23, 42, 0.1);
		border-radius: 10px;
		background: #ffffff;
		padding: 10px 40px 10px 42px;
		font-size: 14px;
		transition: all 0.2s ease;
	}

	.search-box input:focus {
		outline: none;
		border-color: #0f172a;
		box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
	}

	.clear-btn {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		border: none;
		background: transparent;
		padding: 4px;
		color: #94a3b8;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.clear-btn:hover {
		color: #64748b;
	}

	.filter-controls {
		display: flex;
		gap: 8px;
	}

	.select-wrapper {
		position: relative;
	}

	.select-wrapper select {
		appearance: none;
		border: 1px solid rgba(15, 23, 42, 0.1);
		border-radius: 10px;
		background: #ffffff;
		padding: 10px 36px 10px 14px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.select-wrapper select:focus {
		outline: none;
		border-color: #0f172a;
	}

	.select-wrapper::after {
		content: '';
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-top: 5px solid #94a3b8;
		pointer-events: none;
	}

	.create-panel {
		padding: 0 24px 24px;
	}

	.editor-form {
		border: 1px solid rgba(15, 23, 42, 0.06);
		border-radius: 16px;
		background: #ffffff;
		padding: 24px;
		box-shadow: 0 20px 40px -12px rgba(15, 23, 42, 0.06);
	}

	.form-header {
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid rgba(15, 23, 42, 0.06);
	}

	.form-header p {
		margin: 4px 0 0;
		color: #64748b;
		font-size: 14px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.form-grid.compact {
		gap: 12px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.form-group.wide {
		grid-column: 1 / -1;
	}

	.form-group label {
		display: flex;
		align-items: center;
		gap: 4px;
		color: #475569;
		font-size: 13px;
		font-weight: 600;
	}

	.required {
		color: #dc2626;
	}

	.hint {
		color: #94a3b8;
		font-size: 12px;
	}

	input,
	select,
	textarea {
		width: 100%;
		border: 1px solid rgba(15, 23, 42, 0.12);
		border-radius: 8px;
		background: #ffffff;
		padding: 10px 12px;
		font-size: 14px;
		transition: all 0.2s ease;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #0f172a;
		box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
	}

	textarea {
		resize: vertical;
		min-height: 60px;
	}

	.checkbox-group {
		display: flex;
		gap: 20px;
	}

	.checkbox-label {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
	}

	.checkbox-label input {
		width: auto;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 20px;
		padding-top: 16px;
		border-top: 1px solid rgba(15, 23, 42, 0.06);
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: none;
		border-radius: 10px;
		background: #0f172a;
		padding: 10px 18px;
		color: #ffffff;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary:hover {
		background: #1e293b;
		transform: translateY(-1px);
	}

	.btn-primary:active {
		transform: translateY(0);
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 1px solid rgba(15, 23, 42, 0.12);
		border-radius: 10px;
		background: #ffffff;
		padding: 10px 18px;
		color: #64748b;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-secondary:hover {
		background: #f8fafc;
		color: #0f172a;
	}

	.btn-danger {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 1px solid #fecaca;
		border-radius: 10px;
		background: #fef2f2;
		padding: 10px 18px;
		color: #dc2626;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-danger:hover {
		background: #fee2e2;
	}

	.btn-icon {
		border: none;
		background: transparent;
		padding: 8px;
		color: #94a3b8;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.btn-icon:hover {
		color: #64748b;
	}

	.site-list {
		display: grid;
		gap: 12px;
		padding: 0 24px 24px;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		border: 1px dashed rgba(15, 23, 42, 0.12);
		border-radius: 16px;
		padding: 48px 24px;
		color: #94a3b8;
		text-align: center;
	}

	.empty-state p {
		margin: 0;
		font-size: 15px;
		font-weight: 500;
	}

	.site-card {
		border: 1px solid rgba(15, 23, 42, 0.06);
		border-radius: 12px;
		background: #ffffff;
		transition: all 0.2s ease;
		animation: fade-in 0.4s ease both;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.site-card:hover {
		border-color: rgba(15, 23, 42, 0.12);
		box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.08);
	}

	.site-card.hidden {
		opacity: 0.6;
	}

	.site-card.featured {
		border-color: rgba(217, 119, 6, 0.2);
		background: linear-gradient(135deg, rgba(254, 243, 199, 0.3), rgba(255, 255, 255, 1));
	}

	.site-card.editing {
		border-color: #0f172a;
		box-shadow: 0 20px 40px -12px rgba(15, 23, 42, 0.15);
	}

	.site-card-content {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		padding: 16px;
		cursor: pointer;
		text-align: left;
		width: 100%;
		border: none;
		background: transparent;
		font: inherit;
		color: inherit;
	}

	.logo-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		border-radius: 10px;
		background: #f1f5f9;
		color: #475569;
		font-size: 18px;
		font-weight: 700;
		overflow: hidden;
	}

	.logo-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.site-card-info {
		flex: 1;
		min-width: 0;
	}

	.site-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 4px;
	}

	.site-badges {
		display: flex;
		gap: 6px;
	}

	.badge {
		border-radius: 4px;
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.badge.featured {
		background: #fef3c7;
		color: #b45309;
	}

	.badge.hidden {
		background: #e2e8f0;
		color: #64748b;
	}

	.site-desc {
		margin: 0;
		color: #64748b;
		font-size: 13px;
		line-height: 1.5;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.site-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 8px;
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: #94a3b8;
		font-size: 12px;
		font-weight: 500;
	}

	.site-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 8px;
	}

	.tag {
		border-radius: 4px;
		background: #f1f5f9;
		padding: 2px 8px;
		color: #475569;
		font-size: 11px;
		font-weight: 500;
	}

	.tag.more {
		background: #e2e8f0;
		color: #64748b;
	}

	.site-card-action {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border-radius: 8px;
		background: #f8fafc;
		color: #94a3b8;
		transition: all 0.2s ease;
	}

	.site-card:hover .site-card-action {
		background: #f1f5f9;
		color: #64748b;
	}

	.edit-form {
		padding: 16px;
	}

	.edit-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(15, 23, 42, 0.06);
	}

	.site-preview {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.site-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.site-id {
		color: #94a3b8;
		font-size: 12px;
		font-weight: 500;
	}

	.site-status {
		display: flex;
		gap: 6px;
	}

	.status-tag {
		border-radius: 4px;
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 600;
	}

	.status-tag.hidden {
		background: #e2e8f0;
		color: #64748b;
	}

	.status-tag.featured {
		background: #fef3c7;
		color: #b45309;
	}

	.edit-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 16px;
		padding-top: 12px;
		border-top: 1px solid rgba(15, 23, 42, 0.06);
	}

	@media (max-width: 1024px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.admin-header {
			flex-direction: column;
			align-items: stretch;
			gap: 12px;
		}

		.header-brand {
			justify-content: space-between;
		}

		.header-actions {
			justify-content: flex-end;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			padding: 12px 16px;
		}

		.action-bar,
		.filter-bar,
		.create-panel,
		.site-list {
			padding-left: 16px;
			padding-right: 16px;
		}

		.filter-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.search-box {
			max-width: none;
		}

		.filter-controls {
			justify-content: stretch;
		}

		.filter-controls .select-wrapper {
			flex: 1;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.checkbox-group {
			flex-direction: column;
			gap: 12px;
		}

		.edit-actions {
			flex-wrap: wrap;
		}

		.edit-actions button {
			flex: 1;
		}
	}

	.label-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.add-cat-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		border: 1px dashed rgba(59, 130, 246, 0.4);
		background: rgba(59, 130, 246, 0.04);
		color: #3b82f6;
		border-radius: 6px;
		padding: 4px 8px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.add-cat-btn:hover {
		background: rgba(59, 130, 246, 0.1);
		border-color: rgba(59, 130, 246, 0.6);
	}

	.create-category-panel {
		margin-top: 10px;
		padding: 12px;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
		border: 1px dashed rgba(59, 130, 246, 0.2);
		border-radius: 10px;
	}

	.category-form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.cat-form-group {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.cat-form-group label {
		font-size: 12px;
		font-weight: 500;
		color: #475569;
	}

	.cat-form-group input {
		font-size: 13px;
		padding: 6px 10px;
		border-radius: 6px;
		border: 1px solid rgba(15, 23, 42, 0.1);
		background: white;
	}

	.cat-actions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
		margin-top: 4px;
	}

	.logo-upload-section {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.logo-upload-area {
		position: relative;
	}

	.logo-upload-area input[type="file"] {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	.upload-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 20px;
		background: #f8fafc;
		border: 2px dashed rgba(148, 163, 184, 0.4);
		border-radius: 12px;
		color: #64748b;
		transition: all 0.2s ease;
	}

	.upload-label:hover {
		background: #f1f5f9;
		border-color: rgba(59, 130, 246, 0.5);
		color: #3b82f6;
	}

	.upload-label span {
		font-size: 13px;
		font-weight: 500;
	}

	.logo-preview-box {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px;
		background: #f8fafc;
		border: 1px solid rgba(15, 23, 42, 0.06);
		border-radius: 10px;
	}

	.preview-img {
		width: 48px;
		height: 48px;
		object-fit: contain;
		border-radius: 8px;
		background: white;
		padding: 4px;
	}

	.clear-preview {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clear-preview:hover {
		background: rgba(239, 68, 68, 0.2);
	}
</style>
