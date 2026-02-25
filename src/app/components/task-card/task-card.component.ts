import { Component, inject, Input } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';
import { ITask } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskCommentsModalComponent } from '../task-comments-modal/task-comments-modal.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [SlicePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {

  @Input({ required: true }) task!: ITask;

  private readonly _modalControllerService = inject(ModalControllerService);
  private readonly _taskService = inject(TaskService);

  openEditTaskModal() {
    const dialogRef = this._modalControllerService.openEditTaskModal({
      name: this.task.name,
      description: this.task.description,
    });

    dialogRef.closed.subscribe((taskForm) => {
      if (taskForm) {
        this._taskService.updateTaskNameAndDescription(
          this.task.id, 
          this.task.status, 
          taskForm.name, 
          taskForm.description);
      }
    });
  }

  openTaskCommentsModal() {
    const dialogRef = this._modalControllerService.openTaskCommentsModal(this.task);

    dialogRef.closed.subscribe((taskCommentsChanged) => {
      if (taskCommentsChanged) {
        console.log('tarefa atualizada', this.task)
        this._taskService.updateTaskComments(this.task.id, this.task.status, this.task.comments);
      }

    })
  }

  deleteTask() {
    this._taskService.deleteTask(this.task.id, this.task.status);
  }
}
