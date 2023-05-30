import { OpenAPIV3 } from 'openapi-types';

const docs: Partial<OpenAPIV3.Document> = {
	paths: {
		'/restaurants/{id}/schedules': {
			post: {
				summary: 'Create a schedule',
				description: 'Create a schedule for a restaurant',
				tags: ['Schedules'],
				parameters: [
					{
						name: 'id',
						in: 'path',
						description: 'Restaurant id',
						required: true,
						schema: {
							type: 'string',
							example: '7982fcfe-5721-4632-bede-6000885be57d',
						},
					},
				],
				requestBody: {
					description: 'Schedule array',
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									schedules: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												dayOfWeek: {
													type: 'integer',
													example: 0,
												},
												openingTime: {
													type: 'string',
													example: '08:00:00',
												},
												closingTime: {
													type: 'string',
													example: '12:00:00',
												},
												openingTime2: {
													type: 'string',
													example: '14:00:00',
												},
												closingTime2: {
													type: 'string',
													example: '18:00:00',
												},
											},
										},
										example: [
											{
												dayOfWeek: 0,
												openingTime: '08:00:00',
												closingTime: '12:00:00',
												openingTime2: '14:00:00',
												closingTime2: '18:00:00',
											},
											{
												dayOfWeek: 1,
												openingTime: '08:00:00',
												closingTime: '12:00:00',
											},
											{
												dayOfWeek: 2,
												openingTime: '08:00:00',
												closingTime: '12:00:00',
												openingTime2: '14:00:00',
												closingTime2: '18:00:00',
											},
											{
												dayOfWeek: 3,
												openingTime: '08:00:00',
												closingTime: '12:00:00',
												openingTime2: '14:00:00',
												closingTime2: '18:00:00',
											},
											{
												dayOfWeek: 4,
												openingTime: '08:00:00',
												closingTime: '12:00:00',
												openingTime2: '14:00:00',
												closingTime2: '18:00:00',
											},
											{
												dayOfWeek: 5,
												openingTime: '08:00:00',
												closingTime: '12:00:00',
												openingTime2: '14:00:00',
												closingTime2: '18:00:00',
											},
											{
												dayOfWeek: 6,
												openingTime: '08:00:00',
												closingTime: '12:00:00',
												openingTime2: '14:00:00',
												closingTime2: '18:00:00',
											},
										],
									},
								},
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
									$ref: '#/components/schemas/Schedule',
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
			get: {
				summary: 'Get schedules',
				description: 'Get schedules for a restaurant',
				tags: ['Schedules'],
				parameters: [
					{
						name: 'id',
						in: 'path',
						description: 'Restaurant id',
						required: true,
						schema: {
							type: 'string',
							example: '7982fcfe-5721-4632-bede-6000885be57d',
						},
					},
				],
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Schedule',
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
				summary: 'Update schedules',
				description: 'Update schedules for a restaurant',
				tags: ['Schedules'],
				parameters: [
					{
						name: 'id',
						in: 'path',
						description: 'Restaurant id',
						required: true,
						schema: {
							type: 'string',
							example: 'd28183ea-6835-4ab7-89ac-44202e805169',
						},
					},
				],
				requestBody: {
					description: 'Schedules to update',
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id: {
											type: 'string',
											example: '6f9d2680-b0e2-4827-bb05-095ee5e401ee',
										},
										dayOfWeek: {
											type: 'number',
											example: 1,
										},
										openingTime: {
											type: 'string',
											example: '08:00:00',
										},
										closingTime: {
											type: 'string',
											example: '12:00:00',
										},
										openingTime2: {
											type: 'string',
											example: '14:00:00',
										},
										closingTime2: {
											type: 'string',
											example: '18:00:00',
										},
										restaurantId: {
											type: 'string',
											example: '65c54f1e-886e-45a0-8913-67e07bbf574f',
										},
									},
								},
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
									$ref: '#/components/schemas/Schedule',
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
			delete: {
				summary: 'Delete schedules',
				description: 'Delete schedules for a restaurant',
				tags: ['Schedules'],
				parameters: [
					{
						name: 'id',
						in: 'path',
						description: 'Restaurant id',
						required: true,
						schema: {
							type: 'string',
							example: '7982fcfe-5721-4632-bede-6000885be57d',
						},
					},
				],
				requestBody: {
					description: 'Schedules to delete',
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									schedules: {
										type: 'array',
										items: {
											type: 'string',
											example: '6f9d2680-b0e2-4827-bb05-095ee5e401ee',
										},
									},
								},
							},
						},
					},
				},
				responses: {
					'204': {
						description: 'No Content',
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
		},
	},
	components: {
		schemas: {
			Schedule: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							example: '7982fcfe-5721-4632-bede-6000885be57d',
						},
						dayOfWeek: {
							type: 'integer',
							example: 0,
						},
						openingTime: {
							type: 'string',
							example: '08:00:00',
						},
						closingTime: {
							type: 'string',
							example: '12:00:00',
						},
						openingTime2: {
							type: 'string',
							example: '14:00:00',
							nullable: true,
						},
						closingTime2: {
							type: 'string',
							example: '18:00:00',
							nullable: true,
						},
					},
				},
			},
		},
	},
};

export default docs;
// d28183ea-6835-4ab7-89ac-44202e805169

// "id": "a1218c29-2907-4cc2-a2f2-d5a1460b3f6d",
//     "dayOfWeek": 1,
