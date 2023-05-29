import { prisma } from '@/database';
import { createSchedulesUseCase } from './createSchedulesUseCase';
import { CreateSchedule } from '../dto/createSchedule.dto';
import { CreateRestaurant } from '@/restaurants/validators/createRestaurant';
import { HTTPRequestError } from '@/utils/httpRequestError';

interface Schedule {
	openingTime: string;
	closingTime: string;
	openingTime2?: string;
	closingTime2?: string;
}

describe('Create Schedules Use Case', () => {
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

	it('should be able to create a schedule', async () => {
		const schedules: CreateSchedule = Array.from({ length: 7 }, (_, index) => ({
			...schedule,
			dayOfWeek: index,
		}));

		const createdSchedules = await createSchedulesUseCase(id, schedules);

		expect(createdSchedules.count).toBe(7);
	});

	it('should not be able to create a schedule if restaurant does not exist', async () => {
		const schedules: CreateSchedule = Array.from({ length: 7 }, (_, index) => ({
			...schedule,
			dayOfWeek: index,
		}));

		try {
			await createSchedulesUseCase('0e8e9d7e-2b2b-4b6c-8e1a-2b0b2b4b6c8e', schedules);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);

			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Restaurante não encontrado');
				expect(error.statusCode).toBe(404);
			}
		}
	});

	it('should not be able to create a schedule if restaurant already has schedules', async () => {
		const schedules: CreateSchedule = Array.from({ length: 7 }, (_, index) => ({
			...schedule,
			dayOfWeek: index,
		}));

		await expect(
			createSchedulesUseCase(id, schedules),
		).rejects.toBeInstanceOf(HTTPRequestError);
	});

	it('should not be able to create a schedule if there are two schedules on the same day', async () => {
		const schedules: CreateSchedule = Array.from({ length: 7 }, (_, index) => ({
			...schedule,
			dayOfWeek: index,
		}));

		schedules[1].dayOfWeek = 0;

		try {
			await prisma.schedule.deleteMany();
			await createSchedulesUseCase(id, schedules);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);

			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Não é possível ter dois horários no mesmo dia');
				expect(error.statusCode).toBe(400);
			}
		}
	});

	it('should not be able to create a schedule if opening time is greater than closing time', async () => {
		const schedules: CreateSchedule = Array.from({ length: 7 }, (_, index) => ({
			...schedule,
			dayOfWeek: index,
		}));

		schedules[1].openingTime = '20:00:00';

		try {
			await prisma.schedule.deleteMany();
			await createSchedulesUseCase(id, schedules);
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
		const schedules: CreateSchedule = Array.from({ length: 7 }, (_, index) => ({
			...schedule,
			dayOfWeek: index,
		}));

		schedules[1].openingTime2 = '20:00:00';

		try {
			await prisma.schedule.deleteMany();
			await createSchedulesUseCase(id, schedules);
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
		const schedules: CreateSchedule = Array.from({ length: 7 }, (_, index) => ({
			...schedule,
			dayOfWeek: index,
		}));

		schedules[1].openingTime2 = '10:00:00';

		try {
			await prisma.schedule.deleteMany();
			await createSchedulesUseCase(id, schedules);
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

	it('should able error to create schedules with 6 schedules', async () => {
		const schedules: CreateSchedule = Array.from({ length: 6 }, (_, index) => ({
			...schedule,
			dayOfWeek: index,
		}));

		try {
			await prisma.schedule.deleteMany();
			await createSchedulesUseCase(id, schedules);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);

			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Deve haver horários de funcionamento para todos os dias da semana');
				expect(error.statusCode).toBe(400);
			}
		}
	});

	it('should able error to create schedules with 8 schedules', async () => {
		const schedules: CreateSchedule = Array.from({ length: 8 }, (_, index) => ({
			...schedule,
			dayOfWeek: index,
		}));

		try {
			await prisma.schedule.deleteMany();
			await createSchedulesUseCase(id, schedules);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);

			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Não é possível ter mais de 7 dias de funcionamento');
				expect(error.statusCode).toBe(400);
			}
		}
	});
});
