import { createReducer, on, Action } from '@ngrx/store';
import { getTodoList } from './todo.actions';
import { AppState, initialState } from '../model/todo.state';
import { Todo } from '../model/todo.model';

const reducer = createReducer(initialState,
    on(getTodoList, state => state),
);

export function todoReducer(state: AppState, action: Action) {
    return reducer(state, action);
}
