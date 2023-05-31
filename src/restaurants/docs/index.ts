import { OpenAPIV3 } from 'openapi-types';

const docs: Partial<OpenAPIV3.Document> = {
	paths: {
		'/restaurants': {
			get: {
				summary: 'Get all restaurants',
				description: 'Get all restaurants',
				tags: ['Restaurants'],
				parameters: [
					{
						in: 'query',
						name: 'page',
						description: 'Page number',
						required: false,
						schema: {
							type: 'integer',
							default: 1,
						},
					},
					{
						in: 'query',
						name: 'limit',
						description: 'Limit number of items per page',
						required: false,
						schema: {
							type: 'integer',
							default: 10,
						},
					},
				],
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Restaurant',
											},
										},
										pagination: {
											type: 'object',
											properties: {
												totalPages: {
													type: 'integer',
													example: 10,
												},
												currentPage: {
													type: 'integer',
													example: 1,
												},
												nextPage: {
													type: 'integer',
													example: 2,
													nullable: true,
												},
											},
										},
									},
								},
							},
						},
					},
					'400': {
						description: 'Bad Request',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ZodError',
								},
							},
						},
					},
					'500': {
						description: 'Internal Server Error',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/InternalServerError',
								},
							},
						},
					},
				},
			},
			post: {
				summary: 'Create a restaurant',
				description: 'Create a restaurant',
				tags: ['Restaurants'],
				requestBody: {
					description: 'Restaurant data',
					required: true,
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/RestaurantData',
							},
						},
					},
				},
				responses: {
					'201': {
						description: 'Created',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Restaurant',
								},
							},
						},
					},
					'400': {
						description: 'Bad Request',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ZodError',
								},
							},
						},
					},
					'500': {
						description: 'Internal Server Error',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/InternalServerError',
								},
							},
						},
					},
				},
			},
		},
		'/restaurants/{id}': {
			get: {
				summary: 'Get a restaurant',
				description: 'Get a restaurant',
				tags: ['Restaurants'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						description: 'Restaurant ID',
						required: true,
						schema: {
							type: 'string',
							example: '4ef9926b-d361-4bb8-90c6-cb2d609f8c1e',
						},
					},
				],
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Restaurant',
								},
							},
						},
					},
					'400': {
						description: 'Bad Request',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ZodError',
								},
							},
						},
					},
					'404': {
						description: 'Not Found',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/NotFoundError',
								},
							},
						},
					},
					'500': {
						description: 'Internal Server Error',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/InternalServerError',
								},
							},
						},
					},
				},
			},
			patch: {
				summary: 'Update a restaurant',
				description: 'Update a restaurant',
				tags: ['Restaurants'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						description: 'Restaurant ID',
						required: true,
						schema: {
							type: 'string',
							example: '4ef9926b-d361-4bb8-90c6-cb2d609f8c1e',
						},
					},
				],
				requestBody: {
					description: 'Restaurant data',
					required: true,
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/RestaurantData',
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Restaurant',
								},
							},
						},
					},
					'400': {
						description: 'Bad Request',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ZodError',
								},
							},
						},
					},
					'500': {
						description: 'Internal Server Error',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/InternalServerError',
								},
							},
						},
					},
				},
			},
			delete: {
				summary: 'Delete a restaurant',
				description: 'Delete a restaurant',
				tags: ['Restaurants'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						description: 'Restaurant ID',
						required: true,
						schema: {
							type: 'string',
							example: '4ef9926b-d361-4bb8-90c6-cb2d609f8c1e',
						},
					},
				],
				responses: {
					'204': {
						description: 'No Content',
					},
					'400': {
						description: 'Bad Request',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											path: {
												type: 'string',
												example: 'id',
											},
											message: {
												type: 'string',
												example: 'O id informado não é um UUID válido',
											},
										},
									},
								},
							},
						},
					},
					'500': {
						description: 'Internal Server Error',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/InternalServerError',
								},
							},
						},
					},
				},
			},
		},
		'/restaurants/{id}/is-open': {
			get: {
				summary: 'Check if a restaurant is open',
				description: 'Check if a restaurant is open',
				tags: ['Restaurants'],
				parameters: [
					{
						in: 'path',
						name: 'id',
						description: 'Restaurant ID',
						required: true,
						example: '4ef9926b-d361-4bb8-90c6-cb2d609f8c1e',
					},
					{
						in: 'query',
						name: 'datetime',
						description: 'Date and time to check if the restaurant is open',
						required: true,
						example: '2021-08-01T20:00:00.000Z',
					}
				],
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										opened: {
											type: 'boolean',
											example: true,
										},
									},
								},
							},
						},
					},
					'400': {
						description: 'Bad Request',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											path: {
												type: 'string',
												example: 'id',
											},
											message: {
												type: 'string',
												example: 'O id informado não é um UUID válido',
											},
										},
									},
								},
							},
						},
					},
					'500': {
						description: 'Internal Server Error',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/InternalServerError',
								},
							},
						},
					},
				},
			},
		},
		'/restaurants/search': {
			get: {
				summary: 'Search restaurants',
				description: 'Search restaurants',
				tags: ['Restaurants'],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term',
						required: true,
						example: 'Fantasy',
					},
					{
						in: 'query',
						name: 'page',
						description: 'Page number',
						required: false,
						example: 1,
					},
					{
						in: 'query',
						name: 'limit',
						description: 'Page size',
						required: false,
						example: 10,
					},
				],
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												type: 'object',
												properties: {
													id: {
														type: 'string',
														example: '4ef9926b-d361-4bb8-90c6-cb2d609f8c1e',
													},
													fantasyName: {
														type: 'string',
														example: 'Fantasy Name',
													},
													corporateName: {
														type: 'string',
														example: 'Corporate Name',
													},
												},
											},
										},
										pagination: {
											type: 'object',
											properties: {
												currentPage: {
													type: 'number',
													example: 1,
												},
												totalPages: {
													type: 'number',
													example: 1,
												},
												nextPage: {
													type: 'number',
													example: null,
												},
											},
										},
									},
								},
							},
						},
					},
					'400': {
						description: 'Bad Request',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											path: {
												type: 'string',
												example: 'id',
											},
											message: {
												type: 'string',
												example: 'O id informado não é um UUID válido',
											},
										},
									},
								},
							},
						},
					},
					'500': {
						description: 'Internal Server Error',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/InternalServerError',
								},
							},
						},
					},
				},
			},
		},
	},
	components: {
		schemas: {
			Restaurant: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						example: '4ef9926b-d361-4bb8-90c6-cb2d609f8c1e',
					},
					fantasyName: {
						type: 'string',
						example: 'Fantasy Name',
					},
					corporateName: {
						type: 'string',
						example: 'Corporate Name',
					},
					cnpj: {
						type: 'string',
						example: '00000000000000',
					},
					type: {
						type: 'string',
						enum: ['SNACK_BAR', 'FAST_FOOD', 'PIZZERIA', 'JAPANESE', 'ITALIAN', 'VEGETARIAN'],
						example: 'SNACK_BAR',
					},
					phoneNumber: {
						type: 'string',
						example: '00000000000',
					},
					email: {
						type: 'string',
						example: 'exemple@gmail.com',
					},
					address: {
						type: 'object',
						properties: {
							street: {
								type: 'string',
								example: 'Street',
							},
							number: {
								type: 'string',
								example: '000',
							},
							complement: {
								type: 'string',
								example: 'Complement',
							},
							district: {
								type: 'string',
								example: 'District',
							},
							city: {
								type: 'string',
								example: 'City',
							},
							state: {
								type: 'string',
								example: 'State',
							},
							zipCode: {
								type: 'string',
								example: '00000000',
							},
						},
					},
				},
			},
			RestaurantData: {
				type: 'object',
				properties: {
					fantasyName: {
						type: 'string',
						example: 'Fantasy Name',
					},
					corporateName: {
						type: 'string',
						example: 'Corporate Name',
					},
					cnpj: {
						type: 'string',
						example: '00000000000000',
					},
					type: {
						type: 'string',
						enum: ['SNACK_BAR', 'FAST_FOOD', 'PIZZERIA', 'JAPANESE', 'ITALIAN', 'VEGETARIAN'],
						example: 'SNACK_BAR',
					},
					phoneNumber: {
						type: 'string',
						example: '00000000000',
					},
					email: {
						type: 'string',
						example: 'teste@gmail.com',
					},
					address: {
						type: 'object',
						properties: {
							street: {
								type: 'string',
								example: 'Street',
							},
							number: {
								type: 'string',
								example: '000',
							},
							complement: {
								type: 'string',
								example: 'Complement',
							},
							district: {
								type: 'string',
								example: 'District',
							},
							city: {
								type: 'string',
								example: 'City',
							},
							state: {
								type: 'string',
								example: 'ST',
							},
							zipCode: {
								type: 'string',
								example: '00000000',
							},
						},
					},
				},
			},
			ZodError: {
				title: 'Validation Error',
				type: 'object',
				properties: {
					issues: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								path: {
									type: 'string',
									example: 'page',
								},
								message: {
									type: 'string',
									example: 'A página deve ser maior que 0',
								},
							},
						},
					},
				},
			},
			NotFoundError: {
				title: 'Not Found Error',
				type: 'object',
				properties: {
					message: {
						type: 'string',
						example: 'Restaurante não encontrado',
					},
				},
			},
			InternalServerError: {
				title: 'Internal Server Error',
				type: 'object',
				properties: {
					message: {
						type: 'string',
						example: 'Erro interno no servidor',
					},
				},
			},
		},
	},
};

export default docs;
