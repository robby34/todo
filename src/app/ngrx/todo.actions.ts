import { createAction, props } from '@ngrx/store';
import { Todo } from '../model/todo.model';

// "Load Todo list" actions
export const getTodoListAction = createAction('[Todo] - Load Todo list');
export const getTodoListSuccessAction = createAction('[Todo] - Load Todo list success', props<{ payload: Array<Todo> }>());

// "Toggle complete Todo" actions
export const toggleCompleteAction = createAction('[Todo] - Toggle complete Todo', props<{ payload: Todo }>());
export const toggleCompleteActionSuccess = createAction('[Todo] - Toggle complete Todo success',
    props<{ todoId: number, todoState: 'DONE' | 'UNDONE' }>());

// General "Error" action
export const todoErrorAction = createAction('[Todo] - Error', props<Error>());
