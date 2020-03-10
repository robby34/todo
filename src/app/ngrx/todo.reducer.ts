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

    on(todoErrorAction, (state: AppState, { error }) =>
        ({ ...state, todoList: null, detailedTodo: null, todoError: error })),

    on(getTodoListSuccessAction, (state: AppState, { todos }) =>
        ({ ...state, todoList: todos, detailedTodo: null, todoError: null })),

    on(getDetailedTodoSuccessAction, (state: AppState, { todo }) =>
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
            detailedTodo:
                state.detailedTodo ?
                    { ...state.detailedTodo, state: todoState } :
                    state.detailedTodo,
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
            detailedTodo:
                state.detailedTodo ?
                    { ...state.detailedTodo, title: todoTitle } :
                    state.detailedTodo,
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
            detailedTodo:
                state.detailedTodo ?
                    { ...state.detailedTodo, description: todoDescription } :
                    state.detailedTodo,
            todoError: null
        };
    }),

    on(createTodoSuccessAction, (state: AppState, { todo }) => {
        return ({
            ...state,
            todoList:
                state.todoList ?
                    [...state.todoList, todo] :
                    [todo],
            todoError: null
        });
    })
);

export function todoReducer(state: AppState, action: Action) {
    return reducer(state, action);
}
