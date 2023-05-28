import zod from 'zod';

const paginationValidator = zod.object({
	page: zod
		.number()
		.min(1, {
			message: 'A página deve ser maior que 0',
		})
		.default(1),
	limit: zod
		.number()
		.min(1, {
			message: 'O limite deve ser maior que 0',
		})
		.default(10),
});

type PaginationValidator = zod.infer<typeof paginationValidator>;

export { paginationValidator, PaginationValidator };
