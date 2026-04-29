<script lang="ts">
	import type { Category, Site } from '$lib/ref-data';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const sites = $derived(data.sites as Site[]);
	const settings = $derived(data.settings);
	const categories = $derived(data.categories as Category[]);

	let query = $state('');
	let activeCategory = $state('全部');
	let darkMode = $state(false);
	let brokenLogoIds = $state(new Set<number>());
	let editMode = $state(false);
	const editModeStorageKey = 'liantang-edit-mode';
	const adminEditMode = $derived(Boolean(data.loggedIn && editMode));
	let showLogin = $state(false);
	let showUserPanel = $state(false);
	let userMode = $state<'login' | 'register'>('login');
	let showSiteEditor = $state(false);
	let showCategoryEditor = $state(false);
	let reminderSite = $state<Site | null>(null);
	let fetchingMetadata = $state(false);
	let tagDraft = $state('');
	let editor = $state({
		id: '',
		name: '',
		url: '',
		logo: '',
		desc: '',
		category: '数字服务与好物',
		tags: '',
		sort: '100',
		featured: false,
		hidden: false
	});

	const wechatQr = '/wechat-qrcode.jpg';

	const footerNotes = [
		{
			id: 'usage-note',
			label: '使用说明'
		},
		{
			id: 'privacy-note',
			label: '隐私保护'
		},
		{
			id: 'disclaimer-note',
			label: '免责声明'
		},
		{
			id: 'update-note',
			label: '更新反馈'
		}
	];

	const visibleSites = $derived(
		sites.filter((site) => {
			const keyword = query.trim().toLowerCase();
			const inCategory = keyword || activeCategory === '全部' || site.category === activeCategory;
			const inSearch =
				!keyword ||
				site.name.toLowerCase().includes(keyword) ||
				site.desc.toLowerCase().includes(keyword) ||
				site.catelog.toLowerCase().includes(keyword) ||
				site.category.toLowerCase().includes(keyword) ||
				site.tags.some((tag) => tag.toLowerCase().includes(keyword));
			return inCategory && inSearch;
		}).toSorted(
			(a, b) =>
				Number(b.featured) - Number(a.featured) ||
				a.sort - b.sort ||
				a.id - b.id
		)
	);

	const featuredSites = $derived(
		sites
			.filter((site) => site.featured)
			.sort((a, b) => a.sort - b.sort || a.id - b.id)
			.slice(0, 10)
	);

	const fallbackFeaturedSites = $derived(
		[2, 1, 46, 49, 34, 15, 14, 18, 39, 55]
			.map((id) => sites.find((site) => site.id === id))
			.filter((site): site is Site => Boolean(site))
	);

	const marqueeSites = $derived(
		(sites.length ? sites : fallbackFeaturedSites)
			.toSorted(
				(a, b) =>
					Number(b.featured) - Number(a.featured) ||
					a.sort - b.sort ||
					a.id - b.id
			)
			.slice(0, 10)
	);

	const selectedTags = $derived(parseTags(editor.tags));
	const tagOptions = $derived(
		Array.from(new Set([...sites.flatMap((site) => site.tags), ...selectedTags]))
			.filter(Boolean)
			.toSorted((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
	);

	function normalizeUrl(url: string) {
		if (!url) return '#';
		if (/^https?:\/\//i.test(url)) return url;
		return `https://${url}`;
	}

	function hasUrl(url: string) {
		return Boolean(url.trim());
	}

	function logoSrc(logo: string) {
		if (!logo) return '';
		if (logo.startsWith('data:')) return logo;
		if (/^https?:\/\//i.test(logo)) return logo;
		return '';
	}

	function initial(name: string) {
		return name.trim().slice(0, 1).toUpperCase();
	}

	function markLogoBroken(id: number) {
		brokenLogoIds = new Set([...brokenLogoIds, id]);
	}

	function parseTags(value: string) {
		return value
			.split(/[,，\n]/)
			.map((tag) => tag.trim())
			.filter(Boolean)
			.slice(0, 8);
	}

	function setEditorTags(tags: string[]) {
		editor.tags = Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)))
			.slice(0, 8)
			.join(', ');
	}

	function toggleEditorTag(tag: string) {
		setEditorTags(
			selectedTags.includes(tag) ? selectedTags.filter((item) => item !== tag) : [...selectedTags, tag]
		);
	}

	function addEditorTag() {
		const tag = tagDraft.trim();
		if (!tag) return;
		setEditorTags([...selectedTags, tag]);
		tagDraft = '';
	}

	function addEditorTagOnKey(event: KeyboardEvent) {
		if (event.isComposing || event.key !== 'Enter') return;
		event.preventDefault();
		addEditorTag();
	}

	function setAdminEditMode(next: boolean) {
		editMode = next;
		if (typeof sessionStorage === 'undefined') return;

		if (next && data.loggedIn) {
			sessionStorage.setItem(editModeStorageKey, '1');
		} else {
			sessionStorage.removeItem(editModeStorageKey);
		}
	}

	function reminderText(site: Site) {
		return site.desc.trim();
	}

	function openWithReminder(event: MouseEvent, site: Site) {
		if (!reminderText(site) && hasUrl(site.url)) return;
		event.preventDefault();
		if (reminderText(site)) reminderSite = site;
	}

	function openCreateSite(category = activeCategory === '全部' ? '数字服务与好物' : activeCategory) {
		editor = {
			id: '',
			name: '',
			url: '',
			logo: '',
			desc: '',
			category,
			tags: '',
			sort: '100',
			featured: false,
			hidden: false
		};
		tagDraft = '';
		showSiteEditor = true;
	}

	function openEditSite(site: Site) {
		editor = {
			id: String(site.id),
			name: site.name,
			url: site.url,
			logo: site.logo,
			desc: site.desc,
			category: site.category,
			tags: site.tags.join(', '),
			sort: String(site.sort),
			featured: Boolean(site.featured),
			hidden: Boolean(site.hide)
		};
		tagDraft = '';
		showSiteEditor = true;
	}

	async function fetchMetadata() {
		if (!editor.url.trim()) return;
		fetchingMetadata = true;
		try {
			const response = await fetch(`/api/metadata?url=${encodeURIComponent(editor.url.trim())}`);
			const metadata = await response.json();
			if (metadata.title && !editor.name) editor.name = metadata.title;
			if (metadata.description && !editor.desc) editor.desc = metadata.description;
			if (metadata.icon && !editor.logo) editor.logo = metadata.icon;
			if (metadata.url) editor.url = metadata.url;
		} finally {
			fetchingMetadata = false;
		}
	}

	function closeOnBackdropKey(event: KeyboardEvent, close: () => void) {
		if (event.key === 'Escape') {
			close();
			return;
		}

		if (event.currentTarget === event.target && (event.key === 'Enter' || event.key === ' ')) {
			close();
		}
	}

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.classList.toggle('dark', darkMode);
		}
	});

	$effect(() => {
		if (typeof sessionStorage === 'undefined') return;

		if (!data.loggedIn) {
			sessionStorage.removeItem(editModeStorageKey);
			editMode = false;
			return;
		}

		editMode = sessionStorage.getItem(editModeStorageKey) === '1';
	});
</script>

<svelte:head>
	<title>莲塘导航 — liantang.fun</title>
	<meta
		name="description"
		content="莲塘导航收集返现、开户、支付、eSIM、理赔和实用工具链接，方便快速筛选常用推荐入口。"
	/>
</svelte:head>

<main class="shell">
	<header class="topbar">
		<a class="brand" href="/" aria-label="莲塘导航">
			<span class="brand-mark" aria-hidden="true">
				<span>莲</span>
			</span>
			<span>
				<strong>莲塘导航</strong>
				<small>liantang.fun</small>
			</span>
		</a>
		<nav class="nav-actions" aria-label="页面操作">
			<a href="#usage-note">说明</a>
			<a href="#update-note">反馈</a>
			<button type="button" class="nav-button user-entry" onclick={() => (showUserPanel = true)}>
				{#if data.user}
					<span>{data.user.vip_status === 'active' ? 'VIP' : '账号'}</span>
					{data.user.display_name || data.user.email}
				{:else}
					登录/注册
				{/if}
			</button>
			{#if data.loggedIn}
				<button type="button" class="nav-button" onclick={() => openCreateSite()}>新增推荐</button>
				<button type="button" class="nav-button" onclick={() => (showCategoryEditor = true)}>新分类</button>
				<button type="button" class="nav-button" class:active={adminEditMode} onclick={() => setAdminEditMode(!adminEditMode)}>
					{adminEditMode ? '完成' : '编辑'}
				</button>
				<form method="POST" action="?/logout">
					<button class="nav-button" onclick={() => setAdminEditMode(false)}>退出</button>
				</form>
			{:else}
				<button type="button" class="nav-button" onclick={() => (showLogin = true)}>管理</button>
			{/if}
			<button type="button" class="icon-button" aria-label="切换深色模式" onclick={() => (darkMode = !darkMode)}>
				{darkMode ? '☀' : '◐'}
			</button>
		</nav>
	</header>

	<section class="hero">
		<div class="hero-copy">
			<p class="eyebrow">Liantang referral desk</p>
			<h1>返现、开户、工具和好物推荐</h1>
			<p class="lead">
				把常用入口集中在一个干净的页面里，按分类筛选，快速找到返现网站、证券平台、支付工具、eSIM 和航空理赔等链接。
			</p>
		</div>
		<div class="search-panel">
			<label for="search">搜索推荐</label>
			<div class="search-row">
				<input
					id="search"
					bind:value={query}
					type="search"
					placeholder="输入 Rakuten、eSIM、证券、AirHelp..."
					autocomplete="off"
				/>
				<button type="button" aria-label="清空搜索" onclick={() => (query = '')}>×</button>
			</div>
			<div class="quick-stats">
				<span>{sites.length} 个链接</span>
				<span>{categories.length} 个分类</span>
				<span>标签筛选</span>
				{#if data.user?.vip_status === 'active'}<span>VIP 已开通</span>{/if}
				{#if data.loggedIn}<span>管理模式已登录</span>{/if}
			</div>
			{#if form?.error}
				<p class="form-message error">{form.error}</p>
			{/if}
			{#if form?.success}
				<p class="form-message success">{form.success}</p>
			{/if}
		</div>
	</section>

	<section class="featured-marquee" aria-label="热门推荐">
		<div class="marquee-track">
			{#each marqueeSites as site}
				<a class="featured-link" href={normalizeUrl(site.url)} target="_blank" rel="noreferrer" onclick={(event) => openWithReminder(event, site)}>
					<span>{site.name}</span>
					<small>{site.category}</small>
				</a>
			{/each}
			{#each marqueeSites as site}
				<a class="featured-link" href={normalizeUrl(site.url)} target="_blank" rel="noreferrer" aria-hidden="true" tabindex="-1" onclick={(event) => openWithReminder(event, site)}>
					<span>{site.name}</span>
					<small>{site.category}</small>
				</a>
			{/each}
		</div>
	</section>

	<section class="content">
		<aside class="category-rail" aria-label="推荐分类">
			<button
				type="button"
				class:active={activeCategory === '全部'}
				onclick={() => (activeCategory = '全部')}
			>
				全部
				<span>{sites.length}</span>
			</button>
			{#each categories as category}
				<button
					type="button"
					class:active={activeCategory === category.name}
					onclick={() => (activeCategory = category.name)}
				>
					<span class="category-label">
						<strong>{category.name}</strong>
						<small>{category.description}</small>
					</span>
					<span>{sites.filter((site) => site.category === category.name).length}</span>
				</button>
			{/each}
			{#if data.loggedIn}
				<button type="button" class="add-category-button" onclick={() => (showCategoryEditor = true)}>
					+ 新增分类
				</button>
			{/if}
			<div class="wechat-card" aria-label="关注公众号莲塘导航">
				<div class="wechat-qr" aria-hidden="true">
					{#if wechatQr}
						<img src={wechatQr} alt="" loading="lazy" />
					{:else}
						<span></span>
						<span></span>
						<span></span>
						<small>QR</small>
					{/if}
				</div>
				<div>
					<p>微信公众号</p>
					<h3>莲塘导航</h3>
					<span>占位二维码已生成，后续替换同名图片即可接入真实公众号。</span>
				</div>
			</div>
		</aside>

		<section class="results" aria-live="polite">
			<div class="results-head">
				<div>
					<p>当前分类</p>
					<h2>{query.trim() ? '搜索结果' : activeCategory}</h2>
				</div>
				<span>{visibleSites.length} 个结果</span>
			</div>

			{#if visibleSites.length === 0}
				<div class="empty">没有找到匹配的推荐链接。</div>
			{:else}
				<div class="site-grid">
					{#each visibleSites as site}
						<article class="site-card" class:editing={adminEditMode} class:featured={Boolean(site.featured)} class:hidden={Boolean(data.loggedIn && site.hide)}>
							{#if site.featured}
								<span class="featured-star" aria-label="精选推荐">★</span>
							{/if}
							{#if !adminEditMode}
								<a class="card-link" href={normalizeUrl(site.url)} target="_blank" rel="noreferrer" aria-label={site.name} onclick={(event) => openWithReminder(event, site)}></a>
							{/if}
							<div class="site-logo">
								{#if logoSrc(site.logo) && !brokenLogoIds.has(site.id)}
									<img src={logoSrc(site.logo)} alt="" loading="lazy" onerror={() => markLogoBroken(site.id)} />
								{:else}
									<span>{initial(site.name)}</span>
								{/if}
							</div>
							<div class="site-main">
								<div class="site-title-row">
									<h3>{site.name}</h3>
									{#if hasUrl(site.url)}
										<span>↗</span>
									{/if}
								</div>
								<p>{site.desc || site.catelog}</p>
								<div class="site-meta">
									{#if data.loggedIn && site.hide}
										<span class="hidden-status">已隐藏</span>
									{/if}
									<span>{site.category}</span>
									{#each site.tags as tag}
										<span class:warn-tag={tag === '注意条件'}>{tag}</span>
									{/each}
									{#if hasUrl(site.url)}
										<code>{normalizeUrl(site.url).replace(/^https?:\/\//, '')}</code>
									{/if}
								</div>
							</div>
							{#if adminEditMode}
								<div class="card-actions">
									<button type="button" onclick={() => openEditSite(site)}>编辑</button>
									<form method="POST" action="?/removeSite">
										<input type="hidden" name="id" value={site.id} />
										<button onclick={(event) => {
											if (!confirm(`确定删除「${site.name}」吗？`)) event.preventDefault();
										}}>删除</button>
									</form>
								</div>
							{/if}
						</article>
					{/each}
				</div>
			{/if}
		</section>
	</section>

	<section class="site-notes" aria-label="网站说明">
		<footer class="site-footer">
			{#each footerNotes as note}
				<a href={'#' + note.id}>{note.label}</a>
			{/each}
			<a href="https://liantang.fun" target="_blank" rel="noreferrer">liantang.fun</a>
		</footer>
	</section>

	{#if showLogin}
		<div class="modal-backdrop" role="button" tabindex="0" aria-label="关闭登录窗口" onclick={(event) => { if (event.currentTarget === event.target) showLogin = false; }} onkeydown={(event) => closeOnBackdropKey(event, () => (showLogin = false))}>
			<section class="modal small-modal" role="dialog" aria-modal="true" tabindex="-1">
				<button class="modal-close" type="button" onclick={() => (showLogin = false)}>×</button>
				<h2>进入管理模式</h2>
				<p>登录后可以直接在当前页面新增、编辑、删除推荐和分类。</p>
				<form method="POST" action="?/login" class="modal-form">
					<input name="password" type="password" placeholder="管理密码" required />
					<button class="primary-button">登录</button>
				</form>
			</section>
		</div>
	{/if}

	{#if showUserPanel}
		<div class="auth-page-backdrop" role="button" tabindex="0" aria-label="关闭账号窗口" onclick={(event) => { if (event.currentTarget === event.target) showUserPanel = false; }} onkeydown={(event) => closeOnBackdropKey(event, () => (showUserPanel = false))}>
			<section class="auth-page" role="dialog" aria-modal="true" tabindex="-1">
				<div class="auth-side">
					<div class="auth-side-actions">
						<button type="button" class="auth-back-link" onclick={() => (showUserPanel = false)}>← 返回首页</button>
						<span>{data.user ? '账号权益同步中' : userMode === 'login' ? '已有账号直接登录' : '新用户开始使用'}</span>
					</div>
					<h2>{data.user ? '管理你的账号' : userMode === 'login' ? '登录你的账号' : '创建你的账号'}</h2>
					<p>
						{data.user
							? '更新联系方式、开通 VIP，并同步到莲塘会员中心。'
							: userMode === 'login'
								? '输入邮箱和密码即可登录。'
								: '填写邮箱和密码，开始同步你的会员权益。'}
					</p>
				</div>
				<div class="auth-card">
					<button class="auth-card-close" type="button" aria-label="关闭账号窗口" onclick={() => (showUserPanel = false)}>×</button>
				{#if data.user}
					<h2>推荐站账号</h2>
					<p>一站登录，解锁并同步莲塘导航会员权益内容。</p>
					<div class="account-panel">
						<span>{data.user.vip_status === 'active' ? 'VIP 用户' : '普通用户'}</span>
						<strong>{data.user.display_name || data.user.email}</strong>
						{#if data.user.crm_uid}<small>CRM UID：{data.user.crm_uid}</small>{/if}
					</div>
					<form method="POST" action="?/updateContact" class="auth-form">
						<label>
							邮箱
							<input name="email" type="email" value={data.user.email} required />
						</label>
						<label>
							显示名称
							<input name="display_name" value={data.user.display_name} placeholder="莲塘朋友" />
						</label>
						<label>
							微信
							<input name="wechat" value={data.user.wechat} placeholder="可选" />
						</label>
						<label>
							Telegram
							<input name="telegram" value={data.user.telegram} placeholder="可选" />
						</label>
						<button class="primary-button">更新联系方式</button>
					</form>
					<div class="account-actions">
						<form method="POST" action="?/openVip">
							<button class="primary-button" disabled={data.user.vip_status === 'active'}>
								{data.user.vip_status === 'active' ? 'VIP 已开通' : '开通 VIP'}
							</button>
						</form>
						<form method="POST" action="?/logoutUser">
							<button class="secondary-button">退出账号</button>
						</form>
					</div>
				{:else}
					<h2>{userMode === 'login' ? '登录推荐站账号' : '注册推荐站账号'}</h2>
					<p>一站登录，解锁并同步莲塘导航会员权益内容。</p>
					<div class="auth-switch auth-card-tabs" role="tablist" aria-label="账号模式">
						<button type="button" class:active={userMode === 'register'} onclick={() => (userMode = 'register')}>
							<strong>注册</strong>
							<small>新用户开始使用</small>
						</button>
						<button type="button" class:active={userMode === 'login'} onclick={() => (userMode = 'login')}>
							<strong>登录</strong>
							<small>已有账号返回</small>
						</button>
					</div>
					{#if userMode === 'login'}
						<form method="POST" action="?/loginUser" class="auth-form">
							<label>
								邮箱
								<input name="email" type="email" placeholder="you@example.com" required autocomplete="email" />
							</label>
							<label>
								密码
								<input name="password" type="password" placeholder="至少 6 位" required autocomplete="current-password" />
							</label>
							<button class="primary-button">登录</button>
						</form>
					{:else}
						<form method="POST" action="?/registerUser" class="auth-form">
							<label>
								邮箱
								<input name="email" type="email" placeholder="you@example.com" required autocomplete="email" />
							</label>
							<label>
								显示名称
								<input name="display_name" placeholder="莲塘朋友" autocomplete="name" />
							</label>
							<label>
								密码
								<input name="password" type="password" placeholder="至少 6 位" required autocomplete="new-password" minlength="6" />
							</label>
							<button class="primary-button">注册并登录</button>
						</form>
					{/if}
				{/if}
				</div>
			</section>
		</div>
	{/if}

	{#if showCategoryEditor}
		<div class="modal-backdrop" role="button" tabindex="0" aria-label="关闭分类窗口" onclick={(event) => { if (event.currentTarget === event.target) showCategoryEditor = false; }} onkeydown={(event) => closeOnBackdropKey(event, () => (showCategoryEditor = false))}>
			<section class="modal small-modal" role="dialog" aria-modal="true" tabindex="-1">
				<button class="modal-close" type="button" onclick={() => (showCategoryEditor = false)}>×</button>
				<h2>新增或更新分类</h2>
				<form method="POST" action="?/createCategory" class="modal-form">
					<label>
						分类名称
						<input name="name" placeholder="例如 美股工具" required />
					</label>
					<label>
						说明
						<input name="description" placeholder="一句话说明这个分类" />
					</label>
					<label>
						排序
						<input name="sort" type="number" value="100" />
					</label>
					<button class="primary-button">保存分类</button>
				</form>
			</section>
		</div>
	{/if}

	{#if reminderSite}
		<div class="modal-backdrop" role="button" tabindex="0" aria-label="关闭提醒备注" onclick={(event) => { if (event.currentTarget === event.target) reminderSite = null; }} onkeydown={(event) => closeOnBackdropKey(event, () => (reminderSite = null))}>
			<section class="modal reminder-modal" role="dialog" aria-modal="true" tabindex="-1">
				<button class="modal-close" type="button" onclick={() => (reminderSite = null)}>×</button>
				<p class="modal-eyebrow"><span aria-hidden="true">💡</span> 莲塘提醒你哦</p>
				<h2>{reminderSite.name}</h2>
				<div class="reminder-note">
					<span class="reminder-icon" aria-hidden="true">✨</span>
					<p>{reminderText(reminderSite)}</p>
				</div>
					<div class="reminder-actions">
						<button type="button" class="secondary-button" onclick={() => (reminderSite = null)}>先不打开 👀</button>
						{#if hasUrl(reminderSite.url)}
							<a class="primary-button" href={normalizeUrl(reminderSite.url)} target="_blank" rel="noreferrer" onclick={() => (reminderSite = null)}>
								继续访问 🚀
							</a>
						{/if}
					</div>
			</section>
		</div>
	{/if}

	{#if showSiteEditor}
		<div class="modal-backdrop" role="button" tabindex="0" aria-label="关闭推荐窗口" onclick={(event) => { if (event.currentTarget === event.target) showSiteEditor = false; }} onkeydown={(event) => closeOnBackdropKey(event, () => (showSiteEditor = false))}>
			<section class="modal" role="dialog" aria-modal="true" tabindex="-1">
				<button class="modal-close" type="button" onclick={() => (showSiteEditor = false)}>×</button>
				<h2>{editor.id ? '编辑推荐' : '新增推荐'}</h2>
				<form method="POST" action={editor.id ? '?/updateSite' : '?/createSite'} class="site-editor-form">
					{#if editor.id}
						<input type="hidden" name="id" value={editor.id} />
					{/if}
					<label class="wide">
						链接
						<div class="url-row">
							<input name="url" bind:value={editor.url} placeholder="https://example.com" />
							<button type="button" onclick={fetchMetadata} disabled={fetchingMetadata}>
								{fetchingMetadata ? '获取中' : '自动获取'}
							</button>
						</div>
					</label>
					<label>
						名称
						<input name="name" bind:value={editor.name} required />
					</label>
					<label>
						分类
						<select name="category" bind:value={editor.category}>
							{#each categories as category}
								<option value={category.name}>{category.name}</option>
							{/each}
						</select>
					</label>
					<label class="wide">
						提醒备注
						<input name="desc" bind:value={editor.desc} />
					</label>
					<div class="tag-editor wide">
						标签
						<input name="tags" type="hidden" value={editor.tags} />
						<div class="selected-tags" aria-label="已选标签">
							{#if selectedTags.length}
								{#each selectedTags as tag}
									<button type="button" class="tag-chip selected" onclick={() => toggleEditorTag(tag)}>
										{tag}
										<span aria-hidden="true">×</span>
									</button>
								{/each}
							{:else}
								<span class="tag-empty">还没有选择标签</span>
							{/if}
						</div>
						<div class="tag-add-row">
							<input bind:value={tagDraft} placeholder="输入新标签" onkeydown={addEditorTagOnKey} />
							<button type="button" onclick={addEditorTag} disabled={!tagDraft.trim()}>添加</button>
						</div>
						<div class="tag-options" aria-label="可选标签">
							{#each tagOptions as tag}
								<button type="button" class="tag-chip" class:selected={selectedTags.includes(tag)} onclick={() => toggleEditorTag(tag)}>
									{tag}
								</button>
							{/each}
						</div>
					</div>
					<label>
						排序
						<input name="sort" type="number" bind:value={editor.sort} />
					</label>
					<label class="wide">
						Logo URL 或 data:image
						<textarea name="logo" bind:value={editor.logo} rows="3"></textarea>
					</label>
					<div class="checks wide">
						<label><input name="featured" type="checkbox" bind:checked={editor.featured} /> 精选</label>
						<label><input name="hidden" type="checkbox" bind:checked={editor.hidden} /> 隐藏</label>
					</div>
					<button class="primary-button wide">{editor.id ? '保存修改' : '新增推荐'}</button>
				</form>
			</section>
		</div>
	{/if}
</main>

<style>
	.shell {
		min-height: 100vh;
		padding: 18px;
	}

	.topbar {
		margin: 0 auto;
		display: flex;
		max-width: 1180px;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		border-bottom: 1px solid rgba(15, 23, 42, 0.08);
		padding: 6px 0 18px;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 14px;
	}

	.brand-mark {
		position: relative;
		display: flex;
		height: 48px;
		width: 48px;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 12px;
		background: #111827;
		color: #ffffff;
		box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
		font-size: 14px;
		font-weight: 850;
		letter-spacing: 0;
	}

	.brand-mark::after {
		position: absolute;
		right: 10px;
		bottom: 10px;
		height: 6px;
		width: 6px;
		border-radius: 999px;
		background: #22c55e;
		content: '';
	}

	.brand-mark span {
		display: none;
	}

	.brand-mark::before {
		content: 'ref';
	}

	.brand strong,
	.brand small {
		display: block;
	}

	.brand strong {
		font-size: 22px;
		font-weight: 850;
		letter-spacing: 0;
	}

	.brand small {
		margin-top: 3px;
		color: #64748b;
		font-size: 13px;
		font-weight: 650;
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.nav-actions a,
	.nav-button,
	.icon-button {
		border: 1px solid rgba(15, 23, 42, 0.1);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.7);
		color: #334155;
		padding: 9px 12px;
		font-size: 14px;
	}

	.nav-actions form {
		margin: 0;
	}

	.nav-button.active {
		border-color: #111827;
		background: #111827;
		color: #ffffff;
	}

	.user-entry {
		display: inline-flex;
		max-width: 190px;
		align-items: center;
		gap: 7px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-entry span {
		border-radius: 999px;
		background: #dcfce7;
		color: #166534;
		padding: 2px 6px;
		font-size: 11px;
		font-weight: 850;
	}

	.icon-button {
		width: 40px;
	}

	.hero {
		margin: 28px auto 0;
		display: grid;
		max-width: 1180px;
		grid-template-columns: minmax(0, 1fr) 380px;
		gap: 28px;
		align-items: end;
		border-radius: 8px;
		background:
			linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(30, 41, 59, 0.95) 55%, rgba(20, 83, 45, 0.88)),
			#111827;
		padding: 42px;
		color: #ffffff;
		box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
	}

	.eyebrow {
		margin: 0 0 14px;
		color: #99f6e4;
		font-size: 13px;
		font-weight: 700;
		text-transform: uppercase;
	}

	.hero h1 {
		margin: 0;
		max-width: 760px;
		font-size: clamp(36px, 7vw, 72px);
		line-height: 1.04;
	}

	.lead {
		margin: 22px 0 0;
		max-width: 680px;
		color: #cbd5e1;
		font-size: 17px;
		line-height: 1.8;
	}

	.search-panel {
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.11);
		padding: 18px;
		backdrop-filter: blur(18px);
	}

	.search-panel label {
		display: block;
		margin-bottom: 10px;
		color: #dbeafe;
		font-size: 13px;
		font-weight: 700;
	}

	.search-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 42px;
		gap: 8px;
	}

	.search-row input,
	.search-row button {
		min-height: 46px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.94);
		color: #111827;
	}

	.search-row input {
		width: 100%;
		padding: 0 14px;
		outline: none;
	}

	.search-row button {
		font-size: 22px;
	}

	.quick-stats {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 14px;
	}

	.quick-stats span {
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		padding: 6px 10px;
		color: #dbeafe;
		font-size: 12px;
	}

	.form-message {
		margin: 12px 0 0;
		border-radius: 8px;
		padding: 9px 10px;
		font-size: 13px;
	}

	.form-message.error {
		background: rgba(254, 226, 226, 0.94);
		color: #991b1b;
	}

	.form-message.success {
		background: rgba(220, 252, 231, 0.94);
		color: #166534;
	}

	.featured-marquee {
		margin: 16px auto 0;
		width: min(100%, 1180px);
		max-width: 1180px;
		overflow: hidden;
		padding: 2px 0 4px;
		mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
	}

	.marquee-track {
		display: flex;
		align-items: stretch;
		width: max-content;
		gap: 10px;
		animation: featured-scroll 34s linear infinite;
	}

	.featured-marquee:hover .marquee-track {
		animation-play-state: paused;
	}

	.featured-link {
		display: flex;
		flex: 0 0 220px;
		height: 86px;
		flex-direction: column;
		justify-content: center;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.74);
		padding: 14px;
		box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
		transition:
			transform 160ms ease,
			border-color 160ms ease,
			box-shadow 160ms ease;
	}

	.featured-link:hover {
		border-color: rgba(15, 23, 42, 0.18);
		box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
		transform: translateY(-2px);
	}

	.featured-link span,
	.featured-link small {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.featured-link span {
		font-weight: 750;
	}

	.featured-link small {
		margin-top: 6px;
		color: #64748b;
		font-size: 12px;
	}

	@keyframes featured-scroll {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(calc(-50% - 5px));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}

		.featured-marquee {
			overflow-x: auto;
			mask-image: none;
			scrollbar-width: none;
		}
	}

	.content {
		margin: 18px auto 0;
		display: grid;
		max-width: 1180px;
		grid-template-columns: 260px minmax(0, 1fr);
		gap: 18px;
		align-items: start;
	}

	.category-rail {
		position: sticky;
		top: 18px;
		display: grid;
		gap: 8px;
	}

	.category-rail button {
		display: flex;
		min-height: 58px;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.7);
		color: #334155;
		padding: 10px 12px;
		text-align: left;
	}

	.add-category-button {
		justify-content: center;
		border-style: dashed;
		color: #2563eb;
	}

	.category-label {
		display: block;
		min-width: 0;
	}

	.category-label strong,
	.category-label small {
		display: block;
	}

	.category-label strong {
		font-size: 14px;
		line-height: 1.25;
	}

	.category-label small {
		margin-top: 3px;
		overflow: hidden;
		color: #64748b;
		font-size: 11px;
		line-height: 1.25;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.category-rail button.active {
		border-color: #111827;
		background: #111827;
		color: #ffffff;
	}

	.category-rail button > span:last-child {
		color: inherit;
		font-size: 12px;
		opacity: 0.68;
	}

	.category-rail button.active .category-label small {
		color: rgba(255, 255, 255, 0.68);
	}

	.wechat-card {
		display: grid;
		grid-template-columns: 76px minmax(0, 1fr);
		align-items: center;
		gap: 14px;
		margin-top: 8px;
		border: 1px solid rgba(37, 99, 235, 0.12);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.68);
		padding: 14px;
		box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
	}

	.wechat-qr {
		position: relative;
		display: block;
		height: 76px;
		width: 76px;
		border-radius: 8px;
		background:
			linear-gradient(90deg, #111827 8px, transparent 8px 15px) 11px 11px / 22px 22px,
			linear-gradient(#111827 8px, transparent 8px 15px) 11px 11px / 22px 22px,
			linear-gradient(90deg, transparent 51px, #111827 51px 59px, transparent 59px) 0 0 / 76px 76px,
			linear-gradient(transparent 51px, #111827 51px 59px, transparent 59px) 0 0 / 76px 76px,
			#ffffff;
		box-shadow:
			inset 0 0 0 7px #ffffff,
			inset 0 0 0 7px rgba(15, 23, 42, 0.1);
		overflow: hidden;
	}

	.wechat-qr img {
		display: block;
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	.wechat-qr span {
		position: absolute;
		height: 20px;
		width: 20px;
		border: 5px solid #111827;
		border-radius: 4px;
	}

	.wechat-qr span:nth-child(1) {
		top: 11px;
		left: 11px;
	}

	.wechat-qr span:nth-child(2) {
		top: 11px;
		right: 11px;
	}

	.wechat-qr span:nth-child(3) {
		bottom: 11px;
		left: 11px;
	}

	.wechat-qr small {
		position: absolute;
		right: 9px;
		bottom: 9px;
		color: #2563eb;
		font-size: 10px;
		font-weight: 900;
		letter-spacing: 0;
	}

	.wechat-card p,
	.wechat-card h3,
	.wechat-card span {
		margin: 0;
	}

	.wechat-card p {
		color: #2563eb;
		font-size: 12px;
		font-weight: 850;
	}

	.wechat-card h3 {
		margin-top: 4px;
		color: #111827;
		font-size: 24px;
		line-height: 1.1;
	}

	.wechat-card span {
		display: block;
		margin-top: 7px;
		color: #64748b;
		font-size: 13px;
		line-height: 1.45;
	}

	.results {
		min-width: 0;
	}

	.results-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: 12px;
	}

	.results-head p,
	.results-head h2 {
		margin: 0;
	}

	.results-head p {
		color: #64748b;
		font-size: 13px;
		font-weight: 700;
	}

	.results-head h2 {
		margin-top: 3px;
		font-size: 26px;
	}

	.results-head > span,
	.empty {
		color: #64748b;
		font-size: 14px;
	}

	.site-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	.site-card {
		position: relative;
		display: grid;
		grid-template-columns: 54px minmax(0, 1fr);
		gap: 14px;
		min-height: 140px;
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.82);
		padding: 16px;
		box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
		transition:
			transform 160ms ease,
			border-color 160ms ease,
			box-shadow 160ms ease;
	}

	.site-card.featured {
		border-color: rgba(245, 158, 11, 0.34);
		background:
			linear-gradient(135deg, rgba(255, 251, 235, 0.92), rgba(255, 255, 255, 0.88) 42%),
			rgba(255, 255, 255, 0.82);
	}

	.site-card.hidden {
		border-style: dashed;
		opacity: 0.68;
	}

	.site-card.editing {
		grid-template-columns: 54px minmax(0, 1fr) auto;
	}

	.featured-star {
		position: absolute;
		top: 8px;
		left: 8px;
		z-index: 4;
		display: grid;
		height: 22px;
		width: 22px;
		place-items: center;
		border: 1px solid rgba(217, 119, 6, 0.24);
		border-radius: 999px;
		background: #f59e0b;
		color: #ffffff;
		box-shadow: 0 8px 18px rgba(245, 158, 11, 0.24);
		font-size: 13px;
		line-height: 1;
	}

	.card-link {
		position: absolute;
		inset: 0;
		z-index: 2;
		border-radius: 8px;
	}

	.site-card:hover {
		transform: translateY(-2px);
		border-color: rgba(37, 99, 235, 0.38);
		box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
	}

	.site-logo {
		display: grid;
		height: 54px;
		width: 54px;
		place-items: center;
		overflow: hidden;
		border-radius: 8px;
		background: #eef2ff;
		color: #3730a3;
		font-weight: 800;
	}

	.site-logo img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	.site-main {
		position: relative;
		z-index: 1;
		min-width: 0;
	}

	.card-actions {
		position: relative;
		z-index: 3;
		display: grid;
		align-content: start;
		gap: 8px;
	}

	.card-actions form {
		margin: 0;
	}

	.card-actions button {
		width: 64px;
		border: 1px solid #dbe3ef;
		border-radius: 8px;
		background: #ffffff;
		color: #475569;
		padding: 7px 8px;
		font-size: 12px;
		font-weight: 700;
	}

	.card-actions form button {
		border-color: #fecaca;
		background: #fef2f2;
		color: #991b1b;
	}

	.site-title-row {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 12px;
	}

	.site-title-row h3 {
		margin: 0;
		overflow-wrap: anywhere;
		font-size: 17px;
	}

	.site-title-row span {
		color: #94a3b8;
	}

	.site-main p {
		display: -webkit-box;
		margin: 8px 0 0;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		color: #64748b;
		font-size: 14px;
		line-height: 1.55;
	}

	.site-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 14px;
	}

	.site-meta span,
	.site-meta code {
		max-width: 100%;
		overflow: hidden;
		border-radius: 999px;
		background: #f1f5f9;
		color: #475569;
		padding: 5px 8px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 12px;
	}

	.site-meta code {
		font-family: inherit;
	}

	.site-meta .warn-tag {
		background: #fef3c7;
		color: #92400e;
	}

	.site-meta .hidden-status {
		background: #e2e8f0;
		color: #475569;
	}

	.empty {
		border: 1px dashed rgba(15, 23, 42, 0.16);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.56);
		padding: 28px;
	}

	.site-notes {
		margin: 24px auto 0;
		max-width: 1180px;
		border-top: 1px solid rgba(15, 23, 42, 0.08);
		padding: 13px 0 4px;
	}

	.site-footer {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 14px;
		align-items: center;
		justify-content: center;
		color: #64748b;
		font-size: 12px;
	}

	.site-footer a {
		color: #475569;
		font-weight: 650;
		text-decoration: none;
	}

	.site-footer a:hover {
		color: #111827;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.auth-page-backdrop {
		position: fixed;
		inset: 0;
		z-index: 60;
		overflow: auto;
		background:
			radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.34), transparent 30%),
			linear-gradient(115deg, #101827 0%, #08111f 56%, #0d2a3c 100%);
		padding: clamp(28px, 6vw, 84px);
	}

	.auth-page {
		display: grid;
		min-height: calc(100vh - clamp(56px, 12vw, 168px));
		max-width: 1720px;
		margin: 0 auto;
		grid-template-columns: minmax(320px, 0.9fr) minmax(460px, 680px);
		gap: clamp(44px, 8vw, 140px);
		align-items: center;
	}

	.auth-side {
		color: #ffffff;
	}

	.auth-side-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		align-items: center;
		margin-bottom: 34px;
	}

	.auth-side-actions span,
	.auth-back-link {
		display: inline-flex;
		align-items: center;
		min-height: 38px;
		border-radius: 999px;
		font-weight: 850;
	}

	.auth-back-link {
		border: 0;
		background: transparent;
		color: #cbd5e1;
		padding: 0;
		font-size: 17px;
	}

	.auth-side-actions span {
		border: 1px solid rgba(94, 234, 212, 0.34);
		background: rgba(20, 83, 45, 0.5);
		color: #bbf7d0;
		padding: 0 16px;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	.auth-side h2 {
		margin: 0;
		font-size: clamp(46px, 7vw, 78px);
		line-height: 1.08;
		letter-spacing: 0;
	}

	.auth-side p {
		max-width: 560px;
		margin: 28px 0 0;
		color: #cbd5e1;
		font-size: clamp(20px, 2.2vw, 28px);
		font-weight: 760;
		line-height: 1.45;
	}

	.auth-card {
		position: relative;
		border: 1px solid rgba(226, 232, 240, 0.95);
		border-radius: 34px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98)),
			#ffffff;
		padding: clamp(24px, 4vw, 48px);
		box-shadow: 0 34px 110px rgba(5, 12, 26, 0.32);
	}

	.auth-card-close {
		position: absolute;
		top: 22px;
		right: 22px;
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 1px solid #dbe3ef;
		border-radius: 16px;
		background: #ffffff;
		color: #475569;
		font-size: 26px;
	}

	.auth-card h2 {
		margin: 34px 0 0;
		color: #111827;
		font-size: clamp(34px, 4vw, 48px);
		line-height: 1.12;
	}

	.auth-card p {
		margin: 14px 0 0;
		color: #64748b;
		font-size: 18px;
		font-weight: 680;
		line-height: 1.55;
	}

	.auth-card-tabs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		margin: 0 0 40px;
		border-radius: 24px;
		background: #eef3fb;
		padding: 12px;
		box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.28);
	}

	.auth-card-tabs button {
		display: grid;
		gap: 7px;
		min-height: 94px;
		border: 1px solid transparent;
		border-radius: 18px;
		background: #ffffff;
		color: #64748b;
		padding: 16px;
		font: inherit;
		box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
	}

	.auth-card-tabs button.active {
		background: #2f64e7;
		color: #ffffff;
		box-shadow: 0 18px 38px rgba(47, 100, 231, 0.28);
	}

	.auth-card-tabs strong,
	.auth-card-tabs small {
		display: block;
	}

	.auth-card-tabs strong {
		font-size: 22px;
	}

	.auth-card-tabs small {
		font-size: 14px;
		font-weight: 760;
		opacity: 0.72;
	}

	.auth-form {
		display: grid;
		gap: 22px;
		margin-top: 34px;
	}

	.auth-form label {
		display: grid;
		gap: 10px;
		color: #334155;
		font-size: 15px;
		font-weight: 850;
	}

	.auth-form input {
		width: 100%;
		min-height: 58px;
		border: 1px solid #cbd5e1;
		border-radius: 16px;
		background: #ffffff;
		color: #111827;
		padding: 0 18px;
		font: inherit;
		font-size: 17px;
		outline: none;
	}

	.auth-form input:focus {
		border-color: #2f64e7;
		box-shadow: 0 0 0 4px rgba(47, 100, 231, 0.12);
	}

	.auth-card .primary-button,
	.auth-card .secondary-button {
		min-height: 60px;
		border-radius: 16px;
		font-size: 20px;
	}

	.auth-card .primary-button {
		background: #2f64e7;
		color: #ffffff;
		box-shadow: 0 18px 40px rgba(47, 100, 231, 0.22);
	}

	.auth-card .secondary-button {
		border: 1px solid #dbe3ef;
		background: #ffffff;
		color: #475569;
		box-shadow: none;
	}

	.auth-card .account-panel {
		border-radius: 18px;
		background: #f8fafc;
		padding: 18px;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: grid;
		place-items: center;
		background: rgba(15, 23, 42, 0.46);
		padding: 18px;
	}

	.modal {
		position: relative;
		width: min(760px, 100%);
		max-height: min(760px, calc(100vh - 36px));
		overflow: auto;
		border-radius: 8px;
		background: #ffffff;
		padding: 24px;
		box-shadow: 0 24px 80px rgba(15, 23, 42, 0.24);
	}

	.small-modal {
		width: min(460px, 100%);
	}

	.reminder-modal {
		width: min(660px, 100%);
		border: 1px solid rgba(226, 232, 240, 0.9);
		border-radius: 16px;
		padding: 32px;
		background:
			radial-gradient(circle at 16% 0%, rgba(219, 234, 254, 0.72), transparent 34%),
			#ffffff;
	}

	.modal h2,
	.modal p {
		margin: 0;
	}

	.modal .modal-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		margin: 0 0 10px;
		border-radius: 999px;
		background: #eff6ff;
		color: #2563eb;
		padding: 7px 10px;
		font-size: 13px;
		font-weight: 850;
		letter-spacing: 0;
	}

	.reminder-modal h2 {
		margin-top: 12px;
		font-size: clamp(28px, 5vw, 42px);
		line-height: 1.14;
		letter-spacing: 0;
	}

	.modal p {
		margin-top: 8px;
		color: #64748b;
		line-height: 1.7;
	}

	.reminder-note {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr);
		gap: 12px;
		margin-top: 24px;
		border: 1px solid #dbe3ef;
		border-radius: 12px;
		background: rgba(248, 250, 252, 0.9);
		color: #334155;
		padding: 18px;
		white-space: pre-wrap;
	}

	.reminder-note p {
		margin: 0;
		color: #334155;
		font-size: 18px;
		line-height: 1.75;
	}

	.reminder-icon {
		display: grid;
		height: 38px;
		width: 38px;
		place-items: center;
		border-radius: 10px;
		background: #ffffff;
		box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.72);
		font-size: 18px;
	}

	.reminder-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 24px;
	}

	.modal-close {
		position: absolute;
		top: 18px;
		right: 18px;
		width: 44px;
		height: 44px;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		background: #ffffff;
		color: #475569;
		font-size: 26px;
	}

	.modal-form,
	.site-editor-form {
		display: grid;
		gap: 14px;
		margin-top: 18px;
	}

	.auth-switch,
	.account-actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		margin-top: 18px;
	}

	.auth-switch button {
		border: 1px solid #dbe3ef;
		border-radius: 8px;
		background: #f8fafc;
		color: #475569;
		padding: 10px 12px;
		font: inherit;
		font-weight: 850;
	}

	.auth-switch button.active {
		border-color: #111827;
		background: #111827;
		color: #ffffff;
	}

	.account-panel {
		display: grid;
		gap: 4px;
		margin-top: 18px;
		border: 1px solid #dbe3ef;
		border-radius: 12px;
		background: #f8fafc;
		padding: 14px;
	}

	.account-panel span {
		color: #16a34a;
		font-size: 12px;
		font-weight: 850;
	}

	.account-panel strong {
		overflow-wrap: anywhere;
		font-size: 18px;
	}

	.account-panel small {
		color: #64748b;
		font-size: 12px;
	}

	.account-actions form {
		margin: 0;
	}

	.account-actions button {
		width: 100%;
	}

	.site-editor-form {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.modal label {
		color: #475569;
		font-size: 13px;
		font-weight: 700;
	}

	.modal input,
	.modal select,
	.modal textarea {
		width: 100%;
		margin-top: 6px;
		border: 1px solid #dbe3ef;
		border-radius: 8px;
		background: #ffffff;
		color: #111827;
		padding: 10px 11px;
		font: inherit;
	}

	.modal textarea {
		resize: vertical;
	}

	.wide {
		grid-column: 1 / -1;
	}

	.url-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 8px;
	}

	.url-row button,
	.primary-button,
	.secondary-button {
		border: 0;
		border-radius: 8px;
		padding: 12px 18px;
		font: inherit;
		font-weight: 800;
		text-align: center;
	}

	.primary-button {
		background: #111827;
		color: #ffffff;
		box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
	}

	.secondary-button {
		border: 1px solid #dbe3ef;
		background: #ffffff;
		color: #475569;
	}

	.url-row button:disabled {
		opacity: 0.6;
	}

	.tag-editor {
		color: #475569;
		font-size: 13px;
		font-weight: 700;
	}

	.selected-tags,
	.tag-options {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 8px;
	}

	.selected-tags {
		min-height: 44px;
		align-items: center;
		border: 1px solid #dbe3ef;
		border-radius: 8px;
		background: #ffffff;
		padding: 8px;
	}

	.tag-empty {
		color: #94a3b8;
		font-size: 13px;
		font-weight: 650;
	}

	.tag-add-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 8px;
		margin-top: 10px;
	}

	.tag-add-row input {
		margin-top: 0;
	}

	.tag-add-row button,
	.tag-chip {
		border: 1px solid #dbe3ef;
		border-radius: 999px;
		background: #f8fafc;
		color: #475569;
		padding: 8px 12px;
		font: inherit;
		font-size: 13px;
		font-weight: 800;
	}

	.tag-add-row button {
		border-radius: 8px;
		background: #111827;
		color: #ffffff;
	}

	.tag-add-row button:disabled {
		opacity: 0.45;
	}

	.tag-chip.selected {
		border-color: rgba(37, 99, 235, 0.18);
		background: #dbeafe;
		color: #1d4ed8;
	}

	.selected-tags .tag-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.selected-tags .tag-chip span {
		font-size: 16px;
		line-height: 1;
	}

	.checks {
		display: flex;
		gap: 14px;
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

	:global(body.dark) .topbar {
		border-color: rgba(226, 232, 240, 0.08);
	}

	:global(body.dark) .category-rail button.active {
		background: #f8fafc;
		color: #111827;
	}

	:global(body.dark) .brand small,
	:global(body.dark) .featured-link small,
	:global(body.dark) .results-head p,
	:global(body.dark) .results-head > span,
	:global(body.dark) .empty,
	:global(body.dark) .site-main p {
		color: #94a3b8;
	}

	:global(body.dark) .nav-actions a,
	:global(body.dark) .nav-button,
	:global(body.dark) .icon-button,
	:global(body.dark) .featured-link,
	:global(body.dark) .category-rail button,
	:global(body.dark) .site-card,
	:global(body.dark) .empty {
		border-color: rgba(226, 232, 240, 0.1);
		background: rgba(15, 23, 42, 0.74);
		color: #e5e7eb;
	}

	:global(body.dark) .site-card.featured {
		border-color: rgba(245, 158, 11, 0.32);
		background:
			linear-gradient(135deg, rgba(146, 64, 14, 0.2), rgba(15, 23, 42, 0.78) 46%),
			rgba(15, 23, 42, 0.74);
	}

	:global(body.dark) .modal,
	:global(body.dark) .modal-close,
	:global(body.dark) .modal input,
	:global(body.dark) .modal select,
	:global(body.dark) .modal textarea,
	:global(body.dark) .account-panel,
	:global(body.dark) .auth-switch button,
	:global(body.dark) .card-actions button,
	:global(body.dark) .secondary-button,
	:global(body.dark) .reminder-note,
	:global(body.dark) .selected-tags,
	:global(body.dark) .tag-chip {
		border-color: rgba(226, 232, 240, 0.12);
		background: #111827;
		color: #e5e7eb;
	}

	:global(body.dark) .tag-chip.selected {
		border-color: rgba(96, 165, 250, 0.28);
		background: rgba(37, 99, 235, 0.28);
		color: #bfdbfe;
	}

	:global(body.dark) .reminder-modal {
		background:
			radial-gradient(circle at 16% 0%, rgba(30, 64, 175, 0.32), transparent 34%),
			#111827;
	}

	:global(body.dark) .modal .modal-eyebrow,
	:global(body.dark) .reminder-icon {
		background: rgba(30, 41, 59, 0.96);
		color: #bfdbfe;
	}

	:global(body.dark) .reminder-note p {
		color: #e5e7eb;
	}

	:global(body.dark) .auth-card,
	:global(body.dark) .auth-card .account-panel,
	:global(body.dark) .auth-card-tabs button,
	:global(body.dark) .auth-form input,
	:global(body.dark) .auth-card .secondary-button {
		background: #ffffff;
		color: #111827;
	}

	:global(body.dark) .auth-card p,
	:global(body.dark) .auth-card .account-panel small,
	:global(body.dark) .auth-card-tabs button {
		color: #64748b;
	}

	:global(body.dark) .auth-card-tabs button.active,
	:global(body.dark) .auth-card .primary-button {
		background: #2f64e7;
		color: #ffffff;
	}

	:global(body.dark) .site-logo {
		background: #1e293b;
		color: #bfdbfe;
	}

	:global(body.dark) .wechat-card {
		border-color: rgba(226, 232, 240, 0.1);
		background: rgba(15, 23, 42, 0.62);
	}

	:global(body.dark) .wechat-qr {
		background:
			linear-gradient(90deg, #111827 7px, transparent 7px 13px) 9px 9px / 18px 18px,
			linear-gradient(#111827 7px, transparent 7px 13px) 9px 9px / 18px 18px,
			linear-gradient(90deg, transparent 38px, #111827 38px 45px, transparent 45px) 0 0 / 58px 58px,
			linear-gradient(transparent 38px, #111827 38px 45px, transparent 45px) 0 0 / 58px 58px,
			#e5e7eb;
		box-shadow:
			inset 0 0 0 6px #e5e7eb,
			inset 0 0 0 7px rgba(226, 232, 240, 0.18);
	}

	:global(body.dark) .wechat-card h3,
	:global(body.dark) .site-footer a:hover {
		color: #e5e7eb;
	}

	:global(body.dark) .wechat-card span,
	:global(body.dark) .site-footer {
		color: #94a3b8;
	}

	:global(body.dark) .site-notes {
		border-color: rgba(226, 232, 240, 0.1);
	}

	:global(body.dark) .site-meta span,
	:global(body.dark) .site-meta code {
		background: #1e293b;
		color: #cbd5e1;
	}

	:global(body.dark) .category-label small {
		color: #94a3b8;
	}

	:global(body.dark) .site-meta .warn-tag {
		background: rgba(245, 158, 11, 0.18);
		color: #fcd34d;
	}

	:global(body.dark) .site-meta .hidden-status {
		background: rgba(148, 163, 184, 0.18);
		color: #cbd5e1;
	}

	@media (max-width: 980px) {
		.auth-page {
			min-height: auto;
			grid-template-columns: 1fr;
			gap: 28px;
		}

		.auth-side h2 {
			font-size: 44px;
		}

		.auth-side p {
			font-size: 20px;
		}

		.hero,
		.content {
			grid-template-columns: 1fr;
		}

		.category-rail {
			position: static;
			display: flex;
			overflow-x: auto;
			padding-bottom: 2px;
		}

		.category-rail button {
			white-space: nowrap;
		}

		.wechat-card {
			display: none;
		}
	}

	@media (max-width: 680px) {
		.auth-page-backdrop {
			padding: 18px;
		}

		.auth-side-actions {
			margin-bottom: 22px;
		}

		.auth-side h2 {
			font-size: 34px;
		}

		.auth-card {
			border-radius: 22px;
			padding: 18px;
		}

		.auth-card-tabs {
			gap: 8px;
			border-radius: 18px;
			padding: 8px;
			margin-bottom: 28px;
		}

		.auth-card-tabs button {
			min-height: 78px;
			border-radius: 14px;
			padding: 12px;
		}

		.auth-card h2 {
			margin-top: 30px;
			font-size: 30px;
		}

		.account-actions {
			grid-template-columns: 1fr;
		}

		.shell {
			padding: 12px;
		}

		.topbar {
			align-items: flex-start;
		}

		.nav-actions a {
			display: none;
		}

		.nav-button {
			padding: 8px 10px;
		}

		.hero {
			margin-top: 18px;
			padding: 24px;
		}

		.hero h1 {
			font-size: 38px;
		}

		.site-grid {
			grid-template-columns: 1fr;
		}

		.featured-link {
			flex-basis: 210px;
			height: 86px;
		}

		.site-card {
			min-height: 0;
		}

		.site-card.editing,
		.site-editor-form {
			grid-template-columns: 1fr;
		}

		.card-actions {
			display: flex;
		}
	}
</style>
