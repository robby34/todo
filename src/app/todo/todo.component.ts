import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../model/todo.state';
import { Todo, cloneTodo } from '../model/todo.model';
import { Observable, Subscription } from 'rxjs';
import {
  getDetailedTodoAction, toggleCompleteAction, updateTitleAction, updateDescriptionAction, getTodoListAction
} from '../ngrx/todo.actions';
import { getDetailedTodo, getTodoList } from '../ngrx/todo.selectors';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'todo-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {

  readonly todo$: Observable<Todo>;
  readonly todoList$: Observable<Array<Todo>>;
  /** ToBeDiscussed with WebFactory:
   * Warn: the class variable 'todo' is used to reflect the actual State of the detailed Todo in Store.
   * But it is also directly used as 'ngModel' for input fields, and then will be modified...
   * Is it a good practice ?
   */
  todo: Todo;
  todoSubscription: Subscription;
  todoList: Array<Todo>;
  todoListSubscription: Subscription;

  constructor(private store: Store<{ todos: AppState }>, private route: ActivatedRoute, private router: Router) {
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

    this.todoList$ = this.store.pipe(
      select(getTodoList)
    );
  }

  ngOnInit() {
    // Launch Action for getting the whole Todo list (used for the navigation)
    this.store.dispatch(getTodoListAction());

    // On each paramMap event, launch Action for getting the detailed Todo
    this.route.paramMap.subscribe(
      params => this.store.dispatch(getDetailedTodoAction({ todoId: +params.get('todoId') }))
    );

    this.todoListSubscription = this.todoList$.pipe(
      // When app is loaded, initial state has a null todo list, so skip it
      filter(list => list !== null),
      // Unsubscribe after the first list received (allows keeping the list in same order when toggle Todo)
      first()
    ).subscribe(
      todos => this.todoList = todos
    );
    this.todoSubscription = this.todo$.subscribe(
      todo => this.todo = todo
    );
  }

  ngOnDestroy() {
    this.todoListSubscription.unsubscribe();
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

  isFirstTodo(): boolean {
    const currentTodoIndex = this.todoList.indexOf(this.todoList.find(element => element.id === this.todo.id));
    return currentTodoIndex === 0;
  }

  isLastTodo(): boolean {
    const currentTodoIndex = this.todoList.indexOf(this.todoList.find(element => element.id === this.todo.id));
    return currentTodoIndex === this.todoList.length - 1;
  }

  nextTodo(): void {
    if (!this.isLastTodo()) {
      const currentTodoIndex = this.todoList.indexOf(this.todoList.find(element => element.id === this.todo.id));
      const nextTodoId = this.todoList[currentTodoIndex + 1].id;
      this.router.navigate(['/todos', nextTodoId]);
    }
  }

  previousTodo(): void {
    if (!this.isFirstTodo()) {
      const currentTodoIndex = this.todoList.indexOf(this.todoList.find(element => element.id === this.todo.id));
      const previousTodoId = this.todoList[currentTodoIndex - 1].id;
      this.router.navigate(['/todos', previousTodoId]);
    }
  }

}
