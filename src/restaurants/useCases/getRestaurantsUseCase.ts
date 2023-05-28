import { CacheManager } from '@/utils/cache';
import { PaginationValidator } from '@/validators/paginationValidator';
import { GetRestaurantsResponse } from '../dto/getRestaurants.dto';
import { prisma } from '@database';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';

const cache = CacheManager();

export async function getRestaurantsUseCase({
	page,
	limit,
}: PaginationValidator): Promise<GetRestaurantsResponse> {
	try {
		const cacheKey = `restaurants:${page}:${limit}`;

		if (cache.has(cacheKey)) {
			const cached = cache.get<GetRestaurantsResponse>(cacheKey);

			if (cached) {
				return cached;
			}
		}

		const restaurants = await prisma.restaurant.findMany({
			skip: page * limit - limit,
			take: limit,
			include: {
				address: true,
				schedules: true,
			},
		});

		const total = await prisma.restaurant.count();
		const totalPages = Math.ceil(total / limit);

		if (page > totalPages && page !== 1) {
			throw new HTTPRequestError('A página solicitada não existe', 404);
		}

		const currentPage = page;
		const nextPage = currentPage + 1 > totalPages ? null : currentPage + 1;

		const data: GetRestaurantsResponse = {
			data: restaurants,
			pagination: {
				totalPages,
				currentPage,
				nextPage,
			},
		};

		cache.set(cacheKey, data);

		return data;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError('Erro ao buscar restaurantes', 500);
		}

		throw error;
	}
}
