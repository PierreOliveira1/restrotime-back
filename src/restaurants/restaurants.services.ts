import { PaginationValidator } from '@/validators/paginationValidator';
import { GetRestaurantsResponse } from './dto/getRestaurants.dto';
import { CreateRestaurant } from './validators/createRestaurant';
import { GetRestaurantResponse } from './dto/getRestaurant.dto';
import { UpdateRestaurantDto } from './dto/updateRestaurant.dto';
import {
	createRestaurantUseCase,
	deleteRestaurantByIdUseCase,
	getRestaurantByIdUseCase,
	getRestaurantsUseCase,
	searchRestaurantUseCase,
	updateRestaurantByIdUseCase,
} from './useCases';
import { isOpenRestaurantUseCase } from './useCases/isOpenRestaurantUseCase';
import { IsSelect } from './dto/isSelect.dto';

export function createRestaurant(
	restaurant: CreateRestaurant,
): Promise<GetRestaurantResponse> {
	return createRestaurantUseCase(restaurant);
}

export function getRestaurants(
	{ page, limit }: PaginationValidator,
	selects: IsSelect,
): Promise<GetRestaurantsResponse> {
	return getRestaurantsUseCase({ page, limit }, selects);
}

export function getRestaurantById(id: string): Promise<GetRestaurantResponse> {
	return getRestaurantByIdUseCase(id);
}

export function updateRestaurantById(
	id: string,
	data: UpdateRestaurantDto,
): Promise<GetRestaurantResponse> {
	return updateRestaurantByIdUseCase(id, data);
}

export function deleteRestaurantById(id: string) {
	return deleteRestaurantByIdUseCase(id);
}

export function isOpenRestaurant(id: string, datetime: string) {
	return isOpenRestaurantUseCase(id, datetime);
}

export function searchRestaurant(
	search: string,
	pagination: PaginationValidator,
) {
	return searchRestaurantUseCase(search, pagination);
}
