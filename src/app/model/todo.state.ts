import { Todo } from './todo.model';

export interface AppState {
    todoList: Array<Todo>;
    todoError: Error;
}

export function substractDays(date: Date, nbDays: number): Date {
    date.setDate(date.getDate() - nbDays);
    return date;
}
