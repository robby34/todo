import { createReducer, on, Action } from '@ngrx/store';
import { getTodoListSuccessAction, getTodoListErrorAction } from './todo.actions';
import { AppState } from '../model/todo.state';

const reducer = createReducer(
    // Initialize our State with all fields set to null
    { todoList: null, todoError: null },
    on(getTodoListSuccessAction, (state: AppState, { payload }) => ({ ...state, todoList: payload, todoError: null })),
    on(getTodoListErrorAction, (state: AppState, error) => ({ ...state, todoError: error }))
);

export function todoReducer(state: AppState, action: Action) {
    return reducer(state, action);
}
