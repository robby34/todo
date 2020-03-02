import { createReducer, on, Action } from '@ngrx/store';
import { getTodoListSuccessAction, toggleCompleteActionSuccess, todoErrorAction } from './todo.actions';
import { AppState } from '../model/todo.state';

const reducer = createReducer(
    // Initialize our State with all fields set to null
    { todoList: null, todoError: null },
    on(getTodoListSuccessAction, (state: AppState, { payload }) => ({ ...state, todoList: payload, todoError: null })),
    on(
        toggleCompleteActionSuccess,
        (state: AppState, { todoId, todoState }) => {
            return {
                ...state,
                todoList:
                    state.todoList.map(element => {
                        if (element.id === todoId) {
                            return { ...element, state: todoState };
                        } else {
                            return element;
                        }
                    }),
                todoError: null
            };
        }
    ),
    on(todoErrorAction, (state: AppState, error) => ({ ...state, todoError: error }))
);

export function todoReducer(state: AppState, action: Action) {
    return reducer(state, action);
}
