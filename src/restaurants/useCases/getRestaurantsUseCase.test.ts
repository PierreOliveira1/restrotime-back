import { CacheManager } from '@/utils/cache';
import { getRestaurantsUseCase } from './getRestaurantsUseCase';
import { GetRestaurantsResponse } from '../dto/getRestaurants.dto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/database';
import { CreateRestaurant } from '../validators/createRestaurant';

describe('getRestaurants', () => {
	const cache = CacheManager();
	const restaurantData: CreateRestaurant = {
		fantasyName: 'Restaurant 1',
		cnpj: '12345678901234',
		corporateName: 'Restaurant 1 LTDA',
		email: 'teste@gmail.com',
		phoneNumber: '12345678901',
		type: 'FAST_FOOD',
		address: {
			street: 'Street 1',
			city: 'City 1',
			complement: 'Complement 1',
			district: 'District 1',
			number: 'Number 1',
			state: 'St',
			zipCode: '12345678',
		},
	};

	beforeAll(async () => {
		await prisma.restaurant.create({
			data: {
				...restaurantData,
				address: {
					create: restaurantData.address,
				},
			},
		});
		cache.delMatch('^restaurants:');
	}, 20000);

	afterAll(async () => {
		await prisma.$transaction([
			prisma.address.deleteMany(),
			prisma.restaurant.deleteMany(),
		]);
		cache.delMatch('^restaurants:');
	}, 20000);

	it('should be able to get restaurants', async () => {
		const restaurants = await getRestaurantsUseCase({ page: 1, limit: 10 });

		expect(restaurants).toHaveProperty('data');
		expect(Array.isArray(restaurants.data)).toBeTruthy();
		expect(restaurants.data.length).toBe(1);
		expect(restaurants).toHaveProperty('pagination');
		expect(restaurants.pagination).toHaveProperty('totalPages');
		expect(restaurants.pagination).toHaveProperty('currentPage');
		expect(restaurants.pagination).toHaveProperty('nextPage');
	}, 20000);

	it('should be able to get restaurants with cache', async () => {
		const cacheKey = `restaurants:${1}:${10}`;

		const cached = cache.get<GetRestaurantsResponse>(cacheKey);

		expect(cached).toHaveProperty('data');
		expect(Array.isArray(cached?.data)).toBeTruthy();
		expect(cached?.data.length).toBe(1);
		expect(cached).toHaveProperty('pagination');
		expect(cached?.pagination).toHaveProperty('totalPages');
		expect(cached?.pagination).toHaveProperty('currentPage');
		expect(cached?.pagination).toHaveProperty('nextPage');
	});

	it('should be get restaurants with page 0', async () => {
		try {
			await getRestaurantsUseCase({ page: 0, limit: 10 });
		} catch (error) {
			expect(error).toBeInstanceOf(Prisma.PrismaClientUnknownRequestError);
		}
	});

	it('should be get restaurants with limit 0', async () => {
		try {
			await getRestaurantsUseCase({ page: 1, limit: 0 });
		} catch (error) {
			expect(error).toBeInstanceOf(Prisma.PrismaClientUnknownRequestError);
		}
	});
});
