import { prisma } from '@/database';
import { CreateRestaurant } from '@/restaurants/validators/createRestaurant';
import { UpdateSchedules } from '../dto/updateSchedules.dto';
import { getSchedulesUseCase } from './getSchedulesUseCase';
import { HTTPRequestError } from '@/utils/httpRequestError';

interface Schedule {
	openingTime: string;
	closingTime: string;
	openingTime2: string | null;
	closingTime2: string | null;
}

describe('Get Schedules Use Case', () => {
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

	let schedulesData: UpdateSchedules;

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
		schedulesData = Array.from({ length: 7 }).map((_, index) => {
			if (index === 4) {
				return {
					restaurantId: id,
					dayOfWeek: index,
					openingTime: '10:00:00',
					closingTime: '12:00:00',
					openingTime2: null,
					closingTime2: null,
				};
			}

			return {
				restaurantId: id,
				dayOfWeek: index,
				...schedule,
			};
		}) as UpdateSchedules;
		await prisma.schedule.createMany({
			data: schedulesData,
		});
	}, 30000);

	afterAll(async () => {
		await prisma.$transaction([
			prisma.address.deleteMany(),
			prisma.schedule.deleteMany(),
			prisma.restaurant.deleteMany(),
		]);
		await prisma.$disconnect();
	});

	it('should get schedules', async () => {
		const schedules = await prisma.schedule.findMany({
			where: {
				restaurantId: id,
			},
			orderBy: {
				dayOfWeek: 'asc',
			},
		});

		expect(schedules.length).toBe(7);
		schedules.forEach((schedule, index) => {
			expect(schedule).toHaveProperty('id');
			expect(schedule).toHaveProperty('dayOfWeek');
			expect(schedule.dayOfWeek).toBe(index);
			expect(schedule).toHaveProperty('openingTime');
			expect(schedule.openingTime).toBe(schedulesData[index].openingTime);
			expect(schedule).toHaveProperty('closingTime');
			expect(schedule.closingTime).toBe(schedulesData[index].closingTime);
			expect(schedule).toHaveProperty('openingTime2');
			expect(schedule.openingTime2).toBe(schedulesData[index].openingTime2);
			expect(schedule).toHaveProperty('closingTime2');
			expect(schedule.closingTime2).toBe(schedulesData[index].closingTime2);
		});
	});

	it('should be error if restaurant not found', async () => {
		const id = '123e4567-e89b-12d3-a456-426614174000';

		try {
			await getSchedulesUseCase(id);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);
			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Restaurante não encontrado');
				expect(error.statusCode).toBe(404);
			}
		}
	});

	it('should be empty if schedules not found', async () => {
		await prisma.schedule.deleteMany({
			where: {
				restaurantId: id,
			},
		});

		try {
			await getSchedulesUseCase(id);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);
			if (error instanceof HTTPRequestError) {
				expect(error.message).toBe('Nenhum horário encontrado');
				expect(error.statusCode).toBe(404);
			}
		}
	});
});
