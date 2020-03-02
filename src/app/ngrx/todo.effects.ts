import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '../todo.service';
import {
    getTodoListAction, getTodoListSuccessAction, toggleCompleteAction, toggleCompleteActionSuccess, todoErrorAction
} from './todo.actions';
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
                catchError((error: Error) => of(todoErrorAction(error)))
            )
        ))
    );

    toggleCompleteTodo$ = createEffect(() => this.actions$.pipe(
        ofType(toggleCompleteAction),
        switchMap(action => this.todoService.update(action.payload)
            .pipe(
                map(() => toggleCompleteActionSuccess({ todoId: action.payload.id, todoState: action.payload.state })),
                catchError((error: Error) => of(todoErrorAction(error)))
            )
        ))
    );

}
