import { CacheManager } from '@/utils/cache';
import { CreateRestaurant } from '../validators/createRestaurant';
import { updateRestaurantByIdUseCase } from './updateRestaurantByIdUseCase';
import { prisma } from '@/database';
import { HTTPRequestError } from '@/utils/httpRequestError';

describe('updateRestaurant', () => {
	const cache = CacheManager();
	let id: string;
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
		const createdRestaurant = await prisma.restaurant.create({
			data: {
				...restaurantData,
				address: {
					create: restaurantData.address,
				},
			},
		});
		id = createdRestaurant.id;
	}, 20000);

	afterAll(async () => {
		await prisma.$transaction([
			prisma.address.deleteMany(),
			prisma.restaurant.deleteMany(),
		]);
		cache.delMatch('^restaurant:');
	});

	it('should be able to update restaurant', async () => {
		const updatedRestaurant = await updateRestaurantByIdUseCase(id, {
			fantasyName: 'Updated Restaurant',
			cnpj: '12345678901234',
			corporateName: 'Updated Restaurant LTDA',
			email: 'testando@gmail.com',
			phoneNumber: '12345678901',
			address: {
				street: 'Updated Street',
				city: 'Updated City',
			},
		});

		expect(updatedRestaurant).toHaveProperty('id');
		expect(updatedRestaurant.fantasyName).toBe('Updated Restaurant');
		expect(updatedRestaurant.cnpj).toBe('12345678901234');
		expect(updatedRestaurant.corporateName).toBe('Updated Restaurant LTDA');
		expect(updatedRestaurant.email).toBe('testando@gmail.com');
		expect(updatedRestaurant.phoneNumber).toBe('12345678901');
		expect(updatedRestaurant.type).toBe(restaurantData.type);
		expect(updatedRestaurant.address).toHaveProperty('id');
		expect(updatedRestaurant.address?.street).toBe('Updated Street');
		expect(updatedRestaurant.address?.city).toBe('Updated City');
		expect(updatedRestaurant.address?.complement).toBe(
			restaurantData.address.complement,
		);
		expect(updatedRestaurant.address?.district).toBe(
			restaurantData.address.district,
		);
		expect(updatedRestaurant.address?.number).toBe(
			restaurantData.address.number,
		);
		expect(updatedRestaurant.address?.state).toBe(restaurantData.address.state);
		expect(updatedRestaurant.address?.zipCode).toBe(
			restaurantData.address.zipCode,
		);
	});

	it('should be able to update restaurant without address', async () => {
		const updatedRestaurant = await updateRestaurantByIdUseCase(id, {
			fantasyName: 'Updated Restaurant',
			cnpj: '12345678901234',
			corporateName: 'Updated Restaurant LTDA',
			email: 'pitter@gmail.com',
			phoneNumber: '12345678901',
		});

		expect(updatedRestaurant).toHaveProperty('id');
		expect(updatedRestaurant.fantasyName).toBe('Updated Restaurant');
		expect(updatedRestaurant.cnpj).toBe('12345678901234');
		expect(updatedRestaurant.corporateName).toBe('Updated Restaurant LTDA');
		expect(updatedRestaurant.email).toBe('pitter@gmail.com');
		expect(updatedRestaurant.phoneNumber).toBe('12345678901');
		expect(updatedRestaurant.type).toBe(restaurantData.type);
	});

	it('should not be able to update restaurant with invalid id', async () => {
		await expect(
			updateRestaurantByIdUseCase('invalid-id', {
				fantasyName: 'Updated Restaurant',
				cnpj: '12345678901234',
				corporateName: 'Updated Restaurant LTDA',
			}),
		).rejects.toThrow();

		await expect(
			updateRestaurantByIdUseCase('123', {
				fantasyName: 'Updated Restaurant',
				cnpj: '12345678901234',
			}),
		).rejects.toThrow();

		await expect(
			updateRestaurantByIdUseCase('123456789012345678901234', {
				fantasyName: 'Updated Restaurant',
			}),
		).rejects.toThrow();
	});

	it('should be able not exist restaurant with id', async () => {
		try {
			await updateRestaurantByIdUseCase('7982fcfe-5721-4632-bede-6000885be57d', {
				fantasyName: 'Updated Restaurant',
			});
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
});
