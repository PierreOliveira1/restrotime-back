import zod from 'zod';

export const getSchedulesByIdValidator = zod.object({
	id: zod.string().uuid({
		message: 'Id deve ser um UUID válido',
	}),
});
