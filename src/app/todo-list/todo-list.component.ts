import { Component, OnInit } from '@angular/core';
import { AppState } from '../model/todo.state';
import { Store, select, createSelector } from '@ngrx/store';
import { Todo } from '../model/todo.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getTodoListAction } from '../ngrx/todo.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '../error-snackbar/error-snackbar.component';

@Component({
  selector: 'todo-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todoList$: Observable<Array<Todo>>;
  todoListError$: Observable<Error>;

  ngOnInit() {
    this.todoListError$.subscribe(error => {
      if (error != null) {
        this.matSnackBar.openFromComponent(ErrorSnackbarComponent, { data: error.message });
      } else {
        this.matSnackBar.dismiss();
      }
    });

    this.store.dispatch(getTodoListAction());
  }

  /**
   * Constructor using select on the hardcoded root field 'todos'.
   */
  constructor(private store: Store<{ todos: AppState }>, private matSnackBar: MatSnackBar) {
    this.todoList$ = this.store.pipe(
      select('todos'),
      map(state => state.todoList)
    );
    this.todoListError$ = this.store.pipe(
      select('todos'),
      map(state => state.todoError)
    );
  }

  // /**
  //  * Constructor using select on the hardcoded root field 'todos', in a different manner ;)
  //  */
  // constructor(private store: Store<{ todos: AppState }>, private matSnackBar: MatSnackBar) {
  //   this.todoList$ = this.store.select('todos').pipe(
  //     map(state => state.todoList)
  //   );
  //   this.todoListError$ = this.store.select('todos').pipe(
  //     map(state => state.todoError)
  //   );
  // }

  // /**
  //  * Using Selector (either with the a full MemoizedSelector, either just with a mapping function).
  //  */
  // constructor(private store: Store<{ todos: AppState }>, private matSnackBar: MatSnackBar) {
  //   // todoList$
  //   const selectTodoList = (state: { todos: AppState }) => state.todos.todoList;
  //   const getTodoList = createSelector(
  //     selectTodoList,
  //     (todos: Array<Todo>) => todos
  //   )
  //   this.todoList$ = this.store.pipe(select(getTodoList));
  //   // this.todoList$ = this.store.pipe(select(selectTodoList));

  //   // todoError$
  //   const selectTodoError = (state: { todos: AppState }) => state.todos.todoError;
  //   const getTodoError = createSelector(
  //     selectTodoError,
  //     (error: Error) => error
  //   )
  //   this.todoListError$ = this.store.pipe(select(getTodoError));
  //   // this.todoListError$ = this.store.pipe(select(selectTodoError));
  // }

}
