import { Router } from 'express';
import { SchedulesControllers } from './schedules.controllers';

const Schedules = Router();

const schedulesControllers = SchedulesControllers();

Schedules.post('/', schedulesControllers.create);

export { Schedules };
