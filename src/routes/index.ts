import { Router } from 'express';
import { Restaurants } from '../restaurants';

const Routes = Router();

Routes.use('/restaurants', Restaurants);

export { Routes };
