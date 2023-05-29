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
