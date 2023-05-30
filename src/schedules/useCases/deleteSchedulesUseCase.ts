import { prisma } from '@/database';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';
import { DeleteSchedules } from '../dto/deleteSchedules.dto';
import { CacheManager } from '@/utils/cache';

export async function deleteSchedulesUseCase(id: DeleteSchedules) {
	try {
		const cache = CacheManager();
		const cacheKey = `schedules:${id}`;
		const schedules = await prisma.schedule.findMany({
			where: {
				id: {
					in: id,
				},
			},
		});

		if (schedules.length !== id.length) {
			throw new HTTPRequestError('Horário não encontrado', 404);
		}

		const deletedSchedules = await prisma.$transaction(
			id.map((id) =>
				prisma.schedule.update({
					where: {
						id,
					},
					data: {
						openingTime: null,
						closingTime: null,
						openingTime2: null,
						closingTime2: null,
					},
				}),
			),
		);

		cache.del(cacheKey);
		cache.del(`restaurant:${id}`);
		cache.delMatch('^restaurants:');

		return deletedSchedules;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError('Erro ao deletar horários', 400);
		}

		throw error;
	}
}
