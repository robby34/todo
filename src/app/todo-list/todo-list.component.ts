import { Component, OnInit } from '@angular/core';
import { AppState } from '../model/todo.state';
import { Store, select } from '@ngrx/store';
import { Todo, cloneTodo } from '../model/todo.model';
import { Observable, Subscription } from 'rxjs';
import { getTodoListAction, toggleCompleteAction } from '../ngrx/todo.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { getTodoList, getTodoError } from '../ngrx/todo.selectors';

@Component({
  selector: 'todo-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  readonly todoList$: Observable<Array<Todo>>;
  readonly todoListError$: Observable<Error>;
  errorSubscription: Subscription;

  constructor(private store: Store<{ todos: AppState }>) {
    this.todoList$ = this.store.pipe(
      select(getTodoList)
    );

    this.todoListError$ = this.store.pipe(
      select(getTodoError)
    );
  }

  ngOnInit() {
    this.store.dispatch(getTodoListAction());
  }

  toggleComplete(event: MatCheckboxChange, todo: Todo) {
    // Keep the checkbox with the actual State (in case of error during Action)
    event.source.checked = todo.state === 'DONE';

    // Build a cloned Todo with the new state DONE/UNDONE to be pushed to the backend
    const clonedTodo = cloneTodo(todo);
    clonedTodo.state = event.checked ? 'DONE' : 'UNDONE';
    // Dispatch NgRx Action
    this.store.dispatch(toggleCompleteAction({ todo: clonedTodo }));
  }

}
