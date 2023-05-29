import { Router } from 'express';
import { RestaurantsController } from './restaurants.controllers';

const Restaurants = Router();

const restaurantsController = RestaurantsController();

Restaurants.get('/', restaurantsController.getAll);
Restaurants.get('/:id', restaurantsController.getById);
Restaurants.post('/', restaurantsController.create);
Restaurants.patch('/:id', restaurantsController.updateById);
Restaurants.delete('/:id', restaurantsController.deleteById);

export { Restaurants };
