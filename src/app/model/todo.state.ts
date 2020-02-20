import { Todo } from './todo.model';

export interface AppState {
    todoList: Array<Todo>;
}

export const initialState = {
    todoList: [
        {
            id: 0,
            title: 'My first task',
            description: 'This is my first Task to do !!!',
            creationDate: new Date().setDate(new Date().getDate() - 3),
            state: 'DONE'
        },
        {
            id: 1,
            title: 'A new task',
            description: 'This is the description of the new task',
            creationDate: new Date(),
            state: 'UNDONE'
        }
    ]
};
