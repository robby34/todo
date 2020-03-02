import { AppState } from '../model/todo.state';
import { createSelector } from '@ngrx/store';
import { Todo, compareTodo } from '../model/todo.model';

export const selectTodoList = (state: { todos: AppState }) => state.todos.todoList;
export const getTodoList = createSelector(
    selectTodoList,
    (todos: Array<Todo>) => {
        console.log('Selector on state.todos.todoList is notified for a new State');
        if (todos != null) {
            todos.sort(compareTodo);
            console.log('Sorted Todo list:');
            todos.map(todo => console.log(`todo${todo.id}=${JSON.stringify(todo)}`));
        }
        return todos;
    }
);

export const selectTodoError = (state: { todos: AppState }) => state.todos.todoError;
export const getTodoError = createSelector(
    selectTodoError,
    (error: Error) => {
        console.log('Selector on state.todos.todoError is notified for a new State');
        return error;
    }
);
