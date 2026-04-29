import { json } from '@sveltejs/kit';

function absoluteUrl(url: string, base: URL) {
	if (!url) return '';
	try {
		return new URL(url, base).toString();
	} catch {
		return '';
	}
}

function firstMatch(html: string, patterns: RegExp[]) {
	for (const pattern of patterns) {
		const match = html.match(pattern);
		if (match?.[1]) return match[1].trim();
	}
	return '';
}

function decodeHtml(value: string) {
	return value
		.replaceAll('&amp;', '&')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'")
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>');
}

export async function GET({ url }) {
	const rawUrl = url.searchParams.get('url')?.trim();
	if (!rawUrl) return json({ error: 'missing url' }, { status: 400 });

	const target = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
	let parsed: URL;
	try {
		parsed = new URL(target);
	} catch {
		return json({ error: 'invalid url' }, { status: 400 });
	}

	try {
		const response = await fetch(parsed.toString(), {
			headers: {
				'user-agent':
					'Mozilla/5.0 (compatible; liantang.fun metadata fetcher; +https://liantang.fun)'
			},
			redirect: 'follow'
		});
		const contentType = response.headers.get('content-type') ?? '';
		if (!contentType.includes('text/html')) {
			return json({
				url: response.url || parsed.toString(),
				title: parsed.hostname.replace(/^www\./, ''),
				description: '',
				icon: `${parsed.origin}/favicon.ico`
			});
		}

		const html = (await response.text()).slice(0, 220_000);
		const base = new URL(response.url || parsed.toString());
		const title = decodeHtml(
			firstMatch(html, [
				/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
				/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["'][^>]*>/i,
				/<title[^>]*>([^<]+)<\/title>/i
			])
		);
		const description = decodeHtml(
			firstMatch(html, [
				/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
				/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
				/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i
			])
		);
		const iconHref = firstMatch(html, [
			/<link[^>]+rel=["'][^"']*(?:apple-touch-icon|icon|shortcut icon)[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i,
			/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*(?:apple-touch-icon|icon|shortcut icon)[^"']*["'][^>]*>/i
		]);

		return json({
			url: base.toString(),
			title: title || base.hostname.replace(/^www\./, ''),
			description,
			icon: absoluteUrl(iconHref, base) || `${base.origin}/favicon.ico`
		});
	} catch {
		return json({
			url: parsed.toString(),
			title: parsed.hostname.replace(/^www\./, ''),
			description: '',
			icon: `${parsed.origin}/favicon.ico`
		});
	}
}
