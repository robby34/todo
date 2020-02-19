import { Component, OnInit } from '@angular/core';
import { AppState } from '../model/todo.state';
import { Store, select } from '@ngrx/store';
import { Todo } from '../model/todo.model';

@Component({
  selector: 'todo-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todoList: Array<Todo> = [];

  constructor(private store: Store<{ todos: AppState }>) {
    this.store.pipe(select('todos')).subscribe(
      todos => this.todoList = todos.todoList
    );
  }

  ngOnInit() {
  }

}
