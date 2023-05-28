import { Address, Restaurant, Schedule } from '@prisma/client';

export interface GetRestaurantResponse extends Restaurant {
	address: Address | null;
	schedules: Schedule[];
}
