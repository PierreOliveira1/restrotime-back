import zod from 'zod';

export const isOpenRestaurantValidator = zod.object({
	datetime: zod.string().datetime({
		message: 'Data inválida',
	}),
});
