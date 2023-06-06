import { build } from 'esbuild';
import { dependencies } from './package.json';

build({
	entryPoints: ['src/index.ts'],
	bundle: true,
	minify: true,
	external: Object.keys(dependencies),
	platform: 'node',
	outfile: 'dist/index.js',
});
