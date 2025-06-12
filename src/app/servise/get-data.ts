import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetData {
  private taskes = 'http://localhost:3000/tasks';

  constructor(private _httpClient: HttpClient) {}

  getTaskes(): Observable<any[]> {
    return this._httpClient.get<any[]>(this.taskes);
  }
  deleteTask(id: number) {
    return this._httpClient.delete(`${this.taskes}/${id}`);
  }

  doPost(data: {
    id: number;
    title: string;
    completed: boolean;
  }): Observable<any> {
    return this._httpClient.post(this.taskes, data);
  }
  updateTask(
    id: number,
    data: { title: string; completed: boolean }
  ): Observable<any> {
    return this._httpClient.put(`${this.taskes}/${id}`, data);
  }
}
