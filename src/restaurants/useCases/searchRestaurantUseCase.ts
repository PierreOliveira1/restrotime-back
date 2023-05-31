import { prisma } from '@/database';
import { CacheManager } from '@/utils/cache';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';
import { PaginationValidator } from '@/validators/paginationValidator';

export async function searchRestaurantUseCase(searchQuery: string, pagination: PaginationValidator) {
	try {
		const search = decodeURIComponent(searchQuery);
		const { page, limit } = pagination;
		const cache = CacheManager();
		const cacheKey = `search:${search}`;

		if (cache.has(cacheKey)) {
			return cache.get(cacheKey);
		}

		const restaurants = await prisma.restaurant.findMany({
			skip: page * limit - limit,
			take: limit,
			where: {
				OR: [
					{
						fantasyName: {
							contains: search,
							mode: 'insensitive',
						},
					},
					{
						corporateName: {
							contains: search,
							mode: 'insensitive',
						},
					},
				],
			},
			select: {
				id: true,
				fantasyName: true,
				corporateName: true,
			},
		});

		const total = await prisma.restaurant.count({
			where: {
				OR: [
					{
						fantasyName: {
							contains: search,
							mode: 'insensitive',
						},
					},
					{
						corporateName: {
							contains: search,
							mode: 'insensitive',
						},
					},
				],
			},
		});
		const totalPages = Math.ceil(total / limit);

		if (page > totalPages && page !== 1) {
			throw new HTTPRequestError('A página solicitada não existe', 404);
		}

		const currentPage = page;
		const nextPage = currentPage + 1 > totalPages ? null : currentPage + 1;

		const data = {
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
			throw new HTTPRequestError('Erro ao buscar restaurantes', 400);
		}

		throw error;
	}
}
