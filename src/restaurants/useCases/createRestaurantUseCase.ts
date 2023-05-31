import { prisma } from '@database';
import { GetRestaurantResponse } from '../dto/getRestaurant.dto';
import { CreateRestaurant } from '../validators/createRestaurant';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';
import { CacheManager } from '@/utils/cache';

const cache = CacheManager();

export async function createRestaurantUseCase(
	restaurant: CreateRestaurant,
): Promise<GetRestaurantResponse> {
	try {
		const restaurantExists = await prisma.restaurant.findFirst({
			where: {
				cnpj: restaurant.cnpj,
			},
		});

		if (restaurantExists) {
			throw new HTTPRequestError('Restaurante já está cadastrado', 400);
		}

		const createdRestaurant = await prisma.restaurant.create({
			data: {
				fantasyName: restaurant.fantasyName,
				corporateName: restaurant.corporateName,
				cnpj: restaurant.cnpj,
				email: restaurant.email,
				phoneNumber: restaurant.phoneNumber,
				type: restaurant.type,
				address: {
					create: {
						...restaurant.address,
					},
				},
			},
			include: {
				address: true,
				schedules: true,
			},
		});

		cache.set(`restaurant:${createdRestaurant.id}`, createdRestaurant);
		cache.delMatch('^restaurants:');
		cache.delMatch('^search:');

		return createdRestaurant;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError('Erro ao criar restaurante', 500);
		}

		throw error;
	}
}
