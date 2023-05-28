import { Address } from '@prisma/client';
import { CreateRestaurant } from '../validators/createRestaurant';

export interface UpdateRestaurantDto
	extends Partial<Omit<CreateRestaurant, 'schedules' | 'address'>> {
	address?: Partial<Address>;
}
