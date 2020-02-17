import { Todo } from './todo.model';

export interface AppState {
    todoList: Array<Todo>;
}

export const initialState = {
    todoList: [
        {
            id: 0,
            summary: 'My first task',
            description: 'This is my first Task to do !!!'
        }
    ]
};
