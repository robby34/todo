import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { AppState, substractDays } from '../model/todo.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getTodoListAction, toggleCompleteAction } from '../ngrx/todo.actions';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Todo, cloneTodo } from '../model/todo.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('TodoListComponent', () => {

  const initialState = {
    todos: {
      todoList: null,
      detailedTodo: null,
      todoError: null
    }
  };
  let fixture: ComponentFixture<TodoListComponent>;
  let component: TodoListComponent;
  let mockStore: MockStore<{ todos: AppState }>;
  const actions$: Observable<Action> = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatToolbarModule, MatCardModule, MatCheckboxModule, MatListModule, MatSnackBarModule,
        RouterTestingModule, HttpClientTestingModule],
      declarations: [TodoListComponent],
      providers: [
        provideMockStore({ initialState }),
        provideMockActions(() => actions$)
      ]
    });

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
    // Set a State having 2 Todos
    mockStore.setState({
      todos: {
        todoList: [
          { id: 0, title: 'My first task', state: 'UNDONE', description: 'This is my first Task to do !!!', creationDate: new Date() },
          { id: 1, title: 'A new task', state: 'DONE', description: 'This is the description of the new task', creationDate: new Date() }
        ],
        detailedTodo: null,
        todoError: null
      }
    });
    mockStore.refreshState();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.mat-list-item');
    expect(items.length).toBe(2);

    expect(items[0].textContent).toContain('My first task');
    expect(items[1].textContent).toContain('A new task');
  });

  it('should display new Todos when store is updating', () => {
    // Set a State having an empty Todo list
    mockStore.setState({ todos: { todoList: [], detailedTodo: null, todoError: null } });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.mat-list-item').length).toBe(0);

    // Set a next State having 1 Todo
    const nextState: AppState = {
      todoList: [
        { id: 0, title: 'A lonely task', state: 'UNDONE' }
      ],
      detailedTodo: null,
      todoError: null
    };
    mockStore.setState({ todos: nextState });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.mat-list-item').length).toBe(1);
  });

  it('should dispatch the action toggleCompleteAction when tick a checkbox of an UNDONE Todo', () => {
    // Set a State having 2 Todos
    const nextState: AppState = {
      todoList: [
        { id: 0, title: 'My first task', state: 'UNDONE', description: 'This is my first Task to do !!!', creationDate: new Date() },
        { id: 1, title: 'A new task', state: 'DONE', description: 'This is the description of the new task', creationDate: new Date() }
      ],
      detailedTodo: null,
      todoError: null
    };
    mockStore.setState({ todos: nextState });
    mockStore.refreshState();
    fixture.detectChanges();

    const undoneTodo = nextState.todoList[0] as Todo;
    expect(undoneTodo.state).toBe('UNDONE');

    // Tick the checkbox of the first Todo (which is UNDONE at init)
    fixture.nativeElement.querySelectorAll('.mat-checkbox-input')[0].click();
    fixture.detectChanges();

    const clonedTodo = cloneTodo(undoneTodo);
    clonedTodo.state = 'DONE';
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleCompleteAction({ todo: clonedTodo }));
  });

  it('should dispatch the action toggleCompleteAction when tick a checkbox of a DONE Todo', () => {
    // Set a State having 2 Todos
    const nextState: AppState = {
      todoList: [
        { id: 0, title: 'My first task', state: 'UNDONE', description: 'This is my first Task to do !!!', creationDate: new Date() },
        { id: 1, title: 'A new task', state: 'DONE', description: 'This is the description of the new task', creationDate: new Date() }
      ],
      detailedTodo: null,
      todoError: null
    };
    mockStore.setState({ todos: nextState });
    mockStore.refreshState();
    fixture.detectChanges();

    const doneTodo = nextState.todoList[1] as Todo;
    expect(doneTodo.state).toBe('DONE');

    // Tick the checkbox of the second Todo (which is DONE at init)
    fixture.nativeElement.querySelectorAll('.mat-checkbox-input')[1].click();
    fixture.detectChanges();

    const clonedTodo = cloneTodo(doneTodo);
    clonedTodo.state = 'UNDONE';
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleCompleteAction({ todo: clonedTodo }));
  });

  it('should sort the Todos, first by state (DONE at bottom), second by creation date (most recent first)', () => {
    const dateToday = new Date();
    const dateYesterday = substractDays(new Date(), 1);
    const dateOld = substractDays(new Date(), 100);
    const dateVeryOld = substractDays(new Date(), 300);
    const fakeTodoList: Array<Todo> = [
      { id: 0, title: 'task A', state: 'UNDONE', creationDate: dateYesterday },
      { id: 1, title: 'task B', state: 'DONE', creationDate: dateVeryOld },
      { id: 2, title: 'task C', state: 'UNDONE', creationDate: dateYesterday },
      { id: 3, title: 'task D', state: 'DONE', creationDate: dateOld },
      { id: 4, title: 'task E', state: 'UNDONE', creationDate: dateToday },
      { id: 5, title: 'task F', state: 'UNDONE' },
      { id: 6, title: 'task G', state: 'UNDONE' }
    ];

    mockStore.setState({ todos: { todoList: fakeTodoList, detailedTodo: null, todoError: null } });
    mockStore.refreshState();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.mat-list-item');
    expect(items[0].textContent).toContain('task E');
    expect(items[1].textContent).toContain('task A');
    expect(items[2].textContent).toContain('task C');
    expect(items[3].textContent).toContain('task F');
    expect(items[4].textContent).toContain('task G');
    expect(items[5].textContent).toContain('task D');
    expect(items[6].textContent).toContain('task B');
  });

});
