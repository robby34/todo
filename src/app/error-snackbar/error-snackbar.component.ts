import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'todo-error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.css']
})
export class ErrorSnackbarComponent {

  /**
   * Put the injected error message in public, because private causes the following compilation error when build in --prod:
   *    ERROR in src/app/error-snackbar/error-snackbar.component.html(1,25):
   *    Property 'errorMessage' is private and only accessible within class 'ErrorSnackbarComponent'.
   */
  constructor(@Inject(MAT_SNACK_BAR_DATA) private errorMessage: string) { }

}
