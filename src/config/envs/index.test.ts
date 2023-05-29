import { PORT } from './index';

describe('Envs', () => {
	it('Should error if the port is not a number', () => {
		expect(isNaN(PORT)).toBe(false);
	});
});
