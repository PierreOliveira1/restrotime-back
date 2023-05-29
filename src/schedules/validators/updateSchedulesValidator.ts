import zod from 'zod';

export const updateSchedulesValidator = zod.array(
	zod.object({
		id: zod.string().uuid({
			message: 'ID do horário deve ser um UUID válido',
		}),
		dayOfWeek: zod
			.number()
			.min(0, {
				message: 'Dia da semana deve ser maior ou igual a 0',
			})
			.max(6, {
				message: 'Dia da semana deve ser menor ou igual a 6',
			}),
		openingTime: zod.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
			message: 'Horário de abertura deve estar no formato HH:MM:SS',
		}),
		closingTime: zod.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
			message: 'Horário de fechamento deve estar no formato HH:MM:SS',
		}),
		openingTime2: zod
			.string()
			.regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
				message: 'Horário de abertura deve estar no formato HH:MM:SS',
			})
			.optional(),
		closingTime2: zod
			.string()
			.regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
				message: 'Horário de fechamento deve estar no formato HH:MM:SS',
			})
			.optional(),
		restaurantId: zod.string().uuid({
			message: 'ID do restaurante deve ser um UUID válido',
		}),
	}),
);
