import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, select } from '@ngrx/store';
import { AppState } from './model/todo.state';
import { getTodoError } from './ngrx/todo.selectors';
import { ErrorSnackbarComponent } from './error-snackbar/error-snackbar.component';

@Component({
  selector: 'todo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private store: Store<{ todos: AppState }>, private matSnackBar: MatSnackBar) {
    this.store.pipe(
      select(getTodoError)
    ).subscribe(error => {
      if (error != null) {
        if (error.message != null && error.message.length > 0) {
          this.matSnackBar.openFromComponent(ErrorSnackbarComponent, { data: error.message });
        } else {
          console.error('Error occurred', error);
          this.matSnackBar.openFromComponent(ErrorSnackbarComponent, { data: 'Error occurred' });
        }
      } else {
        this.matSnackBar.dismiss();
      }
    });
  }

}
