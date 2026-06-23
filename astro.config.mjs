// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

/** Must match SITE_URL in src/data/site.ts */
const SITE_URL = 'https://partylinecollective.com';

// TODO: Confirm DNS before launch. Preview deploys may use partyline-website.vercel.app until then.

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	integrations: [sitemap()],
	vite: {
		resolve: {
			alias: {
				'@': srcDir
			}
		}
	}
});
