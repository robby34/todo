import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { Todo } from '../model/todo.model';
import { getTodoListAction, getTodoListSuccessAction, todoErrorAction } from './todo.actions';
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
        const spy = jasmine.createSpyObj('TodoService', ['list']);

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

    it('should return a stream with the error action todoErrorAction (containing an error message)', () => {
        const error = new Error('Error occurred !!!');

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

});
