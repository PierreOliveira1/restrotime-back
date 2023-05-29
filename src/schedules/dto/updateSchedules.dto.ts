import zod from 'zod';
import { updateSchedulesValidator } from '../validators/updateSchedulesValidator';

export type UpdateSchedules = zod.infer<typeof updateSchedulesValidator>;
