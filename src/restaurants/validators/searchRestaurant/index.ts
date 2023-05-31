import zod from 'zod';

export const searchRestaurantValidator = zod.object({
	search: zod.string().min(3).max(255),
});
