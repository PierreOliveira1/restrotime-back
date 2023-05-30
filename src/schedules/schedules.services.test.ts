import { Schedule } from '@prisma/client';
import {
	createSchedules,
	deleteSchedules,
	getSchedules,
	updateSchedules,
} from './schedules.services';
import { CreateSchedule } from './dto/createSchedule.dto';
import {
	createSchedulesUseCase,
	deleteSchedulesUseCase,
	getSchedulesUseCase,
	updateSchedulesUseCase,
} from './useCases';
import { UpdateSchedules } from './dto/updateSchedules.dto';

jest.mock('./useCases', () => ({
	createSchedulesUseCase: jest.fn(),
	getSchedulesUseCase: jest.fn(),
	updateSchedulesUseCase: jest.fn(),
	deleteSchedulesUseCase: jest.fn(),
}));

describe('schedules services', () => {
	const id = 'b3d7f1e0-1f0b-4b4b-8b0a-9b0a9b0a9b0a';
	const schedules: Schedule[] = [
		{
			id: 'b3d7f1e0-1f0b-4b4b-8b0a-9b0a9b0a9b0a',
			dayOfWeek: 1,
			openingTime: '08:00:00',
			closingTime: '17:00:00',
			openingTime2: null,
			closingTime2: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			restaurantId: 'b3d7f1e0-1f0b-4b4b-8b0a-9b0a9b0a9b0a',
		},
	];

	it('should call createSchedulesUseCase with the correct parameters', () => {
		createSchedules(id, schedules as CreateSchedule);

		expect(createSchedulesUseCase).toHaveBeenCalledWith(id, schedules);
	});

	it('should call getSchedulesUseCase with the correct parameter', () => {
		getSchedules(id);

		expect(getSchedulesUseCase).toHaveBeenCalledWith(id);
	});

	it('should call updateSchedulesUseCase with the correct parameters', () => {
		updateSchedules(id, schedules as UpdateSchedules);

		expect(updateSchedulesUseCase).toHaveBeenCalledWith(id, schedules);
	});

	it('should call deleteSchedulesUseCase with the correct parameter', () => {
		deleteSchedules([id]);

		expect(deleteSchedulesUseCase).toHaveBeenCalledWith([id]);
	});
});
