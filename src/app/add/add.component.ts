import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../model/todo.state';
import { createTodoAction } from '../ngrx/todo.actions';
import { Todo } from '../model/todo.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { getCountTodoList } from '../ngrx/todo.selectors';

@Component({
  selector: 'todo-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {

  addTodoForm: FormGroup;
  titleCtrl: FormControl;
  readonly todoListLength$: Observable<number>;
  todoCount: number;
  countSubscription: Subscription;

  constructor(private store: Store<{ todos: AppState }>, private fb: FormBuilder) {
    this.todoListLength$ = this.store.pipe(
      select(getCountTodoList)
    );
  }

  ngOnInit() {
    // Build the form
    this.titleCtrl = this.fb.control('');
    this.addTodoForm = this.fb.group({
      title: this.titleCtrl
    });

    // Subscribe on the Selector getCountTodoList, to known the number of Todos in the list
    this.countSubscription = this.todoListLength$.subscribe(
      length => this.todoCount = length
    );
  }

  ngOnDestroy(): void {
    this.countSubscription.unsubscribe();
  }

  addNewTodo() {
    /** ToBeDiscussed with WebFactory:
     * Id of a new Todo is not to be provided as the Backend is in charge to manage it.
     * But in the particular case there is no more Todo in Backend, we add a first new Todo specifying the id to 1.
     * Probably this specificity is only due to our mocked Backend with angular-in-memory-web-api ?
     */
    const newTodo = { id: (this.todoCount === 0 ? 1 : undefined), title: this.titleCtrl.value, state: 'UNDONE', creationDate: new Date() };
    this.store.dispatch(createTodoAction({ todo: newTodo as Todo }));
    this.titleCtrl.reset();
  }

}
