import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { createSwaggerDocument } from '@/config/swagger';
import { Routes } from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', Routes);

createSwaggerDocument().then((swaggerDocument) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
});

export { app };
