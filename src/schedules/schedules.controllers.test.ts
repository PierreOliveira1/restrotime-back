import { Request, Response } from 'express';
import { SchedulesControllers } from './schedules.controllers';
import * as schedulesServices from './schedules.services';
import { Schedule } from '@prisma/client';
import { createSchedulesValidator } from './validators/createSchedulesValidator';
import { getSchedulesByIdValidator } from './validators/getSchedulesByIdValidator';
import { updateSchedulesValidator } from './validators/updateSchedulesValidator';
import { deleteSchedulesValidator } from './validators/deleteSchedulesValidator';
import { ZodError } from 'zod';

jest.mock('./schedules.services');

describe('SchedulesControllers', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let schedulesControllers: ReturnType<typeof SchedulesControllers>;
	const mockSchedules = [
		{
			dayOfWeek: 0,
			openingTime: '10:00',
			closingTime: '22:00',
			openingTime2: null,
			closingTime2: null,
		}
	];

	beforeEach(() => {
		req = {
			body: jest.fn().mockReturnThis(),
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		schedulesControllers = SchedulesControllers();
	});

	describe('create', () => {
		it('should return 201 status code and schedules when successful', async () => {
			req.body = { schedules: mockSchedules };
			req.params = { id: '8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5' };

			createSchedulesValidator.parse = jest.fn().mockReturnValue(mockSchedules);
			getSchedulesByIdValidator.parse = jest.fn().mockReturnValue({ id: '8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5' });
			jest.spyOn(schedulesServices, 'createSchedules').mockResolvedValue({ count: 1 });

			await schedulesControllers.create(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ count: 1 });
		});

		it('should return 400 status code when validation fails', async () => {
			req.body = { schedules: mockSchedules };
			req.params = { id: '8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5' };

			createSchedulesValidator.parse = jest.fn().mockImplementation(() => {
				throw new ZodError([
					{
						code: 'invalid_type',
						expected: 'string',
						received: 'number',
						path: ['schedules', 'dayOfWeek'],
						message: 'Invalid type',
					},
				]);
			});

			await schedulesControllers.create(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				issues: [
					{
						path: 'schedules.dayOfWeek',
						message: 'Invalid type',
					},
				]
			});
		});

		it('should return 500 status code when an error occurs', async () => {
			req.body = { schedules: mockSchedules };
			req.params = { id: '8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5' };

			createSchedulesValidator.parse = jest.fn().mockReturnValue(mockSchedules);
			getSchedulesByIdValidator.parse = jest.fn().mockReturnValue({ id: '8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5' });
			jest.spyOn(schedulesServices, 'createSchedules').mockRejectedValue(new Error('Something went wrong'));

			await schedulesControllers.create(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno do servidor',
			});
		});
	});

	describe('getByRestaurant', () => {
		it('should return 200 status code and schedules when successful', async () => {
			req.params = { id: '123' };

			getSchedulesByIdValidator.parse = jest.fn().mockReturnValue({ id: '8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5' });
			jest.spyOn(schedulesServices, 'getSchedules').mockResolvedValue(mockSchedules as Schedule[]);

			await schedulesControllers.getByRestaurant(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockSchedules);
		});

		it('should return 400 status code when validation fails', async () => {
			req.params = { id: '123' };

			getSchedulesByIdValidator.parse = jest.fn().mockImplementation(() => {
				throw new ZodError([
					{
						code: 'invalid_type',
						expected: 'string',
						received: 'number',
						path: ['id'],
						message: 'Invalid type',
					},
				]);
			});

			await schedulesControllers.getByRestaurant(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				issues: [
					{
						path: 'id',
						message: 'Invalid type',
					},
				]
			});
		});

		it('should return 500 status code when an error occurs', async () => {
			req.params = { id: '123' };

			getSchedulesByIdValidator.parse = jest.fn().mockReturnValue({ id: '8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5' });
			jest.spyOn(schedulesServices, 'getSchedules').mockRejectedValue(new Error('Something went wrong'));

			await schedulesControllers.getByRestaurant(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno do servidor',
			});
		});
	});

	describe('update', () => {
		it('should return 200 status code and updated schedules when successful', async () => {
			req.body = { schedules: mockSchedules };
			req.params = { id: '123' };

			updateSchedulesValidator.parse = jest.fn().mockReturnValue(mockSchedules);
			getSchedulesByIdValidator.parse = jest.fn().mockReturnValue({ id: '8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5' });
			jest.spyOn(schedulesServices, 'updateSchedules').mockResolvedValue(mockSchedules as Schedule[]);

			await schedulesControllers.update(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockSchedules);
		});

		it('should return 400 status code when validation fails', async () => {
			req.body = { schedules: mockSchedules };
			req.params = { id: '123' };

			updateSchedulesValidator.parse = jest.fn().mockImplementation(() => {
				throw new ZodError([
					{
						code: 'invalid_type',
						expected: 'string',
						received: 'number',
						path: ['schedules', 'dayOfWeek'],
						message: 'Invalid type',
					},
				]);
			});

			await schedulesControllers.update(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				issues: [
					{
						path: 'schedules.dayOfWeek',
						message: 'Invalid type',
					},
				]
			});
		});

		it('should return 500 status code when an error occurs', async () => {
			req.body = { schedules: mockSchedules };
			req.params = { id: '123' };

			updateSchedulesValidator.parse = jest.fn().mockReturnValue(mockSchedules);
			getSchedulesByIdValidator.parse = jest.fn().mockReturnValue({ id: '8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5' });
			jest.spyOn(schedulesServices, 'updateSchedules').mockRejectedValue(new Error('Something went wrong'));

			await schedulesControllers.update(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno do servidor',
			});
		});
	});

	describe('del', () => {
		it('should return 204 status code when successful', async () => {
			req.body = {
				schedules: ['8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5'],
			};

			deleteSchedulesValidator.parse = jest.fn().mockReturnValue(mockSchedules);
			jest.spyOn(schedulesServices, 'deleteSchedules').mockResolvedValue(mockSchedules as Schedule[]);

			await schedulesControllers.del(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(204);
			expect(res.json).toHaveBeenCalled();
		});

		it('should return 400 status code when validation fails', async () => {
			req.body = {
				schedules: ['8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5'],
			};

			deleteSchedulesValidator.parse = jest.fn().mockImplementation(() => {
				throw new ZodError([
					{
						code: 'invalid_type',
						expected: 'string',
						received: 'number',
						path: ['schedules'],
						message: 'Invalid type',
					},
				]);
			});

			await schedulesControllers.del(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				issues: [
					{
						path: 'schedules',
						message: 'Invalid type',
					},
				]
			});
		});

		it('should return 500 status code when an error occurs', async () => {
			req.body = {
				schedules: ['8b5a6d2e-8a8d-4c4c-9f3d-7a5d9cdaa6d5'],
			};

			deleteSchedulesValidator.parse = jest.fn().mockReturnValue(mockSchedules);
			jest.spyOn(schedulesServices, 'deleteSchedules').mockRejectedValue(new Error('Something went wrong'));

			await schedulesControllers.del(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno do servidor',
			});
		});
	});
});
