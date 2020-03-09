import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../model/todo.state';
import { Todo, cloneTodo } from '../model/todo.model';
import { Observable, Subscription } from 'rxjs';
import { getDetailedTodoAction, toggleCompleteAction, updateTitleAction, updateDescriptionAction } from '../ngrx/todo.actions';
import { getDetailedTodo } from '../ngrx/todo.selectors';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'todo-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {

  readonly todo$: Observable<Todo>;
  /** ToBeDiscussed with WebFactory:
   * Warn: the class variable 'todo' is used to reflect the actual State of the detailed Todo in Store.
   * But it is also directly used as 'ngModel' for input fields, and then will be modified...
   * Is it a good practice ?
   */
  todo: Todo;
  todoSubscription: Subscription;

  constructor(private route: ActivatedRoute, private store: Store<{ todos: AppState }>) {
    /** ToBeDiscussed with WebFactory:
     * Implementation choice is to have a dedicated place ('detailedTodo') in the Store for the Todo being viewed in detail.
     * At init, this component asks for an action to get the Todo, and store it in the Store, in 'detailedTodo'.
     * It allows also to imagine a real detailed Todo, having much more data than the 'light' Todo.
     * When getting the Todo at init, the fact to store it in dedicated place instead of updating the Todo list reduce complexity
     * of the reducer (otherwize we have two cases: either the Todo is already present in Todo list and we have to update it, either
     * it is not yet present and we have to add it).
     * Disadvantage is for modifications: we have to think to update in Store both, the Todo in the Todo list,
     * and the Todo in 'detailedTodo'.
     */
    this.todo$ = this.store.pipe(
      select(getDetailedTodo)
    );
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('todoId');
    this.store.dispatch(getDetailedTodoAction({ todoId: id }));

    this.todoSubscription = this.todo$.subscribe(todo => {
      this.todo = todo;
    });
  }

  ngOnDestroy() {
    this.todoSubscription.unsubscribe();
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

  updateTitle(event: any) {
    // Dispatch NgRx Action with new title
    this.store.dispatch(updateTitleAction({ todo: this.todo }));
    // Remove the focus of the title field
    event.target.blur();
  }

  updateDescription(event: any) {
    // Dispatch NgRx Action with new description
    this.store.dispatch(updateDescriptionAction({ todo: this.todo }));
    // Remove the focus of the description field
    event.target.blur();
  }

}
