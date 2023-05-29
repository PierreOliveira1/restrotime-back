import zod from 'zod';
import { deleteSchedulesValidator } from '../validators/deleteSchedulesValidator';

export type DeleteSchedules = zod.infer<typeof deleteSchedulesValidator>;
