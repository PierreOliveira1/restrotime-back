import { CacheManager } from '@/utils/cache';
import { GetRestaurantResponse } from '../dto/getRestaurant.dto';
import { prisma } from '@database';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';

const cache = CacheManager();

export async function getRestaurantByIdUseCase(
	id: string,
): Promise<GetRestaurantResponse> {
	try {
		const cacheKey = `restaurant:${id}`;

		if (cache.has(cacheKey)) {
			const cached = cache.get<GetRestaurantResponse>(cacheKey);
			if (cached) return cached;
		}

		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id,
			},
			include: {
				address: true,
				schedules: true,
			},
		});

		if (!restaurant) {
			throw new HTTPRequestError('Restaurante não encontrado', 404);
		}

		cache.set(cacheKey, restaurant);

		return restaurant;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError('Erro ao buscar restaurante', 500);
		}

		throw error;
	}
}
