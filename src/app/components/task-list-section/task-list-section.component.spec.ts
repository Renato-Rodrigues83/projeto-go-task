import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListSectionComponent } from './task-list-section.component';

describe('TaskListSectionComponent', () => {
  let component: TaskListSectionComponent;
  let fixture: ComponentFixture<TaskListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
