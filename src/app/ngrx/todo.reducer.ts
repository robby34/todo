import { createReducer, on, Action } from '@ngrx/store';
import {
    todoErrorAction, getTodoListSuccessAction, getDetailedTodoSuccessAction,
    toggleCompleteSuccessAction, updateTitleSuccessAction, updateDescriptionSuccessAction,
    createTodoSuccessAction
} from './todo.actions';
import { AppState } from '../model/todo.state';
import { Todo } from '../model/todo.model';

const reducer = createReducer(
    // Initialize our State with all fields set to null
    { todoList: null, detailedTodo: null, todoError: null },

    on(todoErrorAction, (state: AppState, error) =>
        ({ ...state, todoList: null, detailedTodo: null, todoError: error })),

    on(getTodoListSuccessAction, (state: AppState, { todos }) =>
        ({ ...state, todoList: todos, detailedTodo: null, todoError: null })),

    on(getDetailedTodoSuccessAction, (state: AppState, todo: Todo) =>
        ({ ...state, detailedTodo: todo, todoError: null })),

    on(toggleCompleteSuccessAction, (state: AppState, { todoId, todoState }) => {
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

    on(updateTitleSuccessAction, (state: AppState, { todoId, todoTitle }) => {
        return {
            ...state,
            todoList:
                state.todoList ?
                    state.todoList.map(element => {
                        if (element.id === todoId) {
                            return { ...element, title: todoTitle };
                        } else {
                            return element;
                        }
                    }) :
                    state.todoList,
            detailedTodo: { ...state.detailedTodo, title: todoTitle },
            todoError: null
        };
    }),

    on(updateDescriptionSuccessAction, (state: AppState, { todoId, todoDescription }) => {
        return {
            ...state,
            todoList:
                state.todoList ?
                    state.todoList.map(element => {
                        if (element.id === todoId) {
                            return { ...element, description: todoDescription };
                        } else {
                            return element;
                        }
                    }) :
                    state.todoList,
            detailedTodo: { ...state.detailedTodo, description: todoDescription },
            todoError: null
        };
    }),

    on(createTodoSuccessAction, (state: AppState, todo: Todo) =>
        ({ ...state, todoList: [...state.todoList, todo] }))
);

export function todoReducer(state: AppState, action: Action) {
    return reducer(state, action);
}
