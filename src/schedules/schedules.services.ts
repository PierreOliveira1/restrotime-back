import { CreateSchedule } from './dto/createSchedule.dto';
import { createSchedulesUseCase } from './useCases';

export function createSchedules(id: string, schedules: CreateSchedule) {
	return createSchedulesUseCase(id, schedules);
}
