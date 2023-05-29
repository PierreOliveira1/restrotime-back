import zod from 'zod';
import { createSchedulesValidator } from '../validators/createSchedulesValidator';

export type CreateSchedule = zod.infer<typeof createSchedulesValidator>;
