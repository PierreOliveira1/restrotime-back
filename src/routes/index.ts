import { Router } from 'express';
import { Restaurants } from '@/restaurants';
import { Schedules } from '@/schedules';

const Routes = Router();

Routes.use('/restaurants', Restaurants);
Routes.use('/restaurants', Schedules);

export { Routes };
