import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '../todo.service';
import {
    getTodoListAction, getTodoListSuccessAction,
    toggleCompleteAction, toggleCompleteActionSuccess,
    getDetailedTodoAction, getDetailedTodoSuccessAction,
    todoErrorAction
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
                map(receivedTodos => getTodoListSuccessAction({ todos: receivedTodos })),
                catchError((error: Error) => of(todoErrorAction(error)))
            )
        ))
    );

    getDetailedTodo$ = createEffect(() => this.actions$.pipe(
        ofType(getDetailedTodoAction),
        switchMap(action => this.todoService.getTodo(action.todoId)
            .pipe(
                map(todo => getDetailedTodoSuccessAction(todo)),
                catchError((error: Error) => of(todoErrorAction(error)))
            )
        ))
    );

    /** ToBeDiscussed with WebFactory:
     * The toggleCompleteAction receives a complete Todo object, because of the way to update the Backend (for now we only have
     * a mocked Backend with angular-in-memory-web-api).
     * The object has previously been cloned in the component (to don't have confusion and never change the State of the Store).
     * So we request the Backend with a cloned modified Todo, but should be more a request with the Todo id and the new DONE/UNDONE status.
     * This is only for the action toggleCompleteAction requesting the Backend. Afterthat, we launch the toggleCompleteActionSuccess
     * and for it, we pass only todoId, and todoState :)
     * NOTE that the use of NgRx Entity should probably be interesting for the management of the Todo with Partial objects.
     */
    toggleCompleteTodo$ = createEffect(() => this.actions$.pipe(
        ofType(toggleCompleteAction),
        switchMap(action => this.todoService.update(action.todo)
            .pipe(
                map(() => toggleCompleteActionSuccess({ todoId: action.todo.id, todoState: action.todo.state })),
                catchError((error: Error) => of(todoErrorAction(error)))
            )
        ))
    );

}
