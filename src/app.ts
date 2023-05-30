import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { createSwaggerDocument } from '@/config/swagger';
import { Routes } from './routes';
import cors from 'cors';
import { ORIGINS } from './config/envs';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	cors({
		origin: ORIGINS,
	}),
);
app.use('/', Routes);

createSwaggerDocument().then((swaggerDocument) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
});

export { app };
