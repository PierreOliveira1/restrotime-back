import { Prisma } from '@prisma/client';
import { GetRestaurantsResponse } from './dto/getRestaurants.dto';
import { getRestaurants } from './restaurants.services';
import { CacheManager } from '@/utils/cache';

describe('Restaurants Services', () => {
	const cache = CacheManager();

	beforeAll(async () => {
		cache.delMatch('^restaurants:');
	});

	it('should be able to get restaurants', async () => {
		const restaurants = await getRestaurants({ page: 1, limit: 10 });

		expect(restaurants).toHaveProperty('data');
		expect(Array.isArray(restaurants.data)).toBeTruthy();
		expect(restaurants).toHaveProperty('pagination');
		expect(restaurants.pagination).toHaveProperty('totalPages');
		expect(restaurants.pagination).toHaveProperty('currentPage');
		expect(restaurants.pagination).toHaveProperty('nextPage');

	}, 20000);

	it('should be able to get restaurants with cache', async () => {
		const cacheKey = `restaurants:${1}:${10}`;

		if (cache.has(cacheKey)) {
			const cached = cache.get<GetRestaurantsResponse>(cacheKey);

			if (cached) {
				expect(cached).toHaveProperty('data');
				expect(Array.isArray(cached.data)).toBeTruthy();
				expect(cached).toHaveProperty('pagination');
				expect(cached.pagination).toHaveProperty('totalPages');
				expect(cached.pagination).toHaveProperty('currentPage');
				expect(cached.pagination).toHaveProperty('nextPage');
			}
		}
	});

	it('should be get restaurants with page 0', async () => {
		try	{
			await getRestaurants({ page: 0, limit: 10 });
		} catch (error) {
			expect(error).toBeInstanceOf(Prisma.PrismaClientUnknownRequestError);
		}
	});

	it('should be get restaurants with limit 0', async () => {
		try	{
			await getRestaurants({ page: 1, limit: 0 });
		} catch (error) {
			expect(error).toBeInstanceOf(Prisma.PrismaClientUnknownRequestError);
		}
	});
});
