import { Router } from 'express';
import { SchedulesControllers } from './schedules.controllers';

const Schedules = Router();

const schedulesControllers = SchedulesControllers();

Schedules.post('/:id/schedules', schedulesControllers.create);

export { Schedules };
