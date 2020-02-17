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

}
