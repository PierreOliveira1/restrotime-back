import zod from 'zod';

export const getRestaurantByIdValidator = zod.object({
	id: zod.string().uuid({
		message: 'O id informado não é um UUID válido',
	}),
});

export type GetRestaurantByIdValidator = zod.infer<
	typeof getRestaurantByIdValidator
>;
