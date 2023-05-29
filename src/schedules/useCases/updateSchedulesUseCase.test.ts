import { prisma } from '@database';
import { CreateRestaurant } from '@/restaurants/validators/createRestaurant';
import { updateSchedulesUseCase } from './updateSchedulesUseCase';
import { UpdateSchedules } from '../dto/updateSchedules.dto';
import { HTTPRequestError } from '@/utils/httpRequestError';

interface Schedule {
	openingTime: string;
	closingTime: string;
	openingTime2: string | null;
	closingTime2: string | null;
}

describe('updateSchedulesUseCase', () => {
	const restaurantData: CreateRestaurant = {
		fantasyName: 'Restaurant 1',
		cnpj: '12345678901234',
		corporateName: 'Restaurant 1 LTDA',
		email: 'teste@gmail.com',
		phoneNumber: '12345678901',
		type: 'FAST_FOOD',
		address: {
			street: 'Street 1',
			city: 'City 1',
			complement: 'Complement 1',
			district: 'District 1',
			number: 'Number 1',
			state: 'St',
			zipCode: '12345678',
		},
	};
	let id: string;
	const schedule: Schedule = {
		openingTime: '10:00:00',
		closingTime: '12:00:00',
		openingTime2: '14:00:00',
		closingTime2: '18:00:00',
	};

	beforeAll(async () => {
		console.log = jest.fn();
		const restaurant = await prisma.restaurant.create({
			data: {
				...restaurantData,
				address: {
					create: restaurantData.address,
				},
			},
		});
		id = restaurant.id;
	}, 30000);

	afterAll(async () => {
		await prisma.$transaction([
			prisma.address.deleteMany(),
			prisma.schedule.deleteMany(),
			prisma.restaurant.deleteMany(),
		]);
		await prisma.$disconnect();
	});

	it('should update schedules', async () => {
		await prisma.schedule.createMany({
			data: Array.from({ length: 7 }, (_, index) => ({
				restaurantId: id,
				dayOfWeek: index,
				...schedule,
			})),
		});

		const getSchedules = await prisma.schedule.findMany({
			where: {
				restaurantId: id,
			},
		});

		const newSchedule: Schedule = {
			openingTime: '11:00:00',
			closingTime: '13:00:00',
			openingTime2: '15:00:00',
			closingTime2: '19:00:00',
		};

		const schedules = getSchedules.filter((schedule) => {
			if (schedule.dayOfWeek < 4)
				return {
					...newSchedule,
					id: schedule.id,
					dayOfWeek: schedule.dayOfWeek,
					restaurantId: schedule.restaurantId,
				};
		});

		const updated = await updateSchedulesUseCase(
			id,
			schedules as UpdateSchedules,
		);

		expect(updated.length).toBe(4);
	});

	it('should throw an error if restaurant does not exist', async () => {
		const newSchedule = {
			id: '12345678-1234-1234-1234-123456789012',
			openingTime: '11:00:00',
			closingTime: '13:00:00',
			openingTime2: '15:00:00',
			closingTime2: '19:00:00',
			restaurantId: '12345678-1234-1234-1234-123456789012',
		};
		const restaurantId = '12345678-1234-1234-1234-123456789012';

		try {
			await updateSchedulesUseCase(restaurantId, [newSchedule] as UpdateSchedules);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);
			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Restaurante não encontrado');
				expect(error.statusCode).toBe(404);
			}
		}
	});

	it('should throw an error if schedules is empty', async () => {
		try {
			await updateSchedulesUseCase(id, []);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);
			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Nenhum horário informado');
				expect(error.statusCode).toBe(400);
			}
		}
	});

	it('should not be able to create a schedule if opening time is greater than closing time', async () => {
		const schedules = await prisma.schedule.findMany({
			where: {
				restaurantId: id,
			},
		});

		schedules[1].openingTime = '20:00:00';

		try {
			await updateSchedulesUseCase(id, schedules as UpdateSchedules);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);

			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe(
					'Horário de abertura não pode ser maior que o de fechamento',
				);
				expect(error.statusCode).toBe(400);
			}
		}
	});

	it('should not be able to create a schedule if opening time 2 is greater than closing time 2', async () => {
		const schedules = await prisma.schedule.findMany({
			where: {
				restaurantId: id,
			},
		});

		schedules[1].openingTime2 = '20:00:00';

		try {
			await updateSchedulesUseCase(id, schedules as UpdateSchedules);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);

			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe(
					'Horário de abertura não pode ser maior que o de fechamento',
				);
				expect(error.statusCode).toBe(400);
			}
		}
	});

	it('should not be able to create a schedule if opening time 2 is less than closing time', async () => {
		const schedules = await prisma.schedule.findMany({
			where: {
				restaurantId: id,
			},
		});

		schedules[1].openingTime2 = '10:00:00';

		try {
			await updateSchedulesUseCase(id, schedules as UpdateSchedules);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);

			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe(
					'Horário de fechamento não pode ser maior que o de abertura',
				);
				expect(error.statusCode).toBe(400);
			}
		}
	});
});
