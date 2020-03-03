import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { Todo, cloneTodo } from '../model/todo.model';
import {
    getTodoListAction, getTodoListSuccessAction, todoErrorAction, toggleCompleteAction, toggleCompleteActionSuccess
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
        const spy = jasmine.createSpyObj('TodoService', ['list', 'update']);

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
        const payload: Array<Todo> = [
            { id: 0, title: 'A first task', state: 'UNDONE' },
            { id: 1, title: 'A second task', state: 'UNDONE' },
            { id: 2, title: 'A third task', state: 'UNDONE' }
        ];

        actions$ = hot('-a', { a: getTodoListAction });
        const response = cold('-a|', { a: payload });
        todoServiceSpy.list.and.returnValue(response);

        const expected = cold('--b', { b: getTodoListSuccessAction({ payload }) });
        expect(effects.loadTodos$)
            .withContext('The success action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should return a stream with the error action todoErrorAction (containing the getTodoListAction error message)', () => {
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
        const payload: Array<Todo> = [{ id: 0, title: 'A task', state: 'UNDONE' }];

        actions$ = hot('-x--a', { x: { type: 'Whatever Action' }, a: getTodoListAction });
        todoServiceSpy.list.and.returnValue(of(payload));

        const expected = cold('----b', { b: getTodoListSuccessAction({ payload }) });
        expect(effects.loadTodos$).toBeObservable(expected);
    });

    it('should return a stream with the success action toggleCompleteActionSuccess (containing Todo id, and the new state)', () => {
        const payload: Array<Todo> = [
            { id: 0, title: 'A first task', state: 'UNDONE' },
            { id: 1, title: 'A second task', state: 'UNDONE' },
            { id: 2, title: 'A third task', state: 'UNDONE' }
        ];
        const clonedTodo = cloneTodo(payload[1]);
        clonedTodo.state = 'DONE';

        // Prepare the stream raising the toggleCompleteAction with the Todo of id 1 in param (Todo is cloned as it is in the component)
        actions$ = hot('-a', { a: toggleCompleteAction({ payload: clonedTodo }) });
        const response = cold('-a|', {});
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('--b', { b: toggleCompleteActionSuccess({ todoId: 1, todoState: 'DONE' }) });
        expect(effects.toggleCompleteTodo$)
            .withContext('The success action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should return a stream with the error action todoErrorAction (containing the toggleCompleteAction error message)', () => {
        const error = new Error('Error occurred processing toggleCompleteAction !!!');

        actions$ = hot('-a', { a: toggleCompleteAction({ payload: { id: 0, title: 'A task', state: 'UNDONE' } }) });
        const response = cold('-#|', {}, error);
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('--b', { b: todoErrorAction(error) });
        expect(effects.toggleCompleteTodo$)
            .withContext('The error action should be raised after having wait for 10 + 10 frames')
            .toBeObservable(expected);
    });

    it('should only react for action toggleCompleteAction', () => {
        const modifiedTodo: Todo = { id: 0, title: 'A task', state: 'DONE' };

        actions$ = hot('-x--a', { x: { type: 'Whatever Action' }, a: toggleCompleteAction({ payload: modifiedTodo }) });
        const response = cold('-a|', {});
        todoServiceSpy.update.and.returnValue(response);

        const expected = cold('-----b', { b: toggleCompleteActionSuccess({ todoId: 0, todoState: 'DONE' }) });
        expect(effects.toggleCompleteTodo$).toBeObservable(expected);
    });

});
