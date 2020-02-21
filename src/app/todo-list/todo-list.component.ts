import { Component, OnInit } from '@angular/core';
import { AppState } from '../model/todo.state';
import { Store, select } from '@ngrx/store';
import { Todo } from '../model/todo.model';
import { TodoService } from '../todo.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getTodoList } from '../ngrx/todo.actions';

@Component({
  selector: 'todo-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todoList$: Observable<Array<Todo>>;

  constructor(private store: Store<{ todos: AppState }>) {
    this.todoList$ = this.store.select('todos').pipe(
      map(state => state.todoList)
    );
  }
  // constructor(private todoService: TodoService) {
  //   this.todoList$ = this.todoService.list();
  // }

  ngOnInit() {
    this.store.dispatch(getTodoList());
  }

}
