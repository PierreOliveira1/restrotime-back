import { ZodError } from 'zod';
import { mapIssuesZodError } from '.';

describe('mapIssuesZodError', () => {
	it('should be defined', () => {
		expect(mapIssuesZodError).toBeDefined();
	});

	it('should be able to map issues', () => {
		const error: ZodError = new ZodError([
			{
				code: 'invalid_type',
				expected: 'string',
				received: 'number',
				path: ['test'],
				message: 'Expected string, received number',
			},
		]);

		expect(mapIssuesZodError(error)).toEqual([
			{
				path: 'test',
				message: 'Expected string, received number',
			},
		]);
	});

	it('should be able to map issues with multiple paths', () => {
		const error: ZodError = new ZodError([
			{
				code: 'invalid_type',
				expected: 'string',
				received: 'number',
				path: ['test'],
				message: 'Expected string, received number',
			},
			{
				code: 'invalid_type',
				expected: 'string',
				received: 'number',
				path: ['test2'],
				message: 'Expected string, received number',
			},
		]);

		expect(mapIssuesZodError(error)).toEqual([
			{
				path: 'test',
				message: 'Expected string, received number',
			},
			{
				path: 'test2',
				message: 'Expected string, received number',
			},
		]);
	});

	it('should be able to map issues with multiple paths and multiple errors', () => {
		const error: ZodError = new ZodError([
			{
				code: 'invalid_type',
				expected: 'string',
				received: 'number',
				path: ['test'],
				message: 'Expected string, received number',
			},
			{
				code: 'invalid_type',
				expected: 'string',
				received: 'number',
				path: ['test2', 'test3'],
				message: 'Expected string, received number',
			},
			{
				code: 'invalid_type',
				expected: 'string',
				received: 'number',
				path: ['test3'],
				message: 'Expected string, received number',
			},
		]);

		expect(mapIssuesZodError(error)).toEqual([
			{
				path: 'test',
				message: 'Expected string, received number',
			},
			{
				path: 'test2.test3',
				message: 'Expected string, received number',
			},
			{
				path: 'test3',
				message: 'Expected string, received number',
			},
		]);
	});
});
