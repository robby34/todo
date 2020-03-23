import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from './model/todo.state';
import { Store } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule, MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ErrorSnackbarComponent } from './error-snackbar/error-snackbar.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddComponent } from './add/add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let mockStore: MockStore<{ todos: AppState }>;
  const initialState = {
    todos: {
      todoList: [],
      detailedTodo: null,
      todoError: null
    }
  };

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserAnimationsModule, MatToolbarModule, MatCardModule, MatCheckboxModule, MatListModule, MatSnackBarModule, MatIconModule,
          MatTooltipModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
          RouterTestingModule, HttpClientTestingModule],
        declarations: [AppComponent, TodoListComponent, ErrorSnackbarComponent, AddComponent],
        providers: [
          provideMockStore({ initialState }),
          { provide: MAT_SNACK_BAR_DATA }
        ]
      })
      // With Material dialogs and snackers, we create our components dynamically. They are added to the entryComponents of the module.
      // Then, we should also do it in tests, but entryComponents is not available in tests => so we use overrideModule.
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ErrorSnackbarComponent] } });

    fixture = TestBed.createComponent(AppComponent);
    mockStore = TestBed.get<Store<{ todos: AppState }>>(Store);

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.get(MatSnackBar).dismiss();
  });

  it('should display a toolbar', () => {
    const element = fixture.nativeElement;
    expect(element.querySelector('mat-toolbar'))
      .withContext('You probably forgot to add the Material Toolbar to the AppComponent template')
      .not.toBeNull();

    expect(element.querySelector('mat-toolbar').textContent)
      .withContext('You probably forgot to display a beautiful text with the word \'TODO\' in the toolbar')
      .toContain('TODO');
  });

  it('should display an error notification if todoError is present into the Store', () => {
    // Set a State having an error
    const error: Error = new Error('test error message !!!!');
    mockStore.setState({ todos: { todoList: null, detailedTodo: null, todoError: error } });
    mockStore.refreshState();
    fixture.detectChanges();
    // Checks
    const containerElement = TestBed.get(OverlayContainer).getContainerElement().querySelector('snack-bar-container');
    expect(containerElement.textContent).toContain(error.message);
  });

  it('should display an error notification with a generic message if todoError is present into the Store', () => {
    // Set a State having an error without message
    const errorWithoutMessage: Error = new Error();
    mockStore.setState({ todos: { todoList: null, detailedTodo: null, todoError: errorWithoutMessage } });
    mockStore.refreshState();
    fixture.detectChanges();
    // Checks
    const containerElement = TestBed.get(OverlayContainer).getContainerElement().querySelector('snack-bar-container');
    expect(containerElement.textContent).toContain('Error occurred');
  });

});
