import { prisma } from '@/database';
import { CreateRestaurant } from '@/restaurants/validators/createRestaurant';
import { deleteSchedulesUseCase } from './deleteSchedulesUseCase';
import { HTTPRequestError } from '@/utils/httpRequestError';

interface Schedule {
	openingTime: string;
	closingTime: string;
	openingTime2?: string;
	closingTime2?: string;
}

describe('Delete Schedules Use Case', () => {
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

		await prisma.schedule.createMany({
			data: Array.from({ length: 7 }).map((_, index) => ({
				...schedule,
				dayOfWeek: index,
				restaurantId: id,
			})),
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

	it('should be able to delete a schedule', async () => {
		const schedules = await prisma.schedule.findMany({
			where: {
				restaurantId: id,
			},
		});

		const deleted = await deleteSchedulesUseCase(Array.from({ length: 2 }).map((_, index) => schedules[index].id));

		expect(schedules).toHaveLength(7);
		expect(deleted).toHaveLength(2);
		expect(deleted[0].id).toBe(schedules[0].id);
		expect(deleted[0].openingTime).toBe(null);
		expect(deleted[0].closingTime).toBe(null);
		expect(deleted[0].openingTime2).toBe(null);
		expect(deleted[0].closingTime2).toBe(null);
		expect(deleted[1].id).toBe(schedules[1].id);
		expect(deleted[1].openingTime).toBe(null);
		expect(deleted[1].closingTime).toBe(null);
		expect(deleted[1].openingTime2).toBe(null);
		expect(deleted[1].closingTime2).toBe(null);
	});

	it('should not be able to delete a schedule with invalid id', async () => {
		try {
			await deleteSchedulesUseCase(['7982fcfe-5721-4632-bede-6000885be57d']);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPRequestError);
			if (error instanceof HTTPRequestError) {
				expect(error.statusCode).toBe(404);
				expect(error.message).toBe('Horário não encontrado');
			}
		}
	});
});
