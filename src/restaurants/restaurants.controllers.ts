import { Request, Response } from 'express';
import { paginationValidator } from '@/validators/paginationValidator';
import { ZodError } from 'zod';
import { getRestaurants } from './restaurants.services';
import { mapIssuesZodError } from '@/utils/mapIssuesZodError';
import { HTTPBadRequestError } from '@/utils/httpBadRequest';

export function RestaurantsController() {
	async function getAll(req: Request, res: Response) {
		try {
			const pagination = paginationValidator.parse(req.query);

			const restaurants = await getRestaurants(pagination);
			return res.status(200).json(restaurants);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ issues: mapIssuesZodError(error) });
			}

			if (error instanceof HTTPBadRequestError) {
				return res.status(400).json({ message: error.message });
			}

			return res.status(500).json({ message: 'Erro interno no servidor' });
		}
	}

	return {
		getAll,
	};
}
