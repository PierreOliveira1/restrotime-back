import { config } from 'dotenv';

config();

export const PORT = Number(process.env.PORT);
