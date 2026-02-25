import { Component, inject } from '@angular/core';
import { TaskCardComponent } from "../task-card/task-card.component";
import { TaskService } from '../../services/task.service';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ITask } from '../../interfaces/task.interface';
import { AsyncPipe } from '@angular/common';
import { TaskStatus } from '../../types/task-status';
import { TaskStatusEnum } from '../../enums/task-status';
@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent, CdkDropList, CdkDrag, AsyncPipe],
  templateUrl: './task-list-section.component.html',
  styleUrl: './task-list-section.component.css'
})
export class TaskListSectionComponent {
  public readonly _taskService = inject(TaskService);

  onCardDrop(event: CdkDragDrop<ITask[]>) {
    this.moveCardToColunm(event);

    const taskId = event.item.data.id;
    const taskCurrentStatus = event.item.data.status;
    const droppedColumn = event.container.id;

    this.upadateTaskStatus(taskId, taskCurrentStatus, droppedColumn);
  }

  private upadateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, droppedColumn: string) {
    let taskNextStatus: TaskStatus;

    switch (droppedColumn) {
      case 'todo-column':
        taskNextStatus = TaskStatusEnum.TODO;
        break;
      case 'doing-column':
        taskNextStatus = TaskStatusEnum.DOING;
        break;
      case 'done-column':
        taskNextStatus = TaskStatusEnum.DONE;
        break;
      default:
        throw new Error(`Invalid dropped column: ${droppedColumn}`);
    }

    this._taskService.updateTaskStatus(taskId, taskCurrentStatus, taskNextStatus);
  }

  private moveCardToColunm(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
