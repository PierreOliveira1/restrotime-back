import { prisma } from '@database';
import { CacheManager } from '@/utils/cache';
import { getRestaurantByIdUseCase } from './getRestaurantByIdUseCase';
import { GetRestaurantResponse } from '../dto/getRestaurant.dto';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { CreateRestaurant } from '../validators/createRestaurant';

describe('getRestaurantById', () => {
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
		const createdRestaurant = await prisma.restaurant.create({
			data: {
				...restaurantData,
				address: {
					create: restaurantData.address,
				},
			},
		});
		id = createdRestaurant.id;
		cache.delMatch('^restaurant:');
	}, 20000);

	afterAll(async () => {
		await prisma.$transaction([
			prisma.address.deleteMany(),
			prisma.restaurant.deleteMany(),
		]);
		cache.delMatch('^restaurant:');
	}, 20000);

	it('should be able to get restaurant by id', async () => {
		const restaurant = await getRestaurantByIdUseCase(id);

		expect(restaurant).toHaveProperty('id');
		expect(restaurant.fantasyName).toBe(restaurantData.fantasyName);
		expect(restaurant.cnpj).toBe(restaurantData.cnpj);
		expect(restaurant.corporateName).toBe(restaurantData.corporateName);
		expect(restaurant.email).toBe(restaurantData.email);
		expect(restaurant.phoneNumber).toBe(restaurantData.phoneNumber);
		expect(restaurant.type).toBe(restaurantData.type);
		expect(restaurant.address).toHaveProperty('id');
		expect(restaurant.address?.street).toBe(restaurantData.address.street);
		expect(restaurant.address?.city).toBe(restaurantData.address.city);
		expect(restaurant.address?.complement).toBe(
			restaurantData.address.complement,
		);
		expect(restaurant.address?.district).toBe(restaurantData.address.district);
		expect(restaurant.address?.number).toBe(restaurantData.address.number);
		expect(restaurant.address?.state).toBe(restaurantData.address.state);
		expect(restaurant.address?.zipCode).toBe(restaurantData.address.zipCode);
	});

	it('should be able to get restaurant by id with cache', async () => {
		const cacheKey = `restaurant:${id}`;

		const cached = cache.get<GetRestaurantResponse>(cacheKey);

		expect(cached).toHaveProperty('id');
		expect(cached?.fantasyName).toBe(restaurantData.fantasyName);
		expect(cached?.cnpj).toBe(restaurantData.cnpj);
		expect(cached?.corporateName).toBe(restaurantData.corporateName);
		expect(cached?.email).toBe(restaurantData.email);
		expect(cached?.phoneNumber).toBe(restaurantData.phoneNumber);
		expect(cached?.type).toBe(restaurantData.type);
		expect(cached?.address).toHaveProperty('id');
		expect(cached?.address?.street).toBe(restaurantData.address.street);
		expect(cached?.address?.city).toBe(restaurantData.address.city);
		expect(cached?.address?.complement).toBe(restaurantData.address.complement);
		expect(cached?.address?.district).toBe(restaurantData.address.district);
		expect(cached?.address?.number).toBe(restaurantData.address.number);
		expect(cached?.address?.state).toBe(restaurantData.address.state);
		expect(cached?.address?.zipCode).toBe(restaurantData.address.zipCode);
	});

	it('should give an error that the restaurant does not exist', async () => {
		try {
			await getRestaurantByIdUseCase('3b8e5b9a-0a7c-4e6e-8e5b-9a0a7c4e6e8e');
		} catch (error) {
			expect(error).toHaveProperty('message');
			expect(error).toHaveProperty('statusCode');
			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Restaurante não encontrado');
				expect(error.statusCode).toBe(404);
			}
		}
	});

	it('should give an error that the restaurant id is invalid', async () => {
		try {
			await getRestaurantByIdUseCase('invalid-id');
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);
		}
	});
});
