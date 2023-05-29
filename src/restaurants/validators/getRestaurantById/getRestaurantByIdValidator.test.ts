import { getRestaurantByIdValidator } from '.';

describe('getRestaurantByIdValidator', () => {
	it('should validate a valid id', () => {
		const validId = 'c5f4b6f6-2d9e-4a9e-8d7a-6d1f5e9b9a6b';

		expect(() => getRestaurantByIdValidator.parse({ id: validId })).not.toThrow();
	});

	it('should not validate an invalid id', () => {
		const invalidId = 'invalid-id';

		expect(() => getRestaurantByIdValidator.parse({ id: invalidId })).toThrow();
	});

	it('should not validate an empty id', () => {
		const emptyId = '';

		expect(() => getRestaurantByIdValidator.parse({ id: emptyId })).toThrow();
	});

	it('should not validate a null id', () => {
		const nullId = null;

		expect(() => getRestaurantByIdValidator.parse({ id: nullId })).toThrow();
	});

	it('should not validate an undefined id', () => {
		const undefinedId = undefined;

		expect(() => getRestaurantByIdValidator.parse({ id: undefinedId })).toThrow();
	});

	it('should not validate an id with more than 36 characters', () => {
		const invalidId = 'c5f4b6f6-2d9e-4a9e-8d7a-6d1f5e9b9a6b-invalid';

		expect(() => getRestaurantByIdValidator.parse({ id: invalidId })).toThrow();
	});

	it('should not validate an id with less than 36 characters', () => {
		const invalidId = 'c5f4b6f6-2d9e-4a9e-8d7a-6d1f5e9b9a6';

		expect(() => getRestaurantByIdValidator.parse({ id: invalidId })).toThrow();
	});
});
