import { createReducer, on, Action } from '@ngrx/store';
import { getTodoListSuccess } from './todo.actions';
import { AppState } from '../model/todo.state';

const reducer = createReducer(
    { todoList: null }, // Initialize our State with 'todoList' set to null
    on(getTodoListSuccess, (state, { payload }) => ({ ...state, todoList: payload }))
);

export function todoReducer(state: AppState, action: Action) {
    return reducer(state, action);
}
