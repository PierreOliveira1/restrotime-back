import { mergeObjects } from '.';

describe('mergeObjects', () => {
	it('should be defined', () => {
		expect(mergeObjects).toBeDefined();
	});

	it('should be able to merge objects', () => {
		expect(mergeObjects({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
	});

	it('should be able to merge objects with same keys', () => {
		expect(mergeObjects({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
	});

	it('should be able to merge objects with same keys and different values', () => {
		const obj1 = {
			a: 1,
			b: {
				c: 2,
				d: [1, 2, 3],
			}
		};

		const obj2 = {
			a: 2,
			b: {
				e: 3,
				d: [4, 5, 6],
				f: {
					g: 4,
				},
			},
		};

		expect(mergeObjects(obj1, obj2)).toEqual({
			a: 2,
			b: {
				c: 2,
				d: [1, 2, 3, 4, 5, 6],
				e: 3,
				f: {
					g: 4,
				},
			},
		});
	});
});
