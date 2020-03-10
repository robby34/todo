import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { Todo, cloneTodo } from '../model/todo.model';
import {
    getTodoListAction, getTodoListSuccessAction,
    toggleCompleteAction, toggleCompleteSuccessAction,
    getDetailedTodoAction, getDetailedTodoSuccessAction,
    updateTitleAction, updateTitleSuccessAction,
    updateDescriptionAction, updateDescriptionSuccessAction,
    todoErrorAction
} from './todo.actions';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { TodoService } from '../todo.service';
import { TodoEffects } from './todo.effects';
import { provideMockActions } from '@ngrx/effects/testing';

describe('TodoEffects', () => {

    let actions$: Observable<Action>;
    let effects: TodoEffects;
    let todoServiceSpy: jasmine.SpyObj<TodoService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('TodoService', ['list', 'update', 'getTodo']);

        TestBed.configureTestingModule({
            providers: [
                provideMockActions(() => actions$),
                TodoEffects,
                { provide: TodoService, useValue: spy }
            ]
        });

        effects = TestBed.get(TodoEffects);
        todoServiceSpy = TestBed.get(TodoService);
    });

    it('should return a stream with the success action getTodoListSuccessAction (containing the Todo list)', () => {
        const fakeTodos: Array<Todo> = [
            { id: 0, title: 'A first task', state: 'UNDONE' },
            { id: 1, title: 'A second task', state: 'UNDONE' },
            { id: 2, title: 'A third task', state: 'UNDONE' }
        ];

        actions$ = hot('-a', { a: getTodoListAction });
        const response = cold('-a|', { a: fakeTodos });
        todoServiceSpy.list.and.returnValue(response);

        const expected = cold('--b', { b: getTodoListSuccessAction({ todos: fakeTodos }) });
        expect(effects.loadTodos$)
            .withContext('The success action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should return a stream with the error action todoErrorAction (containing the getTodoListAction error)', () => {
        const error = new Error('Error occurred processing getTodoListAction !!!');

        actions$ = hot('-a', { a: getTodoListAction });
        const response = cold('-#|', {}, error);
        todoServiceSpy.list.and.returnValue(response);

        const expected = cold('--b', { b: todoErrorAction(error) });
        expect(effects.loadTodos$)
            .withContext('The error action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should only react for action getTodoListAction', () => {
        const fakeTodos: Array<Todo> = [{ id: 0, title: 'A task', state: 'UNDONE' }];

        actions$ = hot('-x--a', { x: { type: 'Whatever Action' }, a: getTodoListAction });
        todoServiceSpy.list.and.returnValue(of(fakeTodos));

        const expected = cold('----b', { b: getTodoListSuccessAction({ todos: fakeTodos }) });
        expect(effects.loadTodos$).toBeObservable(expected);
    });

    it('should return a stream with the success action toggleCompleteSuccessAction (containing Todo id, and the new state)', () => {
        const fakeTodos: Array<Todo> = [
            { id: 0, title: 'A first task', state: 'UNDONE' },
            { id: 1, title: 'A second task', state: 'UNDONE' },
            { id: 2, title: 'A third task', state: 'UNDONE' }
        ];
        const clonedTodo = cloneTodo(fakeTodos[1]);
        clonedTodo.state = 'DONE';

        // Prepare the stream raising the toggleCompleteAction with the Todo of id 1 in param (Todo is cloned as it is in the component)
        actions$ = hot('-a', { a: toggleCompleteAction({ todo: clonedTodo }) });
        const response = cold('-a|', {});
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('--b', { b: toggleCompleteSuccessAction({ todoId: 1, todoState: 'DONE' }) });
        expect(effects.toggleCompleteTodo$)
            .withContext('The success action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should return a stream with the error action todoErrorAction (containing the toggleCompleteAction error)', () => {
        const error = new Error('Error occurred processing toggleCompleteAction !!!');

        actions$ = hot('-a', { a: toggleCompleteAction({ todo: { id: 0, title: 'A task', state: 'UNDONE' } }) });
        const response = cold('-#|', {}, error);
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('--b', { b: todoErrorAction(error) });
        expect(effects.toggleCompleteTodo$)
            .withContext('The error action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should only react for action toggleCompleteAction', () => {
        const modifiedTodo: Todo = { id: 0, title: 'A task', state: 'DONE' };

        actions$ = hot('-x--a', { x: { type: 'Whatever Action' }, a: toggleCompleteAction({ todo: modifiedTodo }) });
        const response = cold('-a|', {});
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('-----b', { b: toggleCompleteSuccessAction({ todoId: 0, todoState: 'DONE' }) });
        expect(effects.toggleCompleteTodo$).toBeObservable(expected);
    });

    it('should return a stream with the success action getDetailedTodoSuccessAction (containing the Todo)', () => {
        const fakeTodo: Todo = { id: 2, title: 'A task', state: 'UNDONE' };

        actions$ = hot('-a', { a: getDetailedTodoAction({ todoId: 2 }) });
        const response = cold('-a|', { a: fakeTodo });
        todoServiceSpy.getTodo.and.returnValue(response);

        const expected = cold('--b', { b: getDetailedTodoSuccessAction(fakeTodo) });
        expect(effects.getDetailedTodo$)
            .withContext('The success action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should return a stream with the error action todoErrorAction (containing the getDetailedTodoAction error)', () => {
        const error = new Error('Error occurred processing getDetailedTodoAction !!!');

        actions$ = hot('-a', { a: getDetailedTodoAction({ todoId: 2 }) });
        const response = cold('-#|', {}, error);
        todoServiceSpy.getTodo.and.returnValue(response);

        const expected = cold('--b', { b: todoErrorAction(error) });
        expect(effects.getDetailedTodo$)
            .withContext('The error action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should only react for action getDetailedTodoAction', () => {
        const fakeTodo: Todo = { id: 5, title: 'A task', state: 'UNDONE' };

        actions$ = hot('-x--a', { x: { type: 'Whatever Action' }, a: getDetailedTodoAction({ todoId: 5 }) });
        todoServiceSpy.getTodo.and.returnValue(of(fakeTodo));

        const expected = cold('----b', { b: getDetailedTodoSuccessAction(fakeTodo) });
        expect(effects.getDetailedTodo$).toBeObservable(expected);
    });

    it('should return a stream with the success action updateTitleSuccessAction (containing Todo id, and the new title)', () => {
        // Prepare the stream raising the updateTitleAction with the Todo in param
        actions$ = hot('-a', { a: updateTitleAction({ todo: { id: 0, title: 'Modified title', state: 'UNDONE' } }) });
        const response = cold('-a|', {});
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('--b', { b: updateTitleSuccessAction({ todoId: 0, todoTitle: 'Modified title' }) });
        expect(effects.updateTitle$)
            .withContext('The success action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should return a stream with the error action todoErrorAction (containing the updateTitleAction error)', () => {
        const error = new Error('Error occurred processing updateTitleAction !!!');

        actions$ = hot('-a', { a: updateTitleAction({ todo: { id: 0, title: 'Modified title', state: 'UNDONE' } }) });
        const response = cold('-#|', {}, error);
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('--b', { b: todoErrorAction(error) });
        expect(effects.updateTitle$)
            .withContext('The error action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should return a stream with the success action updateDescriptionSuccessAction (containing Todo id, and new description)', () => {
        // Prepare the stream raising the updateTitleAction with the Todo in param
        actions$ = hot('-a', { a: updateDescriptionAction({ todo: { id: 0, title: 'T', state: 'DONE', description: 'Modified desc' } }) });
        const response = cold('-a|', {});
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('--b', { b: updateDescriptionSuccessAction({ todoId: 0, todoDescription: 'Modified desc' }) });
        expect(effects.updateDescription$)
            .withContext('The success action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should return a stream with the error action todoErrorAction (containing the updateDescriptionAction error)', () => {
        const error = new Error('Error occurred processing updateDescriptionAction !!!');

        actions$ = hot('-a', { a: updateDescriptionAction({ todo: { id: 0, title: 'T', state: 'DONE', description: 'Modified desc' } }) });
        const response = cold('-#|', {}, error);
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('--b', { b: todoErrorAction(error) });
        expect(effects.updateDescription$)
            .withContext('The error action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

});
