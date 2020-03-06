import { createReducer, on, Action } from '@ngrx/store';
import { getTodoListSuccessAction, toggleCompleteActionSuccess, todoErrorAction, getDetailedTodoSuccessAction } from './todo.actions';
import { AppState } from '../model/todo.state';
import { Todo } from '../model/todo.model';
import { getDetailedTodo } from './todo.selectors';

const reducer = createReducer(
    // Initialize our State with all fields set to null
    { todoList: null, detailedTodo: null, todoError: null },
    on(getTodoListSuccessAction, (state: AppState, { todos }) =>
        ({ ...state, todoList: todos, detailedTodo: null, todoError: null })),
    on(toggleCompleteActionSuccess, (state: AppState, { todoId, todoState }) => {
        return {
            ...state,
            todoList:
                state.todoList ?
                    state.todoList.map(element => {
                        if (element.id === todoId) {
                            return { ...element, state: todoState };
                        } else {
                            return element;
                        }
                    }) :
                    state.todoList,
            detailedTodo: { ...state.detailedTodo, state: todoState },
            todoError: null
        };
    }),
    on(getDetailedTodoSuccessAction, (state: AppState, todo: Todo) =>
        ({ ...state, detailedTodo: todo, todoError: null })),
    on(todoErrorAction, (state: AppState, error) => ({ ...state, todoList: null, detailedTodo: null, todoError: error }))
);

export function todoReducer(state: AppState, action: Action) {
    return reducer(state, action);
}
