import { AppState } from '../model/todo.state';
import { createSelector } from '@ngrx/store';
import { Todo, compareTodo } from '../model/todo.model';

const selectTodoList = (state: { todos: AppState }) => state.todos.todoList;
const selectDetailedTodo = (state: { todos: AppState }) => state.todos.detailedTodo;
const selectTodoError = (state: { todos: AppState }) => state.todos.todoError;

export const getTodoList = createSelector(
    selectTodoList,
    (todos: Array<Todo>) => {
        console.log('Selector getTodoList is notified for a new State on state.todos.todoList');
        if (todos != null) {
            todos.sort(compareTodo);
            // console.log('Sorted Todo list:');
            // todos.map(todo => console.log(`todo${todo.id}=${JSON.stringify(todo)}`));
        }
        return todos;
    }
);

export const getCountTodoList = createSelector(
    selectTodoList,
    (todos: Array<Todo>) => {
        const count: number = todos ? todos.length : 0;
        console.log('Selector getCountTodoList is notified for a new State on state.todos.todoList > number of Todo = ' + count);
        return count;
    }
);

export const getDetailedTodo = createSelector(
    selectDetailedTodo,
    (todo: Todo) => {
        console.log(`Selector getDetailedTodo is notified for a new State on state.todos.detailedTodo`);
        return todo;
    }
);

export const getTodoError = createSelector(
    selectTodoError,
    (error: Error) => {
        console.log('Selector getTodoError is notified for a new State on state.todos.todoError');
        return error;
    }
);
