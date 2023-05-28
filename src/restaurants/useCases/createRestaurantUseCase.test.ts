import { CacheManager } from '@/utils/cache';
import { CreateRestaurant } from '../validators/createRestaurant';
import { createRestaurantUseCase } from './createRestaurantUseCase';
import { GetRestaurantResponse } from '../dto/getRestaurant.dto';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { prisma } from '@/database';

describe('createRestaurant', () => {
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

	afterAll(async () => {
		await prisma.$transaction([
			prisma.address.deleteMany(),
			prisma.restaurant.deleteMany(),
		]);
		cache.delMatch('^restaurant:');
	}, 20000);

	it('should create a new restaurant and return it', async () => {
		const createdRestaurant = await createRestaurantUseCase(restaurantData);
		id = createdRestaurant.id;

		expect(createdRestaurant).toHaveProperty('id');
		expect(createdRestaurant.fantasyName).toBe(restaurantData.fantasyName);
		expect(createdRestaurant.cnpj).toBe(restaurantData.cnpj);
		expect(createdRestaurant.corporateName).toBe(restaurantData.corporateName);
		expect(createdRestaurant.email).toBe(restaurantData.email);
		expect(createdRestaurant.phoneNumber).toBe(restaurantData.phoneNumber);
		expect(createdRestaurant.type).toBe(restaurantData.type);
		expect(createdRestaurant.address).toHaveProperty('id');
		expect(createdRestaurant.address?.street).toBe(
			restaurantData.address.street,
		);
		expect(createdRestaurant.address?.city).toBe(restaurantData.address.city);
		expect(createdRestaurant.address?.complement).toBe(
			restaurantData.address.complement,
		);
		expect(createdRestaurant.address?.district).toBe(
			restaurantData.address.district,
		);
		expect(createdRestaurant.address?.number).toBe(
			restaurantData.address.number,
		);
		expect(createdRestaurant.address?.state).toBe(restaurantData.address.state);
		expect(createdRestaurant.address?.zipCode).toBe(
			restaurantData.address.zipCode,
		);
	}, 30000);

	it('should be return it with cache', async () => {
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

	it('should give an error that the restaurant already exists', async () => {
		try {
			await createRestaurantUseCase(restaurantData);
		} catch (error) {
			if (error instanceof HTTPRequestError) {
				expect(error).toHaveProperty('message');
				expect(error.message).toBe('Restaurante já está cadastrado');
				expect(error).toHaveProperty('statusCode');
				expect(error.statusCode).toBe(400);
			}
		}
	});
});
