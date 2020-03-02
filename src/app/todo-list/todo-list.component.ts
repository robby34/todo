import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../model/todo.state';
import { Store, select } from '@ngrx/store';
import { Todo, cloneTodo } from '../model/todo.model';
import { Observable, Subscription } from 'rxjs';
import { getTodoListAction, toggleCompleteAction } from '../ngrx/todo.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '../error-snackbar/error-snackbar.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { getTodoList, getTodoError } from '../ngrx/todo.selectors';

@Component({
  selector: 'todo-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {

  readonly todoList$: Observable<Array<Todo>>;
  readonly todoListError$: Observable<Error>;
  errorSubscription: Subscription;

  constructor(private store: Store<{ todos: AppState }>, private matSnackBar: MatSnackBar) {
    this.todoList$ = this.store.pipe(
      select(getTodoList)
    );

    this.todoListError$ = this.store.pipe(
      select(getTodoError)
    );
  }

  ngOnInit() {
    this.errorSubscription = this.todoListError$.subscribe(error => {
      if (error != null) {
        this.matSnackBar.openFromComponent(ErrorSnackbarComponent, { data: (error.message) });
      } else {
        this.matSnackBar.dismiss();
      }
    });

    this.store.dispatch(getTodoListAction());
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

  toggleComplete(event: MatCheckboxChange, todo: Todo) {
    // Keep the checkbox with the actual State (in case of error during Action)
    event.source.checked = todo.state === 'DONE';

    // Build a cloned Todo with the new state DONE/UNDONE to be pushed to the backend
    const clonedTodo = cloneTodo(todo);
    clonedTodo.state = event.checked ? 'DONE' : 'UNDONE';
    // Dispatch NgRx Action
    this.store.dispatch(toggleCompleteAction({ payload: clonedTodo }));
  }

}
