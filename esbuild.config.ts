import { build } from 'esbuild';
import { dependencies } from './package.json';

build({
	entryPoints: ['src/index.ts'],
	bundle: true,
	minify: true,
	target: ["node14"],
	external: Object.keys(dependencies),
	platform: 'node',
	outfile: 'dist/index.js',
});
