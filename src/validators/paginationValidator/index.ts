import zod from 'zod';

const paginationValidator = zod.object({
	page: zod.number().min(1).default(1),
	limit: zod.number().min(1).default(10),
});

type PaginationValidator = zod.infer<typeof paginationValidator>;

export { paginationValidator, PaginationValidator };
