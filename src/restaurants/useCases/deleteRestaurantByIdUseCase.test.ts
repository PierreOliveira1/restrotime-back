import { CacheManager } from '@/utils/cache';
import { prisma } from '@/database';
import { CreateRestaurant } from '../validators/createRestaurant';
import { deleteRestaurantByIdUseCase } from './deleteRestaurantByIdUseCase';
import { GetRestaurantResponse } from '../dto/getRestaurant.dto';
import { HTTPRequestError } from '@/utils/httpRequestError';

describe('deleteRestaurantByIdUseCase', () => {
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
	let id: string;

	beforeAll(async () => {
		const restaurant = await prisma.restaurant.create({
			data: {
				...restaurantData,
				address: {
					create: restaurantData.address,
				},
			},
		});
		id = restaurant.id;
	}, 20000);

	it('should be able to delete restaurant by id', async () => {
		const restaurant = await deleteRestaurantByIdUseCase(id);

		expect(restaurant).toHaveProperty('id');
		expect(restaurant.fantasyName).toBe(restaurantData.fantasyName);
		expect(restaurant.cnpj).toBe(restaurantData.cnpj);
		expect(restaurant.corporateName).toBe(restaurantData.corporateName);
		expect(restaurant.email).toBe(restaurantData.email);
		expect(restaurant.phoneNumber).toBe(restaurantData.phoneNumber);
		expect(restaurant.type).toBe(restaurantData.type);
	}, 20000);

	it('should be error if restaurant not found', async () => {
		try {
			await deleteRestaurantByIdUseCase(id);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);
			expect(error).toHaveProperty('message');
			expect(error).toHaveProperty('statusCode');

			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Restaurante não encontrado');
				expect(error.statusCode).toBe(404);
			}
		}
	});


	it('should be able to delete restaurant by id with cache', async () => {
		const cacheKey = `restaurant:${id}`;

		expect(cache.has(cacheKey)).toBeFalsy();
	});

	it('should be able to delete restaurant by id with cache', async () => {
		const cacheKey = `restaurant:${id}`;

		const cached = cache.get<GetRestaurantResponse>(cacheKey);

		expect(cached).toBeUndefined();
	});
});
