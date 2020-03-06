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

describe('TodoComponent', () => {

  const initialState = {
    todos: {
      todoList: [
        { id: 0, title: 'Task A', state: 'UNDONE', description: 'This is my first Task to do !!!', creationDate: new Date() },
        { id: 1, title: 'Task B', state: 'DONE', description: 'This is the description of the new task', creationDate: new Date() }
      ]
    },
    detailedTodo: { id: 0, title: 'Task A', state: 'UNDONE', description: 'This is my first Task to do !!!', creationDate: new Date() },
    todoError: null
  };
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let mockStore: MockStore<{ todos: AppState }>;
  const actions$: Observable<Action> = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatToolbarModule, MatCardModule, MatCheckboxModule, MatListModule, MatSnackBarModule,
        RouterTestingModule, HttpClientTestingModule],
      declarations: [TodoComponent],
      providers: [
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
      ]
    });

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.get<Store<{ todos: AppState }>>(Store);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
