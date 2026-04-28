import adapter from './cloudflare-pages-adapter.js';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
