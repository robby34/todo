import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { AppState } from '../model/todo.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getTodoListAction } from '../ngrx/todo.actions';
import { MatSnackBarModule, MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '../error-snackbar/error-snackbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('TodoListComponent', () => {

  const initialState = {
    todos: {
      todoList: [
        { id: 0, title: 'My first task', state: 'DONE', description: 'This is my first Task to do !!!', creationDate: new Date() },
        { id: 1, title: 'A new task', state: 'UNDONE', description: 'This is the description of the new task', creationDate: new Date() }
      ]
    },
    todoError: null
  };
  let fixture: ComponentFixture<TodoListComponent>;
  let component: TodoListComponent;
  let mockStore: MockStore<{ todos: AppState }>;
  const actions$: Observable<Action> = null;

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [BrowserAnimationsModule, MatToolbarModule, MatCardModule, MatCheckboxModule, MatListModule, MatSnackBarModule,
          HttpClientTestingModule],
        declarations: [TodoListComponent, ErrorSnackbarComponent],
        providers: [
          provideMockStore({ initialState }),
          provideMockActions(() => actions$),
          { provide: MAT_SNACK_BAR_DATA }
        ]
      })
      // With Material dialogs and snackers, we create our components dynamically. They are added to the entryComponents of the module.
      // Then, we should also do it in tests, but entryComponents is not available in tests => so we use overrideModule.
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ErrorSnackbarComponent] } });

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.get<Store<{ todos: AppState }>>(Store);
    spyOn(mockStore, 'dispatch');

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.get(MatSnackBar).dismiss();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch the action getTodoListAction on init', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(getTodoListAction());
  });

  it('should display the Todos from the Store', () => {
    expect(fixture.nativeElement.querySelector('mat-card-subtitle').textContent).toContain('2');

    const items = fixture.nativeElement.querySelectorAll('.mat-list-item');
    expect(items.length).toBe(2);

    expect(items[0].textContent).toContain('My first task');
    expect(items[1].textContent).toContain('A new task');
  });

  it('should display new Todos when store is updating', () => {
    // Set a State having an empty Todo list
    mockStore.setState({ todos: { todoList: [], todoError: null } });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-card-subtitle').textContent).toContain('0');
    expect(fixture.nativeElement.querySelectorAll('.mat-list-item').length).toBe(0);

    // Set a next State having 1 Todo
    const nextState: AppState = {
      todoList: [
        { id: 0, title: 'A lonely task', state: 'UNDONE' }
      ],
      todoError: null
    };
    mockStore.setState({ todos: nextState });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-card-subtitle').textContent).toContain('1');
    expect(fixture.nativeElement.querySelectorAll('.mat-list-item').length).toBe(1);
  });

  it('should display an error notification if todoError is present into the Store', () => {
    // Set a State having an error
    const error: Error = new Error('test error message !!!!');
    mockStore.setState({ todos: { todoList: null, todoError: error } });
    mockStore.refreshState();
    fixture.detectChanges();
    // Checks
    const containerElement = TestBed.get(OverlayContainer).getContainerElement().querySelector('snack-bar-container');
    expect(containerElement.textContent).toContain(error.message);
  });

});
