import { HTTPRequestError } from '.';

describe('HTTPRequestError', () => {
	it('should be defined', () => {
		expect(HTTPRequestError).toBeDefined();
	});

	it('should be instance of Error', () => {
		expect(new HTTPRequestError('Test')).toBeInstanceOf(Error);
	});

	it('should be instance of HTTPRequestError', () => {
		expect(new HTTPRequestError('Test')).toBeInstanceOf(HTTPRequestError);
	});

	it('should be able to get message', () => {
		expect(new HTTPRequestError('Test').message).toBe('Test');
	});

	it('should be able to get status code', () => {
		expect(new HTTPRequestError('Test').statusCode).toBe(400);
	});

	it('should be able to set status code', () => {
		expect(new HTTPRequestError('Test', 401).statusCode).toBe(401);
	});

	it('should be able to get name', () => {
		expect(new HTTPRequestError('Test').name).toBe('HTTPRequestError');
	});
});
