import { ZodError } from 'zod';
import { CreateRestaurant, createRestaurantValidator } from '.';
import { mapIssuesZodError } from '@/utils/mapIssuesZodError';

describe('createRestaurantValidator', () => {
	const restaurantData: CreateRestaurant = {
		fantasyName: 'Restaurant 1',
		cnpj: '12345678901234',
		corporateName: 'Restaurant 1 LTDA',
		email: 'teste@gmail.com',
		phoneNumber: '12345678901',
		type: 'FAST_FOOD',
		address: {
			street: 'Street 1',
			city: 'City 1',
			complement: 'Complement 1',
			district: 'District 1',
			number: 'Number 1',
			state: 'St',
			zipCode: '12345678',
		},
	};

	it('should return an error if the name is not a string', async () => {
		try {
			await createRestaurantValidator.parseAsync({
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
		const result = await createRestaurantValidator.parseAsync(restaurantData);

		expect(result).toEqual(restaurantData);
	});
});
