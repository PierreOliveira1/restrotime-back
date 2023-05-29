import zod from 'zod';

export const deleteSchedulesValidator = zod.array(
	zod.string().uuid({
		message: 'O id deve ser um uuid válido',
	}),
);
