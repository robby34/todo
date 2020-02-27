import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from './model/todo.state';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let mockStore: MockStore<{ todos: AppState }>;
  const initialState = {
    todos: {
      todoList: [
        {
          id: 0,
          title: 'My first task',
          state: 'DONE',
          description: 'This is my first Task to do !!!',
          creationDate: new Date()
        },
        {
          id: 1,
          title: 'A new task',
          state: 'UNDONE',
          description: 'This is the description of the new task',
          creationDate: new Date()
        }
      ]
    },
    todoError: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule, MatCardModule, MatCheckboxModule, MatListModule, MatSnackBarModule, HttpClientTestingModule],
      declarations: [AppComponent, TodoListComponent],
      providers: [provideMockStore({ initialState })]
    });

    fixture = TestBed.createComponent(AppComponent);
    mockStore = TestBed.get<Store<{ todos: AppState }>>(Store);

    fixture.detectChanges();
  });

  it('should display a toolbar', async(() => {
    const element = fixture.nativeElement;
    expect(element.querySelector('mat-toolbar'))
      .withContext('You probably forgot to add the Material Toolbar to the AppComponent template')
      .not.toBeNull();

    expect(element.querySelector('mat-toolbar').textContent)
      .withContext('You probably forgot to display a beautiful text with the word \'TODO\' in the toolbar')
      .toContain('TODO');
  }));

  it('should use the TodoList component', async(() => {
    const element = fixture.debugElement;
    expect(element.query(By.directive(TodoListComponent)))
      .withContext('You probably forgot to add TodoList to the AppComponent template')
      .not.toBeNull();
  }));

});
