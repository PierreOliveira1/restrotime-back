import type { Config } from 'jest';
import { resolve } from 'node:path';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFiles: ['dotenv/config'],
	modulePaths: ['<rootDir>/src/'],
	rootDir: './',
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	testMatch: ['**/?(*.)+(spec|test).[t]s?(x)'],
	moduleNameMapper: {
		'^@/(.*)$': resolve(__dirname, 'src/$1'),
		'^@/database': resolve(__dirname, 'src/database/index.ts'),
	},
};

export default config;
