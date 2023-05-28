export class HTTPRequestError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode?: number) {
		super(message);
		this.name = 'HTTPRequestError';
		this.statusCode = statusCode ?? 400;
	}
}
