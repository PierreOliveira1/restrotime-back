import { prisma } from '@/database';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';

export async function isOpenRestaurantUseCase(id: string, datetime: string) {
	try {
		const resturant = await prisma.restaurant.findUnique({
			where: {
				id,
			},
			include: {
				schedules: true,
			},
		});

		if (!resturant) {
			throw new HTTPRequestError('Restaurante não encontrado', 404);
		}

		const day = new Date(datetime).getDay();

		const schedule = resturant.schedules.find(
			(schedule) => schedule.dayOfWeek === day,
		);

		if (!schedule) {
			throw new HTTPRequestError('Horário não encontrado', 404);
		}

		if (schedule.openingTime === null || schedule.closingTime === null) {
			return false;
		}

		const openingTimeHours = schedule.openingTime.split(':').map(Number);
		const openingTime = new Date().setHours(
			openingTimeHours[0],
			openingTimeHours[1],
			openingTimeHours[2],
		);

		const closingTimeHours = schedule.closingTime.split(':').map(Number);
		const closingTime = new Date().setHours(
			closingTimeHours[0],
			closingTimeHours[1],
			closingTimeHours[2],
		);

		const currentTime = new Date(datetime).getTime();

		if (schedule.openingTime2 && schedule.closingTime2) {
			const openingTime2Hours = schedule.openingTime2.split(':').map(Number);
			const openingTime2 = new Date().setHours(
				openingTime2Hours[0],
				openingTime2Hours[1],
				openingTime2Hours[2],
			);

			const closingTime2Hours = schedule.closingTime2.split(':').map(Number);
			const closingTime2 = new Date().setHours(
				closingTime2Hours[0],
				closingTime2Hours[1],
				closingTime2Hours[2],
			);

			if (
				(currentTime >= openingTime && currentTime <= closingTime) ||
				(currentTime >= openingTime2 && currentTime <= closingTime2)
			) {
				return true;
			}
		}

		if (currentTime >= openingTime && currentTime <= closingTime) {
			return true;
		}

		return false;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new HTTPRequestError(
				'Erro ao verificar se restaurante está aberto',
				400,
			);
		}

		throw error;
	}
}
