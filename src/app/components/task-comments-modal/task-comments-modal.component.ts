import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IComment } from '../../interfaces/comment.interface';
import { generateUniqueIdWithTimestamp } from '../../utils/generate-unique-id-with-timestamp';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css'
})
export class TaskCommentsModalComponent {

  taskCommentsChanged = false;

  commentControl = new FormControl('', [Validators.required])

  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>

  readonly _task: ITask = inject(DIALOG_DATA);
  readonly _dialogRef: DialogRef<boolean> = inject(DialogRef);  

  onAddComment() {
    // Cria um novo comentário com um ID único e a descrição do campo de comentário
    const newComment: IComment = {
      id: generateUniqueIdWithTimestamp(),
      description: this.commentControl.value ? this.commentControl.value : '',
    }

    // Adiciona o novo comentário no início da lista de comentários da tarefa
    this._task.comments.unshift(newComment);

    // Limpa o campo de comentário
    this.commentControl.reset();

    // Indica que os comentários foram alterados
    this.taskCommentsChanged = true;

    // Foca novamente no campo de comentário para facilitar a adição de múltiplos comentários
    this.commentInputRef.nativeElement.focus();
  }

  // Remove um comentário da tarefa com base no ID do comentário
  onRemoveComment(commentId: string) {
    this._task.comments = this._task.comments.filter(comment => comment.id !== commentId);
    this.taskCommentsChanged = true;
  }

  // Fecha o modal e retorna se os comentários foram alterados ou não
  onCloseModal() {
    this._dialogRef.close(this.taskCommentsChanged);
  }
}
