import { Router } from 'express';
import { SchedulesControllers } from './schedules.controllers';

const Schedules = Router();

const schedulesControllers = SchedulesControllers();

Schedules.post('/:id/schedules', schedulesControllers.create);
Schedules.get('/:id/schedules', schedulesControllers.getByRestaurant);
Schedules.patch('/:id/schedules', schedulesControllers.update);
Schedules.delete('/:id/schedules', schedulesControllers.del);

export { Schedules };
