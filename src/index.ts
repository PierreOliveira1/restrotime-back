import { createServer } from 'node:http';
import { app } from './app';
import { PORT } from '@/config/envs';

const server = createServer(app);

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
