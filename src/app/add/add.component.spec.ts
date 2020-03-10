import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddComponent } from './add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppState } from '../model/todo.state';
import { Store } from '@ngrx/store';

describe('AddComponent', () => {

  const initialState = {
    todos: {
      todoList: null,
      detailedTodo: null,
      todoError: null
    }
  };
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let mockStore: MockStore<{ todos: AppState }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
      declarations: [AddComponent],
      providers: [
        provideMockStore({ initialState })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.get<Store<{ todos: AppState }>>(Store);
    spyOn(mockStore, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an empty input at init, and a disabled button', () => {
    // Check the FormControl has an empty value
    expect(component.titleCtrl.value).toBe('');
    // Check the button is disabled
    const buttonElement = fixture.nativeElement.querySelector('button[disabled]');
    expect(buttonElement).toBeTruthy();
  });

  it('should activate the button once 1 character is entered', () => {
    // Enter a title for the new Todo
    component.titleCtrl.setValue('A');
    fixture.detectChanges();

    // Check the button is not disabled
    const buttonElement = fixture.nativeElement.querySelector('button[disabled]');
    expect(buttonElement).toBeFalsy();
  });

  it('should dispatch the action createTodoAction when click on the button', () => {
    // Prove that for the moment, no dispatch have been done
    expect(mockStore.dispatch).toHaveBeenCalledTimes(0);

    // Enter a title for the new Todo
    component.titleCtrl.setValue('Write some tests');
    fixture.detectChanges();

    // Click on the button
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    // Check the Store has been called for dispatch action
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
  });

  it('should reset the input and disable the button after clicking on the button', () => {
    // Enter a title for the new Todo
    component.titleCtrl.setValue('Write some tests');
    fixture.detectChanges();

    // Click on the button
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    // Check the FormControl has been reset
    expect(component.titleCtrl.value).toBeNull();
    // Check the button is disabled
    const buttonElement = fixture.nativeElement.querySelector('button[disabled]');
    expect(buttonElement).toBeTruthy();
  });

});
