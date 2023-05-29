import zod from 'zod';

export const updateRestaurantValidator = zod.object({
	fantasyName: zod
		.string()
		.min(3, {
			message: 'Nome fantasia deve ter no mínimo 3 caracteres',
		})
		.max(255, {
			message: 'Nome fantasia deve ter no máximo 255 caracteres',
		})
		.optional(),
	corporateName: zod
		.string()
		.min(3, {
			message: 'Razão social deve ter no mínimo 3 caracteres',
		})
		.max(255, {
			message: 'Razão social deve ter no máximo 255 caracteres',
		})
		.optional(),
	cnpj: zod
		.string()
		.min(14, {
			message: 'CNPJ deve ter no mínimo 14 caracteres',
		})
		.max(14, {
			message: 'CNPJ deve ter no máximo 14 caracteres',
		})
		.optional(),
	phoneNumber: zod
		.string()
		.min(10, {
			message: 'Telefone deve ter no mínimo 10 caracteres',
		})
		.max(11, {
			message: 'Telefone deve ter no máximo 11 caracteres',
		})
		.optional(),
	type: zod
		.enum([
			'SNACK_BAR',
			'FAST_FOOD',
			'PIZZERIA',
			'JAPANESE',
			'ITALIAN',
			'VEGETARIAN',
		])
		.optional(),
	email: zod
		.string()
		.email({
			message: 'E-mail inválido',
		})
		.optional(),
	address: zod
		.object({
			street: zod
				.string()
				.min(3, {
					message: 'Rua deve ter no mínimo 3 caracteres',
				})
				.max(255, {
					message: 'Rua deve ter no máximo 255 caracteres',
				})
				.optional(),
			number: zod
				.string()
				.min(1, {
					message: 'Número deve ter no mínimo 1 caracter',
				})
				.max(10, {
					message: 'Número deve ter no máximo 10 caracteres',
				})
				.optional(),
			complement: zod
				.string()
				.min(3, {
					message: 'Complemento deve ter no mínimo 3 caracteres',
				})
				.max(255, {
					message: 'Complemento deve ter no máximo 255 caracteres',
				})
				.optional(),
			district: zod
				.string()
				.min(3, {
					message: 'Bairro deve ter no mínimo 3 caracteres',
				})
				.max(255, {
					message: 'Bairro deve ter no máximo 255 caracteres',
				})
				.optional(),
			city: zod
				.string()
				.min(3, {
					message: 'Cidade deve ter no mínimo 3 caracteres',
				})
				.max(255, {
					message: 'Cidade deve ter no máximo 255 caracteres',
				})
				.optional(),
			state: zod
				.string()
				.min(2, {
					message: 'Estado deve ter no mínimo 2 caracteres',
				})
				.max(2, {
					message: 'Estado deve ter no máximo 2 caracteres',
				})
				.optional(),
			zipCode: zod
				.string()
				.min(8, {
					message: 'CEP deve ter no mínimo 8 caracteres',
				})
				.max(8, {
					message: 'CEP deve ter no máximo 8 caracteres',
				})
				.optional(),
		})
		.optional(),
});

export type UpdateRestaurant = zod.infer<typeof updateRestaurantValidator>;
