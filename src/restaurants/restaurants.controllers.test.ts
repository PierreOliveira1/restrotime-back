import { Request, Response } from 'express';
import { RestaurantsController } from './restaurants.controllers';
import { paginationValidator } from '@/validators/paginationValidator';
import * as restaurantsServices from './restaurants.services';
import { GetRestaurantsResponse } from './dto/getRestaurants.dto';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { CreateRestaurant } from './validators/createRestaurant';
import { HTTPRequestError } from '@/utils/httpRequestError';

jest.mock('./restaurants.services');

describe('Restaurants Controllers', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

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
		}, 20000);

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

			jest.spyOn(restaurantsServices, 'getRestaurants').mockRejectedValueOnce(
				new Prisma.PrismaClientKnownRequestError('Internal server error', {
					code: 'P2002',
					clientVersion: '2.24.1',
				}),
			);

			const controller = RestaurantsController();

			await controller.getAll(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno no servidor',
			});
		}, 20000);
	});

	describe('getById', () => {
		it('should be able to get a restaurant by id', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };
			const expected = {
				id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
				...restaurantData,
				address: {
					id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
					...restaurantData.address,
					restaurantId: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				schedules: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			jest
				.spyOn(restaurantsServices, 'getRestaurantById')
				.mockResolvedValueOnce(expected);

			const { getById } = RestaurantsController();

			await getById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(expected);
		});

		it('should return not found for inexistent restaurant', async () => {
			jest
				.spyOn(restaurantsServices, 'getRestaurantById')
				.mockRejectedValueOnce(
					new HTTPRequestError('Restaurante não encontrado', 404),
				);

			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };

			const { getById } = RestaurantsController();

			await getById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Restaurante não encontrado',
			});
		});

		it('should return internal server error for other errors', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };
			jest
				.spyOn(restaurantsServices, 'getRestaurantById')
				.mockRejectedValueOnce(
					new Prisma.PrismaClientUnknownRequestError('Internal server error', {
						clientVersion: '2.24.1',
					}),
				);

			const { getById } = RestaurantsController();

			await getById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno no servidor',
			});
		});
	});

	describe('create', () => {
		it('should be able to create a restaurant', async () => {
			req.body = restaurantData;

			const expected = {
				id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
				...restaurantData,
				address: {
					id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
					...restaurantData.address,
					restaurantId: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				schedules: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			jest.spyOn(restaurantsServices, 'createRestaurant').mockResolvedValueOnce(
				expected,
			);

			const { create } = RestaurantsController();

			await create(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(expected);
		});

		it('should return validation errors for invalid data', async () => {
			req.body = { ...restaurantData, fantasyName: 'a' };

			const controller = RestaurantsController();

			await controller.create(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				issues: [{ path: 'fantasyName', message: 'Nome fantasia deve ter no mínimo 3 caracteres' }],
			});
		});

		it('should return internal server error for other errors', async () => {
			req.body = restaurantData;

			jest.spyOn(restaurantsServices, 'createRestaurant').mockRejectedValueOnce(
				new Prisma.PrismaClientUnknownRequestError('Internal server error', {
					clientVersion: '2.24.1',
				}),
			);

			const { create } = RestaurantsController();

			await create(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno no servidor',
			});
		});
	});

	describe('updateById', () => {
		it('should be able to update a restaurant', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };
			req.body = restaurantData;

			const expected = {
				id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
				...restaurantData,
				address: {
					id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
					...restaurantData.address,
					restaurantId: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				schedules: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			jest
				.spyOn(restaurantsServices, 'updateRestaurantById')
				.mockResolvedValueOnce(expected);

			const { updateById } = RestaurantsController();

			await updateById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(expected);
		});

		it('should return validation errors for invalid data', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };
			req.body = { ...restaurantData, fantasyName: 'a' };

			const controller = RestaurantsController();

			await controller.updateById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				issues: [{ path: 'fantasyName', message: 'Nome fantasia deve ter no mínimo 3 caracteres' }],
			});
		});

		it('should return not found for inexistent restaurant', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };
			req.body = restaurantData;

			jest
				.spyOn(restaurantsServices, 'updateRestaurantById')
				.mockRejectedValueOnce(
					new HTTPRequestError('Restaurante não encontrado', 404),
				);

			const { updateById } = RestaurantsController();

			await updateById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Restaurante não encontrado',
			});

		});

		it('should return internal server error for other errors', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };
			req.body = restaurantData;

			jest
				.spyOn(restaurantsServices, 'updateRestaurantById')
				.mockRejectedValueOnce(
					new Prisma.PrismaClientUnknownRequestError('Internal server error', {
						clientVersion: '2.24.1',
					}),
				);

			const { updateById } = RestaurantsController();

			await updateById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno no servidor',
			});
		});
	});

	describe('deleteById', () => {
		it('should be able to delete a restaurant', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };

			const expected = {
				id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d',
				...restaurantData,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			jest.spyOn(restaurantsServices, 'deleteRestaurantById').mockResolvedValueOnce(
				expected
			);

			const { deleteById } = RestaurantsController();

			await deleteById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(204);
		});

		it('should return not found for inexistent restaurant', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };

			jest
				.spyOn(restaurantsServices, 'deleteRestaurantById')
				.mockRejectedValueOnce(
					new HTTPRequestError('Restaurante não encontrado', 404),
				);

			const { deleteById } = RestaurantsController();

			await deleteById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Restaurante não encontrado',
			});
		});

		it('should return internal server error for other errors', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };

			jest
				.spyOn(restaurantsServices, 'deleteRestaurantById')
				.mockRejectedValueOnce(
					new Prisma.PrismaClientUnknownRequestError('Internal server error', {
						clientVersion: '2.24.1',
					}),
				);

			const { deleteById } = RestaurantsController();

			await deleteById(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno no servidor',
			});
		});
	});

	describe('isOpen', () => {
		it('should be able to isOpen a restaurant', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };
			req.query = { datetime: '2023-05-28T12:00:00.000Z' };

			jest.spyOn(restaurantsServices, 'isOpenRestaurant').mockResolvedValueOnce(
				true,
			);

			const { isOpen } = RestaurantsController();

			await isOpen(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				opened: true,
			});
		});

		it('should return not found for inexistent restaurant', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };
			req.query = { datetime: '2023-05-28T12:00:00.000Z' };

			jest.spyOn(restaurantsServices, 'isOpenRestaurant').mockRejectedValueOnce(
				new HTTPRequestError('Restaurante não encontrado', 404),
			);

			const { isOpen } = RestaurantsController();

			await isOpen(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Restaurante não encontrado',
			});
		});

		it('should return internal server error for other errors', async () => {
			req.params = { id: 'b4d3d3d3-4d3d-4d3d-4d3d-4d3d3d3d3d3d' };
			req.query = { datetime: '2023-05-28T12:00:00.000Z' };

			jest.spyOn(restaurantsServices, 'isOpenRestaurant').mockRejectedValueOnce(
				new Prisma.PrismaClientUnknownRequestError('Internal server error', {
					clientVersion: '2.24.1',
				}),
			);

			const { isOpen } = RestaurantsController();

			await isOpen(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: 'Erro interno no servidor',
			});
		});
	});
});
