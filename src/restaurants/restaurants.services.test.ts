import { HTTPRequestError } from '@/utils/httpRequestError';
import * as restaurantsServices from './restaurants.services';
import * as useCases from './useCases';
import { CreateRestaurant } from './validators/createRestaurant';

jest.mock('./useCases', () => ({
	createRestaurantUseCase: jest.fn(),
	getRestaurantsUseCase: jest.fn(),
	getRestaurantByIdUseCase: jest.fn(),
	updateRestaurantByIdUseCase: jest.fn(),
	deleteRestaurantByIdUseCase: jest.fn(),
	isOpenRestaurantUseCase: jest.fn(),
}));

describe('Restaurant Services', () => {
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

	const paginationData = {
		page: 1,
		limit: 10,
	};

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should be createRestaurant should call createRestaurantUseCase with the provided restaurant data', async () => {
		await restaurantsServices.createRestaurant(restaurantData);
		expect(useCases.createRestaurantUseCase).toHaveBeenCalledWith(
			restaurantData,
		);
	});

	it('should call getRestaurantsUseCase with the provided pagination data', async () => {
		await restaurantsServices.getRestaurants(paginationData);
		expect(useCases.getRestaurantsUseCase).toHaveBeenCalledWith(paginationData);
	});

	it('should call getRestaurantByIdUseCase with the provided restaurant id', async () => {
		const restaurantId = '123456';
		await restaurantsServices.getRestaurantById(restaurantId);
		expect(useCases.getRestaurantByIdUseCase).toHaveBeenCalledWith(
			restaurantId,
		);
	});

	it('should call updateRestaurantByIdUseCase with the provided restaurant id and data', async () => {
		const restaurantId = '123456';

		await restaurantsServices.updateRestaurantById(
			restaurantId,
			restaurantData,
		);
		expect(useCases.updateRestaurantByIdUseCase).toHaveBeenCalledWith(
			restaurantId,
			restaurantData,
		);
	});

	it('should call deleteRestaurantByIdUseCase with the provided restaurant id', async () => {
		const restaurantId = '123456';
		await restaurantsServices.deleteRestaurantById(restaurantId);
		expect(useCases.deleteRestaurantByIdUseCase).toHaveBeenCalledWith(
			restaurantId,
		);
	});

	it('should call isOpenRestaurantUseCase with the correct arguments', async () => {
		const id = 'restaurant-id';
		const datetime = '2023-05-29T12:00:00.000Z';

		try {
			await restaurantsServices.isOpenRestaurant(id, datetime);
			expect(true).toBe(false);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);
			if (error instanceof HTTPRequestError) {
				expect(error.statusCode).toBe(404);
				expect(error.message).toBe('Restaurante não encontrado');
			}
		}
	}, 50000);
});
