import { CacheManager } from './index';

describe('Cache Manager', () => {
	const cache = CacheManager();

	it('should be able to set and get data from cache', () => {
		cache.set('test', 'test');

		expect(cache.get('test')).toBe('test');
	});

	it('should be able to check if cache has a key', () => {
		expect(cache.has('test')).toBeTruthy();
	});

	it('should be able to delete a key from cache', () => {
		cache.del('test');

		expect(cache.has('test')).toBeFalsy();
	});

	it('should be able to clear cache', () => {
		cache.set('test', 'test');
		cache.flush();

		expect(cache.has('test')).toBeFalsy();
	});

	it('should be able to get many keys from cache', () => {
		cache.set('test', 'test');
		cache.set('test2', 'test2');

		expect(cache.getMany(['test', 'test2'])).toEqual({ test: 'test', test2: 'test2' });
	});

	it('should be able to delete keys by pattern', () => {
		cache.delMatch('^test');

		expect(cache.has('test')).toBeFalsy();
		expect(cache.has('test2')).toBeFalsy();
	});

	it('should be able to get all keys from cache', () => {
		cache.set('test', 'test');
		cache.set('test2', 'test2');

		expect(cache.keys()).toEqual(['test', 'test2']);
	});

	it('should be able to set ttl for a key', () => {
		cache.set('test', 'test', 1);

		expect(cache.get('test')).toBe('test');

		setTimeout(() => {
			expect(cache.has('test')).toBeFalsy();
		}, 1000);
	});

	it('should be error if not exists key', () => {
		cache.flush();

		expect(cache.get('test')).toBeUndefined();
	});
});
