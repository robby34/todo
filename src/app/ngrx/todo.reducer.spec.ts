import { todoReducer } from './todo.reducer';
import {
    todoErrorAction, getTodoListSuccessAction, getDetailedTodoSuccessAction, toggleCompleteSuccessAction,
    updateTitleSuccessAction, updateDescriptionSuccessAction, createTodoSuccessAction
} from './todo.actions';
import { Todo } from '../model/todo.model';

describe('TodoReducer', () => {

    const initState = { todoList: null, detailedTodo: null, todoError: null };

    it('should return the init state', () => {
        const newState = todoReducer(undefined, { type: 'Whatever Action' });

        expect(newState).toEqual(initState);
    });

    it('should update State with the new todoError', () => {
        const error = new Error();
        const newState = todoReducer(initState, todoErrorAction({ error }));

        expect(newState).toEqual({ ...initState, todoError: error });
    });

    it('should update State with the new todoList', () => {
        const todos: Array<Todo> = [
            { id: 0, title: 'My first task', state: 'UNDONE', description: 'This is my first Task to do !!!', creationDate: new Date() },
            { id: 1, title: 'A new task', state: 'DONE', description: 'This is the description of the new task', creationDate: new Date() }
        ];
        const newState = todoReducer(initState, getTodoListSuccessAction({ todos }));

        expect(newState).toEqual({ ...initState, todoList: todos });
    });

    it('should update State with the new detailedTodo', () => {
        const todo: Todo = { id: 0, title: 'Task A', state: 'DONE', description: 'Desc A', creationDate: new Date() };
        const newState = todoReducer(initState, getDetailedTodoSuccessAction({ todo }));

        expect(newState).toEqual({ ...initState, detailedTodo: todo });
    });

    it('should update State with the new UNDONE state of a Todo', () => {
        const state1 = {
            todoList: [
                { id: 0, title: 'Task A', state: 'UNDONE', description: 'Description A', creationDate: new Date() },
                { id: 1, title: 'Task B', state: 'DONE', description: 'Description B', creationDate: new Date() }
            ] as Array<Todo>,
            detailedTodo: { id: 1, title: 'Task B', state: 'DONE', description: 'Description B', creationDate: new Date() } as Todo,
            todoError: null
        };

        const state2 = todoReducer(state1, toggleCompleteSuccessAction({ todoId: 1, todoState: 'UNDONE' }));

        expect(state2).toEqual({
            ...state1,
            todoList: state1.todoList.map(element => {
                if (element.id === 1) {
                    return { ...element, state: 'UNDONE' };
                }
                return element;
            }),
            detailedTodo: { ...state1.detailedTodo, state: 'UNDONE' }
        });
    });

    it('should return the previous state when toggle a Todo although there is no Todo (in the list and in detailed)', () => {
        const newState = todoReducer(initState, toggleCompleteSuccessAction({ todoId: 1, todoState: 'UNDONE' }));

        expect(newState).toEqual(initState);
    });

    it('should update State with the new Todo\'s title', () => {
        const state1 = {
            todoList: [
                { id: 0, title: 'Task A', state: 'UNDONE', description: 'Description A', creationDate: new Date() },
                { id: 1, title: 'Task B', state: 'DONE', description: 'Description B', creationDate: new Date() }
            ] as Array<Todo>,
            detailedTodo: { id: 1, title: 'Task B', state: 'DONE', description: 'Description B', creationDate: new Date() } as Todo,
            todoError: null
        };

        const state2 = todoReducer(state1, updateTitleSuccessAction({ todoId: 1, todoTitle: 'New amazing title' }));

        expect(state2).toEqual({
            ...state1,
            todoList: state1.todoList.map(element => {
                if (element.id === 1) {
                    return { ...element, title: 'New amazing title' };
                }
                return element;
            }),
            detailedTodo: { ...state1.detailedTodo, title: 'New amazing title' }
        });
    });

    it('should return the previous state when change Todo\'s title although there is no Todo (in the list and in detailed)', () => {
        const newState = todoReducer(initState, updateTitleSuccessAction({ todoId: 1, todoTitle: 'New amazing title' }));

        expect(newState).toEqual(initState);
    });

    it('should update State with the new Todo\'s description', () => {
        const state1 = {
            todoList: [
                { id: 0, title: 'Task A', state: 'UNDONE', description: 'Description A', creationDate: new Date() },
                { id: 1, title: 'Task B', state: 'DONE', description: 'Description B', creationDate: new Date() }
            ] as Array<Todo>,
            detailedTodo: { id: 1, title: 'Task B', state: 'DONE', description: 'Description B', creationDate: new Date() } as Todo,
            todoError: null
        };

        const state2 = todoReducer(state1, updateDescriptionSuccessAction({ todoId: 1, todoDescription: 'New wonderful description' }));

        expect(state2).toEqual({
            ...state1,
            todoList: state1.todoList.map(element => {
                if (element.id === 1) {
                    return { ...element, description: 'New wonderful description' };
                }
                return element;
            }),
            detailedTodo: { ...state1.detailedTodo, description: 'New wonderful description' }
        });
    });

    it('should return the previous state when change Todo\'s title although there is no Todo (in the list and in detailed)', () => {
        const newState = todoReducer(initState, updateDescriptionSuccessAction({ todoId: 1, todoDescription: 'New description' }));

        expect(newState).toEqual(initState);
    });

    it('should update State with the first new Todo', () => {
        const newTodo = { id: 0, title: 'Task A', state: 'UNDONE', description: 'Description A', creationDate: new Date() };

        const newState = todoReducer(initState, createTodoSuccessAction({ todo: newTodo as Todo }));

        expect(newState).toEqual({
            ...initState,
            todoList: [newTodo]
        });
    });

    it('should update State with the second new Todo', () => {
        const state1 = {
            todoList: [
                { id: 0, title: 'Task A', state: 'UNDONE', description: 'Description A', creationDate: new Date() },
                { id: 1, title: 'Task B', state: 'DONE', description: 'Description B', creationDate: new Date() }
            ] as Array<Todo>,
            detailedTodo: null,
            todoError: null
        };
        const newTodo = { id: 0, title: 'Task A', state: 'UNDONE', description: 'Description A', creationDate: new Date() };

        const state2 = todoReducer(state1, createTodoSuccessAction({ todo: newTodo as Todo }));

        expect(state2).toEqual({
            ...state1,
            todoList: [...state1.todoList, newTodo]
        });
    });

});
