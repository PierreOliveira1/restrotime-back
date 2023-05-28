import {
	createRestaurant,
	getRestaurants,
	getRestaurantById,
	updateRestaurantById,
	deleteRestaurantById,
} from './restaurants.services';
import {
	createRestaurantUseCase,
	deleteRestaurantByIdUseCase,
	getRestaurantByIdUseCase,
	getRestaurantsUseCase,
	updateRestaurantByIdUseCase,
} from './useCases';
import { CreateRestaurant } from './validators/createRestaurant';

jest.mock('./useCases');

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
		await createRestaurant(restaurantData);
		expect(createRestaurantUseCase).toHaveBeenCalledWith(restaurantData);
	});

	it('should call getRestaurantsUseCase with the provided pagination data', async () => {
		await getRestaurants(paginationData);
		expect(getRestaurantsUseCase).toHaveBeenCalledWith(paginationData);
	});

	it('should call getRestaurantByIdUseCase with the provided restaurant id', async () => {
		const restaurantId = '123456';
		await getRestaurantById(restaurantId);
		expect(getRestaurantByIdUseCase).toHaveBeenCalledWith(restaurantId);
	});

	it('should call updateRestaurantByIdUseCase with the provided restaurant id and data', async () => {
		const restaurantId = '123456';

		await updateRestaurantById(restaurantId, restaurantData);
		expect(updateRestaurantByIdUseCase).toHaveBeenCalledWith(
			restaurantId,
			restaurantData,
		);
	});

	it('should call deleteRestaurantByIdUseCase with the provided restaurant id', async () => {
		const restaurantId = '123456';
		await deleteRestaurantById(restaurantId);
		expect(deleteRestaurantByIdUseCase).toHaveBeenCalledWith(restaurantId);
	});
});
