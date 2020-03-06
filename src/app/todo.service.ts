import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './model/todo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Array<Todo>> {
    return this.http.get<Array<Todo>>(`${environment.baseUrl}/api/todos`);
  }

  getTodo(todoId: number): Observable<Todo> {
    return this.http.get<Todo>(`${environment.baseUrl}/api/todos/${todoId}`);
  }

  update(modifiedTodo: Todo): Observable<void> {
    return this.http.put<void>(`${environment.baseUrl}/api/todos/${modifiedTodo.id}`, modifiedTodo);
  }

}
