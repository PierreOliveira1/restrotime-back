import { CreateSchedule } from './dto/createSchedule.dto';
import { DeleteSchedules } from './dto/deleteSchedules.dto';
import { UpdateSchedules } from './dto/updateSchedules.dto';
import {
	createSchedulesUseCase,
	deleteSchedulesUseCase,
	getSchedulesUseCase,
	updateSchedulesUseCase,
} from './useCases';

export function createSchedules(id: string, schedules: CreateSchedule) {
	return createSchedulesUseCase(id, schedules);
}

export function getSchedules(id: string) {
	return getSchedulesUseCase(id);
}

export function updateSchedules(id: string, schedules: UpdateSchedules) {
	return updateSchedulesUseCase(id, schedules);
}

export function deleteSchedules(id: DeleteSchedules) {
	return deleteSchedulesUseCase(id);
}
