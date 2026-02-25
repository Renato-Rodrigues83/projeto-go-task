import { TaskStatusEnum } from "../enums/task-status";

export type TaskStatus = TaskStatusEnum.TODO | TaskStatusEnum.DOING | TaskStatusEnum.DONE;