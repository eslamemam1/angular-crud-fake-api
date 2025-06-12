import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetData } from './servise/get-data';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'task-manger';
  sentData = new FormGroup({
    titleSent: new FormControl<string>('', [
      Validators.required,
      Validators.min(6),
    ]),
    selectStat: new FormControl<string>('', Validators.required),
  });
  tasks: any[] = [];
  lastId: any = 0;
  private getData = inject(GetData);
  constructor() {
    this.getData.getTaskes().subscribe((res) => {
      this.tasks = res;
      this.lastId =
        this.tasks.length > 0 ? Math.max(...this.tasks.map((e) => e.id)) : 0;
    });
  }
  deleteTask(id: number) {
    this.getData.deleteTask(id).subscribe({
      next: () => {
        console.log(`تم حذف المهمة رقم ${id}`);
        // حدث المصفوفة بحذف العنصر محليًا من الواجهة
        this.tasks = this.tasks.filter((e) => e.id !== id);
      },
      error: (err) => console.error('فشل في حذف المهمة:', err),
    });
  }

  toggleCompleted(task: any) {
    const updatedTask = {
      ...task,
      completed: !task.completed,
    };

    this.getData.updateTask(task.id, updatedTask).subscribe({
      next: (res) => {
        // update UI after backend success
        task.completed = res.completed;
      },
      error: (err) => {
        console.error('فشل التحديث:', err);
      },
    });
  }

  submit() {
    if (this.sentData.valid) {
      console.log(this.sentData);
      console.log(this.sentData.value);
      console.log(this.lastId);
      const taskData = {
        id: ++this.lastId,
        title: this.sentData.value.titleSent as string,
        completed: this.sentData.value.selectStat === 'true',
      };
      this.getData.doPost(taskData).subscribe({
        next: (res) => {
          console.log('done', res);
          this.tasks.push(res); // تضيفه للقائمة
          this.sentData.reset(); // تفرغ النموذج
        },
        error: (err) => console.error('error', err),
      });
    }
  }
}
