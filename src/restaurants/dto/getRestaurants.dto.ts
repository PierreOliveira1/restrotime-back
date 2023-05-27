import { Address, Restaurant } from '@prisma/client';

type RestaurantWithAddress = Restaurant & {
	address: Address | null;
};

export interface GetRestaurantsResponse {
	data: RestaurantWithAddress[];
	pagination: {
		totalPages: number;
		currentPage: number;
		nextPage: number | null;
	};
}
