import { Request, Response } from 'express';
import { paginationValidator } from '@/validators/paginationValidator';
import { ZodError } from 'zod';
import {
	getRestaurants,
	createRestaurant,
	getRestaurantById,
	updateRestaurantById,
	deleteRestaurantById,
	isOpenRestaurant,
	searchRestaurant,
} from './restaurants.services';
import { mapIssuesZodError } from '@/utils/mapIssuesZodError';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { createRestaurantValidator } from './validators/createRestaurant';
import { getRestaurantByIdValidator } from './validators/getRestaurantById';
import { updateRestaurantValidator } from './validators/updateRestaurant';
import { isOpenRestaurantValidator } from './validators/isOpenRestaurant';
import { searchRestaurantValidator } from './validators/searchRestaurant';

export function RestaurantsController() {
	async function create(req: Request, res: Response) {
		try {
			const restaurantData = await createRestaurantValidator.parseAsync(
				req.body,
			);
			const restaurant = await createRestaurant(restaurantData);
			return res.status(201).json(restaurant);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ issues: mapIssuesZodError(error) });
			}

			if (error instanceof HTTPRequestError) {
				return res.status(error.statusCode).json({ message: error.message });
			}

			return res.status(500).json({ message: 'Erro interno no servidor' });
		}
	}

	async function getAll(req: Request, res: Response) {
		try {
			const pagination = paginationValidator.parse({
				page: Number(req.query.page),
				limit: Number(req.query.limit),
			});

			const isAddress = req.query.address === 'false' ? false : true;
			const isSchedules = req.query.schedules === 'false' ? false : true;

			const restaurants = await getRestaurants(pagination, { isAddress, isSchedules });
			return res.status(200).json(restaurants);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ issues: mapIssuesZodError(error) });
			}

			if (error instanceof HTTPRequestError) {
				return res.status(error.statusCode).json({ message: error.message });
			}

			return res.status(500).json({ message: 'Erro interno no servidor' });
		}
	}

	async function getById(req: Request, res: Response) {
		try {
			const { id } = await getRestaurantByIdValidator.parseAsync(req.params);
			const restaurant = await getRestaurantById(id);
			return res.status(200).json(restaurant);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ issues: mapIssuesZodError(error) });
			}

			if (error instanceof HTTPRequestError) {
				return res.status(error.statusCode).json({ message: error.message });
			}

			return res.status(500).json({ message: 'Erro interno no servidor' });
		}
	}

	async function updateById(req: Request, res: Response) {
		try {
			const { id } = await getRestaurantByIdValidator.parseAsync(req.params);
			const restaurantData = await updateRestaurantValidator.parseAsync(
				req.body,
			);
			const restaurant = await updateRestaurantById(id, restaurantData);
			return res.status(200).json(restaurant);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ issues: mapIssuesZodError(error) });
			}

			if (error instanceof HTTPRequestError) {
				return res.status(error.statusCode).json({ message: error.message });
			}

			return res.status(500).json({ message: 'Erro interno no servidor' });
		}
	}

	async function deleteById(req: Request, res: Response) {
		try {
			const { id } = await getRestaurantByIdValidator.parseAsync(req.params);
			await deleteRestaurantById(id);
			return res.status(204).send();
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ issues: mapIssuesZodError(error) });
			}

			if (error instanceof HTTPRequestError) {
				return res.status(error.statusCode).json({ message: error.message });
			}

			return res.status(500).json({ message: 'Erro interno no servidor' });
		}
	}

	async function isOpen(req: Request, res: Response) {
		try {
			const { id } = await getRestaurantByIdValidator.parseAsync(req.params);
			const { datetime } = await isOpenRestaurantValidator.parseAsync(req.query);

			const opened = await isOpenRestaurant(id, datetime);

			return res.status(200).json({
				opened,
			});
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ issues: mapIssuesZodError(error) });
			}

			if (error instanceof HTTPRequestError) {
				return res.status(error.statusCode).json({ message: error.message });
			}

			return res.status(500).json({ message: 'Erro interno no servidor' });
		}
	}

	async function search(req: Request, res: Response) {
		try {
			const pagination = paginationValidator.parse({
				page: Number(req.query.page),
				limit: Number(req.query.limit),
			});
			const { search } = searchRestaurantValidator.parse(req.query);

			const restaurants = await searchRestaurant(search, pagination);
			return res.status(200).json(restaurants);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ issues: mapIssuesZodError(error) });
			}

			if (error instanceof HTTPRequestError) {
				return res.status(error.statusCode).json({ message: error.message });
			}

			return res.status(500).json({ message: 'Erro interno no servidor' });
		}
	}

	return {
		create,
		getAll,
		getById,
		updateById,
		deleteById,
		isOpen,
		search,
	};
}
