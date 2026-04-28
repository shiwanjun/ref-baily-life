import cloudflare from '@sveltejs/adapter-cloudflare';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export default function adapter(options = {}) {
	const base = cloudflare(options);

	return {
		...base,
		async adapt(builder) {
			await base.adapt(builder);

			const dest = builder.getBuildDirectory('cloudflare');
			const tmp = builder.getBuildDirectory('cloudflare-tmp');
			const serverDest = `${dest}/server`;
			const workerPath = `${dest}/_worker.js`;
			const tmpManifestPath = `${tmp}/manifest.js`;
			const manifestPath = `${dest}/manifest.js`;

			builder.rimraf(serverDest);
			builder.writeServer(serverDest);

			if (existsSync(workerPath)) {
				const worker = readFileSync(workerPath, 'utf8')
					.replace('"./../output/server/index.js"', '"./server/index.js"')
					.replace('"./../cloudflare-tmp/manifest.js"', '"./manifest.js"');
				writeFileSync(workerPath, worker);
			}

			if (existsSync(tmpManifestPath)) {
				const manifest = readFileSync(tmpManifestPath, 'utf8').replaceAll(
					'../output/server/',
					'./server/'
				);
				writeFileSync(manifestPath, manifest);
			}
		}
	};
}
