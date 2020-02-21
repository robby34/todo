import { createAction, props } from '@ngrx/store';
import { Todo } from '../model/todo.model';

// "Load Todo list" actions
export const getTodoList = createAction('[Todo] - Load Todo list');
export const getTodoListSuccess = createAction('[Todo] - Load Todo list success', props<{ payload: Array<Todo> }>());
