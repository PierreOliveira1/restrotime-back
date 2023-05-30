import { isOpenRestaurantValidator } from '.';

describe('isOpenRestaurantValidator', () => {
	it('should validate a valid datetime', () => {
		const validDatetime = '2021-08-01T12:00:00.000Z';

		expect(() =>
			isOpenRestaurantValidator.parse({ datetime: validDatetime }),
		).not.toThrow();
	});

	it('should not validate an invalid datetime', () => {
		const invalidDatetime = 'invalid-datetime';

		expect(() =>
			isOpenRestaurantValidator.parse({ datetime: invalidDatetime }),
		).toThrow();
	});

	it('should not validate an empty datetime', () => {
		const emptyDatetime = '';

		expect(() =>
			isOpenRestaurantValidator.parse({ datetime: emptyDatetime }),
		).toThrow();
	});

	it('should not validate a null datetime', () => {
		const nullDatetime = null;

		expect(() =>
			isOpenRestaurantValidator.parse({ datetime: nullDatetime }),
		).toThrow();
	});

	it('should not validate an undefined datetime', () => {
		const undefinedDatetime = undefined;

		expect(() =>
			isOpenRestaurantValidator.parse({ datetime: undefinedDatetime }),
		).toThrow();
	});
});
