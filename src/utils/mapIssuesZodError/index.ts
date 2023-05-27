import { ZodError } from 'zod';

function mapIssuesZodError(errors: ZodError) {
	const issues = errors.issues.map((issue) => {
		return {
			path: issue.path.join('.'),
			message: issue.message,
		};
	});

	return issues;
}

export { mapIssuesZodError };
