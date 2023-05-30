import { prisma } from '@/database';
import { CreateRestaurant } from '../validators/createRestaurant';
import { isOpenRestaurantUseCase } from './isOpenRestaurantUseCase';

interface Schedule {
	openingTime: string;
	closingTime: string;
	openingTime2: string | null;
	closingTime2: string | null;
}

describe('Is Open Restaurant Use Case', () => {
	let id: string;
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
	const schedule: Schedule = {
		openingTime: '10:00:00',
		closingTime: '12:00:00',
		openingTime2: '14:00:00',
		closingTime2: '18:00:00',
	};

	beforeAll(async () => {
		const createdRestaurant = await prisma.restaurant.create({
			data: {
				...restaurantData,
				address: {
					create: restaurantData.address,
				},
			},
		});
		id = createdRestaurant.id;
		await prisma.schedule.createMany({
			data: Array.from({ length: 7 }, (_, index) => ({
				restaurantId: id,
				dayOfWeek: index,
				...schedule,
			})),
		});
	}, 30000);

	afterAll(async () => {
		await prisma.$transaction([
			prisma.schedule.deleteMany(),
			prisma.address.deleteMany(),
			prisma.restaurant.deleteMany(),
		]);
	}, 30000);

	it('should return true if restaurant is open', async () => {
		const datetime = new Date().setHours(11, 0, 0, 0);
		const isOpen = await isOpenRestaurantUseCase(id, new Date(datetime).toISOString());
		expect(isOpen).toBe(true);
	});

	it('should return false if restaurant is closed', async () => {
		const datetime = new Date().setHours(13, 0, 0, 0);
		const isOpen = await isOpenRestaurantUseCase(id, new Date(datetime).toISOString());
		expect(isOpen).toBe(false);
	});
});
