import { Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { ITask } from "../interfaces/task.interface";
import { ITaskFormControls } from "../interfaces/task-form-controls.interface";
import { TaskStatusEnum } from "../enums/task-status";
import { generateUniqueIdWithTimestamp } from "../utils/generate-unique-id-with-timestamp";
import { TaskStatus } from "../types/task-status";
import { IComment } from "../interfaces/comment.interface";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // Tarefas em A fazer
    private todoTasks$ = new BehaviorSubject<ITask[]>(
        this.loadTasksFromLocalStorage(TaskStatusEnum.TODO)
    );
    readonly todoTasks = this.todoTasks$.asObservable()
        .pipe(
            map(tasks => structuredClone(tasks)),
            tap(tasks => this.saveTasksToLocalStorage(TaskStatusEnum.TODO, tasks))
        )

    // Tarefas em Andamento
    private doingTasks$ = new BehaviorSubject<ITask[]>(
        this.loadTasksFromLocalStorage(TaskStatusEnum.DOING)
    );
    readonly doingTasks = this.doingTasks$.asObservable()
        .pipe(
            map(tasks => structuredClone(tasks)),
            tap(tasks => this.saveTasksToLocalStorage(TaskStatusEnum.DOING, tasks))
        )

    // Tarefas em Concluídas
    private doneTasks$ = new BehaviorSubject<ITask[]>(
        this.loadTasksFromLocalStorage(TaskStatusEnum.DONE)
    );
    readonly doneTasks = this.doneTasks$.asObservable()
        .pipe(
            map(tasks => structuredClone(tasks)),
            tap(tasks => this.saveTasksToLocalStorage(TaskStatusEnum.DONE, tasks))
        )

    addTask(taskInfos: ITaskFormControls) {
        const newTask: ITask = {
            ...taskInfos,
            status: TaskStatusEnum.TODO,
            id: generateUniqueIdWithTimestamp(),
            comments: [],
        }

        const currentList = this.todoTasks$.value;

        this.todoTasks$.next([...currentList, newTask])
    }

    updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, taskNextStatus: TaskStatus) {
        const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
        const nextTaskList = this.getTaskListByStatus(taskNextStatus);
        const currentTask = currentTaskList.value.find(task => task.id === taskId);

        if (currentTask) {
            //atualiza o status da tarefa
            currentTask.status = taskNextStatus;

            //remove a tarefa da lista atual
            const currentTaskListWithoutTask = currentTaskList.value.filter(task => task.id !== taskId);
            currentTaskList.next([...currentTaskListWithoutTask]);

            //adiciona a tarefa na próxima lista
            nextTaskList.next([...nextTaskList.value, { ...currentTask }]);
        }
    }

    updateTaskNameAndDescription(taskId: string, taskCurrentStatus: TaskStatus, newTaskName: string, newTaskDescription: string) {
        const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
        const currentTaskIndex = currentTaskList.value.findIndex(task => task.id === taskId);

        if (currentTaskIndex > -1) {
            const updatedTaskList = [...currentTaskList.value];

            updatedTaskList[currentTaskIndex] = {
                ...updatedTaskList[currentTaskIndex],
                name: newTaskName,
                description: newTaskDescription,
            }
            currentTaskList.next(updatedTaskList);
      }
    }

    updateTaskComments(taskId: string, taskCurrentStatus: TaskStatus, newTaskComments: IComment[]) {
        const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
        const currentTaskIndex = currentTaskList.value.findIndex(task => task.id === taskId);

        if (currentTaskIndex > -1) {
            const updatedTaskList = [...currentTaskList.value];
            updatedTaskList[currentTaskIndex] = {
                ...updatedTaskList[currentTaskIndex],
                comments: [...newTaskComments],
            }
            currentTaskList.next(updatedTaskList);
      }
    }

    deleteTask(taskId: string, taskCurrentStatus: TaskStatus) {
        const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
        const newTaskList = currentTaskList.value.filter(task => task.id !== taskId);
        currentTaskList.next(newTaskList);
    }

    private loadTasksFromLocalStorage(key: string){
        try {
            const storedTasks = localStorage.getItem(key)
            return storedTasks ? JSON.parse(storedTasks) : []
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
        }
    }

    private saveTasksToLocalStorage(key: string, tasks: ITask[]) {
        try {
            localStorage.setItem(key, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    }

    private getTaskListByStatus(taskStatus: TaskStatus) {
        const taskLists = {
            [TaskStatusEnum.TODO]: this.todoTasks$,
            [TaskStatusEnum.DOING]: this.doingTasks$,
            [TaskStatusEnum.DONE]: this.doneTasks$,
        }

        return taskLists[taskStatus];
    }
}