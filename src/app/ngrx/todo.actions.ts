import { createAction, props } from '@ngrx/store';
import { Todo } from '../model/todo.model';

// "Load Todo list" actions
export const getTodoListAction = createAction('[Todo] - Load Todo list');
export const getTodoListSuccessAction = createAction('[Todo] - Load Todo list success', props<{ todos: Array<Todo> }>());

// "Toggle complete Todo" actions
export const toggleCompleteAction = createAction('[Todo] - Toggle complete Todo', props<{ todo: Todo }>());
export const toggleCompleteActionSuccess = createAction('[Todo] - Toggle complete Todo success',
    props<{ todoId: number, todoState: 'DONE' | 'UNDONE' }>());

// "Get detailed Todo" actions
export const getDetailedTodoAction = createAction('[Todo] - Get detailed Todo', props<{ todoId: number }>());
export const getDetailedTodoSuccessAction = createAction('[Todo] - Get detailed Todo success', props<Todo>());

// General "Error" action
export const todoErrorAction = createAction('[Todo] - Error', props<Error>());
