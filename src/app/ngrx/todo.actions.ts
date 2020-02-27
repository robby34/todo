import { createAction, props } from '@ngrx/store';
import { Todo } from '../model/todo.model';

// "Load Todo list" actions
export const getTodoListAction = createAction('[Todo] - Load Todo list');
export const getTodoListSuccessAction = createAction('[Todo] - Load Todo list success', props<{ payload: Array<Todo> }>());
export const getTodoListErrorAction = createAction('[Todo] - Load Todo list error', props<Error>());
