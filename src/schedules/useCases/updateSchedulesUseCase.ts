import { prisma } from '@/database';
import { UpdateSchedules } from '../dto/updateSchedules.dto';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';
import { CacheManager } from '@/utils/cache';

export async function updateSchedulesUseCase(id: string, data: UpdateSchedules) {
	try {
		const cache = CacheManager();
		const cacheKey = `schedules:${id}`;

		if (!data.length) {
			throw new HTTPRequestError('Nenhum horário informado', 400);
		}

		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id,
			},
			include: {
				schedules: true,
			},
		});

		if (!restaurant) {
			throw new HTTPRequestError('Restaurante não encontrado', 404);
		}

		const schedulesWithDaysUnique: UpdateSchedules = data.filter(
			(schedule, index, self) =>
				self.findIndex((s) => s.dayOfWeek === schedule.dayOfWeek) === index,
		);

		if (schedulesWithDaysUnique.length !== data.length) {
			throw new HTTPRequestError(
				'Não é possível ter dois horários no mesmo dia',
				400,
			);
		}

		schedulesWithDaysUnique.forEach((schedule) => {
			const validateSchedule = (openingTime: string, closingTime: string) => {
				const hour = (time: string) => {
					const [h, m, s] = time.split(':').map(Number);
					return new Date().setHours(h, m, s);
				};

				if (hour(openingTime) > hour(closingTime)) {
					throw new HTTPRequestError(
						'Horário de abertura não pode ser maior que o de fechamento',
						400,
					);
				}

				if (openingTime === closingTime) {
					throw new HTTPRequestError(
						'Horário de abertura não pode ser igual ao de fechamento',
						400,
					);
				}
			};

			validateSchedule(schedule.openingTime, schedule.closingTime);

			if (schedule.openingTime2 && schedule.closingTime2) {
				validateSchedule(schedule.openingTime2, schedule.closingTime2);

				if (schedule.closingTime > schedule.openingTime2) {
					throw new HTTPRequestError(
						'Horário de fechamento não pode ser maior que o de abertura',
						400,
					);
				}
			}
		});

		const schedules = await prisma.$transaction(
			data.map((schedule) =>
				prisma.schedule.update({
					where: {
						id: schedule.id,
					},
					data: {
						openingTime: schedule.openingTime,
						closingTime: schedule.closingTime,
						openingTime2: schedule.openingTime2,
						closingTime2: schedule.closingTime2,
						updatedAt: new Date(),
					},
				}),
			),
		);

		cache.del(cacheKey);
		cache.del(`restaurant:${id}`);
		cache.delMatch('^restaurants:');
		cache.set(cacheKey, schedules);

		return schedules;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError('Erro ao atualizar horários', 400);
		}

		throw error;
	}
}
