import { prisma } from '@database';
import { Prisma } from '@prisma/client';
import { PaginationValidator } from '@/validators/paginationValidator';
import { CacheManager } from '@/utils/cache';

async function getRestaurants({ page, limit }: PaginationValidator) {
	try {
		const cache = CacheManager();
		const cacheKey = `restaurants:${page}:${limit}`;

		if (cache.has(cacheKey)) {
			const cached = cache.get(cacheKey);
			return cached;
		}

		const restaurants = await prisma.restaurant.findMany({
			skip: page * limit - limit,
			take: limit,
			include: {
				address: true,
			},
		});

		const total = await prisma.restaurant.count();
		const totalPages = Math.ceil(total / limit);
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
			throw new Error('Erro ao buscar comércios');
		}

		throw error;
	}
}

export { getRestaurants };