import { createAction, props } from '@ngrx/store';
import { Todo } from '../model/todo.model';

// General "Error" action
export const todoErrorAction = createAction('[Todo] - Error', props<Error>());

// "Load Todo list" actions
export const getTodoListAction = createAction('[Todo] - Load Todo list');
export const getTodoListSuccessAction = createAction('[Todo] - Load Todo list success', props<{ todos: Array<Todo> }>());

// "Get detailed Todo" actions
export const getDetailedTodoAction = createAction('[Todo] - Get detailed Todo', props<{ todoId: number }>());
export const getDetailedTodoSuccessAction = createAction('[Todo] - Get detailed Todo success', props<Todo>());

// "Toggle complete Todo" actions
export const toggleCompleteAction = createAction('[Todo] - Toggle complete Todo', props<{ todo: Todo }>());
export const toggleCompleteSuccessAction = createAction('[Todo] - Toggle complete Todo success',
    props<{ todoId: number, todoState: 'DONE' | 'UNDONE' }>());

// "Update title" actions
export const updateTitleAction = createAction('[Todo] - Update title', props<{ todo: Todo }>());
export const updateTitleSuccessAction = createAction('[Todo] - Update title success',
    props<{ todoId: number, todoTitle: string }>());

// "Update description" actions
export const updateDescriptionAction = createAction('[Todo] - Update description', props<{ todo: Todo }>());
export const updateDescriptionSuccessAction = createAction('[Todo] - Update description success',
    props<{ todoId: number, todoDescription: string }>());

// "Create Todo" actions
export const createTodoAction = createAction('[Todo] - Create Todo', props<{ todo: Todo }>());
export const createTodoSuccessAction = createAction('[Todo] - Create Todo success', props<Todo>());
