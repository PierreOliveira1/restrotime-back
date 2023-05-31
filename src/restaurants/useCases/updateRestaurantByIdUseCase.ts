import { CacheManager } from '@/utils/cache';
import { UpdateRestaurantDto } from '../dto/updateRestaurant.dto';
import { GetRestaurantResponse } from '../dto/getRestaurant.dto';
import { prisma } from '@database';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';

const cache = CacheManager();

export async function updateRestaurantByIdUseCase(
	id: string,
	data: UpdateRestaurantDto,
): Promise<GetRestaurantResponse> {
	try {
		const restaurantExists = await prisma.restaurant.findUnique({
			where: {
				id,
			},
		});

		if (!restaurantExists) {
			throw new HTTPRequestError('Restaurante não encontrado', 404);
		}

		const restaurant = await prisma.restaurant.update({
			where: {
				id,
			},
			data: {
				fantasyName: data.fantasyName,
				corporateName: data.corporateName,
				cnpj: data.cnpj,
				email: data.email,
				phoneNumber: data.phoneNumber,
				type: data.type,
				address: {
					update: {
						...data.address,
					},
				},
			},
			include: {
				address: true,
				schedules: true,
			},
		});

		if (cache.has(`restaurant:${restaurant.id}`)) {
			cache.del(`restaurant:${restaurant.id}`);
		}

		cache.set(`restaurant:${restaurant.id}`, restaurant);
		cache.delMatch('^restaurants:');
		cache.delMatch('^search:');

		return restaurant;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError('Erro ao atualizar restaurante', 500);
		}

		throw error;
	}
}
