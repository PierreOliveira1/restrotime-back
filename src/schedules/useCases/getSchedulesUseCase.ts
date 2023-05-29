import { prisma } from '@/database';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';

export async function getSchedulesUseCase(id: string) {
	try {
		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
			},
		});

		if (!restaurant) {
			throw new HTTPRequestError('Restaurante não encontrado', 404);
		}

		const schedules = await prisma.schedule.findMany({
			where: {
				restaurantId: id,
			},
		});

		if (!schedules.length) {
			throw new HTTPRequestError('Nenhum horário encontrado', 404);
		}

		return schedules;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError('Erro ao buscar horários', 400);
		}

		throw error;
	}
}
