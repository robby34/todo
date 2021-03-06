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
import { getTodoListAction, toggleCompleteAction, deleteTodoAction } from '../ngrx/todo.actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Todo } from '../model/todo.model';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddComponent } from '../add/add.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
      imports: [
        BrowserAnimationsModule, MatToolbarModule, MatCardModule, MatCheckboxModule, MatListModule, MatIconModule, MatTooltipModule,
        MatFormFieldModule, MatInputModule, ReactiveFormsModule,
        FormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [TodoListComponent, AddComponent],
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
          {
            id: 1, title: 'A new task', state: 'DONE', description: 'This is the description of the new task', creationDate: new Date(),
            doneDate: new Date()
          }
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
        {
          id: 1, title: 'A new task', state: 'DONE', description: 'This is the description of the new task', creationDate: new Date(),
          doneDate: new Date()
        }
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

    // TODO : We now have a problem to test toggleCompleteAction method arguments (because of doneDate) => idem as in add.component.spec.ts
    // expect(mockStore.dispatch).toHaveBeenCalledWith(
    //   toggleCompleteAction({ todo: { ...undoneTodo, state: 'DONE', dueDate: undefined, doneDate: ??? } })
    // );

    // 1st call is getTodoListAction, and then we have the call for toggleCompleteAction
    expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should dispatch the action toggleCompleteAction when tick a checkbox of a DONE Todo', () => {
    // Set a State having 2 Todos
    const nextState: AppState = {
      todoList: [
        { id: 0, title: 'My first task', state: 'UNDONE', description: 'This is my first Task to do !!!', creationDate: new Date() },
        {
          id: 1, title: 'A new task', state: 'DONE', description: 'This is the description of the new task', creationDate: new Date(),
          doneDate: new Date()
        }
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

    // The Todo in argument of the Action shall have a reset doneDate (undefined)
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      toggleCompleteAction({ todo: { ...doneTodo, state: 'UNDONE', dueDate: undefined, doneDate: undefined } })
    );
  });

  it('should sort the Todos, first by state (DONE at bottom), second by creation date (most recent first)', () => {
    const dateToday = new Date();
    const dateYesterday = substractDays(new Date(), 1);
    const dateOld = substractDays(new Date(), 100);
    const dateVeryOld = substractDays(new Date(), 300);
    const fakeTodoList: Array<Todo> = [
      { id: 0, title: 'task A', state: 'UNDONE', creationDate: dateYesterday },
      { id: 1, title: 'task B', state: 'DONE', doneDate: dateOld },
      { id: 2, title: 'task C', state: 'UNDONE', creationDate: dateYesterday },
      { id: 3, title: 'task D', state: 'DONE', doneDate: dateVeryOld },
      { id: 4, title: 'task E', state: 'UNDONE', creationDate: dateToday },
      { id: 5, title: 'task F', state: 'UNDONE' },
      { id: 6, title: 'task G', state: 'UNDONE' },
      { id: 3, title: 'task H', state: 'DONE' },
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
    expect(items[5].textContent).toContain('task H');
    expect(items[6].textContent).toContain('task D');
    expect(items[7].textContent).toContain('task B');
  });

  it('should dispatch the action deleteTodoAction when click on the trash icon button of a Todo', () => {
    // Set a State having 2 Todos
    const nextState: AppState = {
      todoList: [
        { id: 10, title: 'My first task', state: 'UNDONE', description: 'Desc A', creationDate: new Date() },
        { id: 11, title: 'A new task', state: 'DONE', description: 'Desc B', creationDate: new Date() },
        { id: 12, title: 'Again a new task', state: 'DONE', description: 'Desc C', creationDate: new Date() }
      ],
      detailedTodo: null,
      todoError: null
    };
    mockStore.setState({ todos: nextState });
    mockStore.refreshState();
    fixture.detectChanges();

    // Click the trash icon button of the second Todo (index 1 in the todoList array)
    fixture.nativeElement.querySelectorAll('button#delete')[1].click();
    fixture.detectChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(deleteTodoAction({ todoId: 11, tabIndex: 1 }));
  });

});
