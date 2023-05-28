import { Address, Restaurant, Schedule } from '@prisma/client';

type RestaurantWithAddress = Restaurant & {
	address: Address | null;
	schedules: Schedule[];
};

export interface GetRestaurantsResponse {
	data: RestaurantWithAddress[];
	pagination: {
		totalPages: number;
		currentPage: number;
		nextPage: number | null;
	};
}
