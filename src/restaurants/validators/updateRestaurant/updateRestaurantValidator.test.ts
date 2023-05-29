import { ZodError } from 'zod';
import { updateRestaurantValidator, UpdateRestaurant } from '.';
import { mapIssuesZodError } from '@/utils/mapIssuesZodError';

describe('updateRestaurantValidator', () => {
	const restaurantData: UpdateRestaurant = {
		fantasyName: 'Restaurant 1',
		cnpj: '12345678901234',
		corporateName: 'Restaurant 1 LTDA',
		email: 'teste@gmail.com',
		phoneNumber: '12345678901',
		type: 'FAST_FOOD',
	};

	it('should return an error if the name is not a string', async () => {
		try {
			await updateRestaurantValidator.parseAsync({
				...restaurantData,
				fantasyName: '12',
			});
		} catch (error) {
			expect(error).toBeInstanceOf(ZodError);

			if (error instanceof ZodError) {
				expect(mapIssuesZodError(error)).toEqual(
					expect.arrayContaining([
						{
							path: 'fantasyName',
							message: 'Nome fantasia deve ter no mínimo 3 caracteres',
						},
					])
				);
			}
		}
	});

	it('should not return an error', async () => {
		const result = await updateRestaurantValidator.parseAsync(restaurantData);

		expect(result).toEqual(restaurantData);
	});
});
