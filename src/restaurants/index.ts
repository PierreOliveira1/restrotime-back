import { Router } from 'express';
import { RestaurantsController } from './restaurants.controllers';

const Restaurants = Router();

const { getAll } = RestaurantsController();

Restaurants.get('/', getAll);

export { Restaurants };
