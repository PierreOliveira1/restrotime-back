import { prisma } from '@/database';
import { CreateSchedule } from '../dto/createSchedule.dto';
import { Prisma } from '@prisma/client';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { CacheManager } from '@/utils/cache';

export async function createSchedulesUseCase(
	restaurantId: string,
	schedules: CreateSchedule,
) {
	try {
		const cache = CacheManager();
		const cacheKey = `schedules:${restaurantId}`;
		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id: restaurantId,
			},
			include: {
				schedules: true,
			},
		});

		if (!restaurant) {
			throw new HTTPRequestError('Restaurante não encontrado', 404);
		}

		if (restaurant.schedules.length > 0) {
			throw new HTTPRequestError(
				'Os horários de funcionamento já foram cadastrados',
				400,
			);
		}

		const schedulesWithDaysUnique: CreateSchedule = schedules.filter(
			(schedule, index, self) =>
				self.findIndex((s) => s.dayOfWeek === schedule.dayOfWeek) === index,
		);

		if (schedulesWithDaysUnique.length !== schedules.length) {
			throw new HTTPRequestError(
				'Não é possível ter dois horários no mesmo dia',
				400,
			);
		}

		const allDays = schedulesWithDaysUnique.map(
			(schedule) => schedule.dayOfWeek,
		);

		const days = [0, 1, 2, 3, 4, 5, 6];

		const daysNotInSchedules = days.every((day) => allDays.includes(day));

		if (!daysNotInSchedules) {
			throw new HTTPRequestError(
				'Deve haver horários de funcionamento para todos os dias da semana',
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

		if (schedulesWithDaysUnique.length > 7) {
			throw new HTTPRequestError(
				'Não é possível ter mais de 7 dias de funcionamento',
				400,
			);
		}

		if (schedulesWithDaysUnique.length < 7) {
			throw new HTTPRequestError(
				'Deve haver horários de funcionamento para todos os dias da semana',
				400,
			);
		}

		const schedulesCreated = await prisma.schedule.createMany({
			data: schedules.map((schedule) => ({
				...schedule,
				restaurantId,
			})),
		});

		cache.del(cacheKey);
		cache.del(`restaurant:${restaurantId}`);
		cache.delMatch('^restaurants:');

		return schedulesCreated;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError('Erro ao criar horários', 400);
		}

		throw error;
	}
}
