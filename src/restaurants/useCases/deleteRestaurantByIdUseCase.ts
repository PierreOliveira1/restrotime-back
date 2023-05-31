import { prisma } from '@database';
import { CacheManager } from '@/utils/cache';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';

const cache = CacheManager();

export async function deleteRestaurantByIdUseCase(id: string) {
	try {
		const restaurantExists = await prisma.restaurant.findUnique({
			where: {
				id,
			},
		});

		if (!restaurantExists) {
			throw new HTTPRequestError('Restaurante não encontrado', 404);
		}

		const deleteRestaurant = prisma.restaurant.delete({
			where: {
				id,
			},
		});

		const deleteAddress = prisma.address.delete({
			where: {
				restaurantId: id,
			},
		});

		const deleteSchedules = prisma.schedule.deleteMany({
			where: {
				restaurantId: id,
			},
		});

		const [, , restaurant] = await prisma.$transaction([
			deleteAddress,
			deleteSchedules,
			deleteRestaurant,
		]);

		if (cache.has(`restaurant:${restaurant.id}`)) {
			cache.del(`restaurant:${restaurant.id}`);
		}
		cache.delMatch('^restaurants:');
		cache.delMatch('^search:');

		return restaurant;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError('Erro ao deletar restaurante', 500);
		}

		throw error;
	}
}
