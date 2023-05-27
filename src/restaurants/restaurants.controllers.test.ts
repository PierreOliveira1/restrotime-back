import { Request, Response } from 'express';
import { RestaurantsController } from './restaurants.controllers';
import { paginationValidator } from '@/validators/paginationValidator';
import * as restaurantsServices from './restaurants.services';
import { GetRestaurantsResponse } from './dto/getRestaurants.dto';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

describe('Restaurants Controllers', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	beforeEach(() => {
		req = {
			query: {
				page: '1',
				limit: '10',
			},
		};

		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
	});

	describe('getAll', () => {
		it('should be able to get all restaurants', async () => {
			const expected: GetRestaurantsResponse = {
				data: [],
				pagination: {
					totalPages: 1,
					currentPage: 1,
					nextPage: null,
				},
			};

			paginationValidator.parse = jest.fn(() => ({ page: 1, limit: 10 }));
			jest
				.spyOn(restaurantsServices, 'getRestaurants')
				.mockResolvedValueOnce(expected);

			const { getAll } = RestaurantsController();

			await getAll(req as Request, res as Response);

			expect(res.status).toBeCalledWith(200);
			expect(res.json).toBeCalled();
		});

		it('should return validation errors for invalid pagination', async () => {
			req.query = { page: 'abc', limit: '-10' };

			paginationValidator.parse = jest.fn(() => {
				throw new ZodError([
					{
						path: ['page'],
						message: 'Invalid page',
						code: 'invalid_type',
						received: 'string',
						expected: 'number',
					},
					{
						path: ['limit'],
						message: 'Invalid limit',
						code: 'invalid_type',
						received: 'string',
						expected: 'number',
					},
				]);
			});

			const controller = RestaurantsController();

			await controller.getAll(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				issues: [
					{ path: 'page', message: 'Invalid page' },
					{ path: 'limit', message: 'Invalid limit' },
				],
			});
		});

		it('should return internal server error for other errors', async () => {
			req.query = { page: '1', limit: '10' };

			paginationValidator.parse = jest.fn(() => ({ page: 1, limit: 10 }));

			jest
				.spyOn(restaurantsServices, 'getRestaurants')
				.mockImplementation(() => {
					throw new Prisma.PrismaClientUnknownRequestError('message', {
						clientVersion: 'clientVersion',
					});
				});

			const controller = RestaurantsController();

			await controller.getAll(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno no servidor',
			});
		});
	});
});
