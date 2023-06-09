import { Router } from 'express';
import { RestaurantsController } from './restaurants.controllers';

const Restaurants = Router();

const restaurantsController = RestaurantsController();

Restaurants.get('/', restaurantsController.getAll);
Restaurants.get('/search', restaurantsController.search);
Restaurants.get('/:id', restaurantsController.getById);
Restaurants.get('/:id/is-open', restaurantsController.isOpen);
Restaurants.post('/', restaurantsController.create);
Restaurants.patch('/:id', restaurantsController.updateById);
Restaurants.delete('/:id', restaurantsController.deleteById);

export { Restaurants };
