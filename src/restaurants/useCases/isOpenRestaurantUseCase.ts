import { prisma } from '@/database';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { Prisma } from '@prisma/client';

function createDateWithTime(time: string, datetime: string) {
	const newDate = new Date(`${datetime.split('T')[0]}T${time}`);
	return newDate.getTime();
}

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

		const openingTime = createDateWithTime(schedule.openingTime, datetime);
		const closingTime = createDateWithTime(schedule.closingTime, datetime);

		const currentTime = new Date(datetime.split('.')[0]).getTime();

		if (schedule.openingTime2 && schedule.closingTime2) {
			const openingTime2 = createDateWithTime(schedule.openingTime2, datetime);
			const closingTime2 = createDateWithTime(schedule.closingTime2, datetime);

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
