import { paginationValidator } from './index';

describe('pagination Validator', () => {
	it('should be able to validate pagination', () => {
		const pagination = paginationValidator.parse({
			page: 1,
			limit: 10,
		});

		expect(pagination).toEqual({ page: 1, limit: 10 });
	});

	it('should be able to validate pagination with default values', () => {
		const pagination = paginationValidator.parse({});

		expect(pagination).toEqual({ page: 1, limit: 10 });
	});

	it('should throw an error for invalid pagination', () => {
		expect(() => {
			paginationValidator.parse({
				page: 'abc',
				limit: '-10',
			});
		}).toThrowError();
	});
});
