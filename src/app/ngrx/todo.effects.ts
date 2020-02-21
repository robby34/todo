import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '../todo.service';
import { getTodoList, getTodoListSuccess } from './todo.actions';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable()
export class TodoEffects {

    constructor(private actions$: Actions, private todoService: TodoService) { }

    loadTodos$ = createEffect(() => this.actions$.pipe(
        ofType(getTodoList),
        mergeMap(() => this.todoService.list()
            .pipe(
                map(todos => getTodoListSuccess({ payload: todos })),
                catchError(() => EMPTY)
            )
        ))
    );

}
