import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '../todo.service';
import { getTodoListAction, getTodoListSuccessAction, getTodoListErrorAction } from './todo.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TodoEffects {

    constructor(private actions$: Actions, private todoService: TodoService) { }

    loadTodos$ = createEffect(() => this.actions$.pipe(
        ofType(getTodoListAction),
        switchMap(() => this.todoService.list()
            .pipe(
                map(todos => getTodoListSuccessAction({ payload: todos })),
                catchError((error: Error) => of(getTodoListErrorAction(error)))
            )
        ))
    );

}
