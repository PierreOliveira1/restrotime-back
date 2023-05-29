import { Request, Response } from 'express';
import { createSchedulesValidator } from './validators/createSchedulesValidator';
import { createSchedules } from './schedules.services';
import { ZodError } from 'zod';
import { mapIssuesZodError } from '@/utils/mapIssuesZodError';
import { HTTPRequestError } from '@/utils/httpRequestError';
import { getSchedulesByIdValidator } from './validators/getSchedulesByIdValidator';

export function SchedulesControllers() {
	async function create(req: Request, res: Response) {
		try {
			const body = createSchedulesValidator.parse(req.body.schedules);
			const { id } = getSchedulesByIdValidator.parse(req.params);

			const schedules = await createSchedules(id, body);

			return res.status(201).json(schedules);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					issues: mapIssuesZodError(error),
				});
			}

			if (error instanceof HTTPRequestError) {
				return res.status(error.statusCode).json({
					message: error.message,
				});
			}

			return res.status(500).json({
				message: 'Erro interno do servidor',
			});
		}
	}

	return {
		create,
	};
}
