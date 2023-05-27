export class HTTPBadRequestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'HTTPBadRequestError';
	}
}
