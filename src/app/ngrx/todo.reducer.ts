import { createReducer, on, Action } from '@ngrx/store';
import {
    todoErrorAction, getTodoListSuccessAction, getDetailedTodoSuccessAction,
    toggleCompleteSuccessAction, updateTitleSuccessAction, updateDescriptionSuccessAction,
    createTodoSuccessAction, deleteTodoSuccessAction
} from './todo.actions';
import { AppState } from '../model/todo.state';

const reducer = createReducer(
    // Initialize our State with all fields set to null
    { todoList: null, detailedTodo: null, todoError: null },

    on(todoErrorAction, (state: AppState, { error }) =>
        ({ ...state, todoList: null, detailedTodo: null, todoError: error })),

    on(getTodoListSuccessAction, (state: AppState, { todos }) =>
        ({ ...state, todoList: todos, detailedTodo: null, todoError: null })),

    on(getDetailedTodoSuccessAction, (state: AppState, { todo }) =>
        ({ ...state, detailedTodo: todo, todoError: null })),

    on(toggleCompleteSuccessAction, (state: AppState, { todoId, todoState, todoDoneDate }) => {
        return {
            ...state,
            todoList:
                state.todoList ?
                    state.todoList.map(element => {
                        if (element.id === todoId) {
                            return { ...element, state: todoState, doneDate: todoDoneDate };
                        } else {
                            return element;
                        }
                    }) :
                    state.todoList,
            detailedTodo:
                state.detailedTodo ?
                    { ...state.detailedTodo, state: todoState, doneDate: todoDoneDate } :
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
    }),

    on(deleteTodoSuccessAction, (state: AppState, { tabIndex }) => {
        return ({
            ...state,
            todoList: [
                ...state.todoList.slice(0, tabIndex),
                ...state.todoList.slice(tabIndex + 1, state.todoList.length)
            ],
            todoError: null
        });
    })
);

export function todoReducer(state: AppState, action: Action) {
    return reducer(state, action);
}
