import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { AppState } from '../model/todo.state';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import { getDetailedTodoAction, toggleCompleteAction, updateTitleAction, updateDescriptionAction } from '../ngrx/todo.actions';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { cloneTodo, Todo } from '../model/todo.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('TodoComponent', () => {

  const testedTodoId = 1;
  const activatedRoute = {
    snapshot: { paramMap: convertToParamMap({ todoId: testedTodoId }) }
  };
  const initialState = {
    todos: {
      todoList: [
        { id: 0, title: 'Task A', state: 'UNDONE', description: 'This is my first Task to do !!!', creationDate: new Date() },
        { id: 1, title: 'SHOULD NOT BE DISPLAYED', state: 'DONE', description: ' SHOULD NOT BE DISPLAYED', creationDate: new Date() }
      ],
      detailedTodo: { id: 1, title: 'Task B', state: 'DONE', description: 'Description B', creationDate: new Date() },
      todoError: null
    }
  };
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let mockStore: MockStore<{ todos: AppState }>;
  const actions$: Observable<Action> = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatToolbarModule, MatCardModule, MatCheckboxModule, MatListModule, MatSnackBarModule,
        RouterTestingModule, HttpClientTestingModule, MatFormFieldModule, MatInputModule, FormsModule],
      declarations: [TodoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
      ]
    });

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.get<Store<{ todos: AppState }>>(Store);
    spyOn(mockStore, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch the action getDetailedTodo on init, with the received Route param (todoId)', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(getDetailedTodoAction({ todoId: testedTodoId }));
  });

  it('should display the detailed Todo from the Store', () => {
    const titleElement = fixture.debugElement.query(By.css('input[ng-reflect-model]'));
    expect(titleElement.attributes['ng-reflect-model']).toBe('Task B');

    const dateElement = fixture.nativeElement.querySelector('.mat-card-subtitle');
    expect(dateElement.textContent.length).toBeGreaterThan(0);

    const descriptionElement = fixture.debugElement.query(By.css('textarea'));
    expect(descriptionElement.attributes['ng-reflect-model']).toBe('Description B');

    const checkedElement = fixture.nativeElement.querySelector('.mat-checkbox-checked');
    expect(checkedElement).toBeTruthy();
  });

  it('should dispatch the action toggleCompleteAction when tick the checkbox of a DONE Todo', () => {
    const doneTodo = initialState.todos.detailedTodo as Todo;
    expect(doneTodo.state).toBe('DONE');

    // Tick the checkbox of the detailed Todo (which is DONE at init)
    fixture.nativeElement.querySelector('.mat-checkbox-input').click();
    fixture.detectChanges();

    const clonedTodo = cloneTodo(doneTodo);
    clonedTodo.state = 'UNDONE';
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleCompleteAction({ todo: clonedTodo }));
  });

  it('should dispatch the action toggleCompleteAction when tick the checkbox of an UNDONE Todo', () => {
    // Update the Store with a new State
    const nextState: AppState = {
      todoList: [],
      detailedTodo: { id: 0, title: 'Task A', state: 'UNDONE', description: 'Description A', creationDate: new Date() },
      todoError: null
    };
    mockStore.setState({ todos: nextState });
    mockStore.refreshState();
    fixture.detectChanges();

    const undoneTodo = nextState.detailedTodo;
    expect(undoneTodo.state).toBe('UNDONE');

    // Tick the checkbox of the detailed Todo (which is UNDONE at init)
    fixture.nativeElement.querySelector('.mat-checkbox-input').click();
    fixture.detectChanges();

    const clonedTodo = cloneTodo(undoneTodo);
    clonedTodo.state = 'DONE';
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleCompleteAction({ todo: clonedTodo }));
  });

  it('should dispatch the action updateTitleAction when the title is changed from the UI', () => {
    const titleElement = fixture.nativeElement.querySelector('input[ng-reflect-model]');
    titleElement.value = 'New title';
    component.todo.title = 'New title'; // Just to see the new title

    titleElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(updateTitleAction({ todo: component.todo }));
  });

  it('should dispatch the action updateDescriptionAction when the description is changed from the UI', () => {
    const descriptionElement = fixture.nativeElement.querySelector('textarea');
    descriptionElement.value = 'New description';
    component.todo.description = 'New description'; // Just to see the new description

    descriptionElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(updateDescriptionAction({ todo: component.todo }));
  });

});
