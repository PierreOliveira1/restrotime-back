import NodeCache from 'node-cache';

const cache = new NodeCache();

export function CacheManager() {
	function set<T>(key: string, value: T, ttl = 60 * 5) {
		return cache.set(key, value, ttl);
	}

	function get<T>(key: string) {
		return cache.get<T>(key);
	}

	function getMany<T>(keys: string[]) {
		return cache.mget<T>(keys);
	}

	function del(key: string | string[]) {
		return cache.del(key);
	}

	function delMatch(pattern: string) {
		const keys = cache.keys();
		const keysToDelete = keys.filter((key) => key.match(pattern));

		return cache.del(keysToDelete);
	}

	function flush() {
		return cache.flushAll();
	}

	function has(key: string) {
		return cache.has(key);
	}

	function keys() {
		return cache.keys();
	}

	return {
		set,
		get,
		getMany,
		del,
		delMatch,
		flush,
		has,
		keys,
	};
}
