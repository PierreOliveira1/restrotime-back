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
		'^@config/(.*)$': resolve(__dirname, 'src/config/$1'),
	},
};

export default config;
