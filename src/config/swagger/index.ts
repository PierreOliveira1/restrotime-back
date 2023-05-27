import { OpenAPIV3 } from 'openapi-types';
import path from 'node:path';
import fs from 'node:fs';

type SwaggerDocument = () => Promise<OpenAPIV3.Document>;

const createSwaggerDocument: SwaggerDocument = async () => {
	const pathControllers = path.resolve(__dirname, '..', '..', 'controllers');
	const docsDirs = fs.readdirSync(pathControllers);

	const swaggerDocument: OpenAPIV3.Document = {
		openapi: '3.0.0',
		info: {
			title: 'RestroTime DOCS',
			version: '1.0.0',
			description: 'RestroTime DOCS',
		},
		paths: {},
		components: {
			schemas: {},
		},
	};

	for (const dir of docsDirs) {
		try {
			const isDocs = fs.existsSync(
				path.resolve(__dirname, '..', '..', 'controllers', dir, 'docs/index.ts')
			);

			if (!isDocs) continue;

			const { default: docs } = await import(`@controllers/${dir}/docs`);

			swaggerDocument.paths = {
				...swaggerDocument.paths,
				...docs.paths,
			};

			if (!swaggerDocument.components)
				swaggerDocument.components = { schemas: {} };

			swaggerDocument.components.schemas = {
				...swaggerDocument.components.schemas,
				...docs.components.schemas,
			};
		} catch (error) {
			console.error(error);
		}
	}

	return swaggerDocument;
};

export { createSwaggerDocument };
