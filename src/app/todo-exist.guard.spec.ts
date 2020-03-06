import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodoExistGuard } from './todo-exist.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { TodoService } from './todo.service';
import { of } from 'rxjs';
import { convertToParamMap, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { cold } from 'jasmine-marbles';

describe('TodoExistGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [TodoExistGuard]
    });
  });

  it('should allow activation if Todo exists', () => {
    const todoService: TodoService = TestBed.get(TodoService);
    spyOn(todoService, 'getTodo').and.returnValue(of({ id: 4, title: 'Task', state: 'DONE' }));

    const expected = cold('(a|)', { a: true });
    const next = { paramMap: convertToParamMap({ todoId: 4 }) } as ActivatedRouteSnapshot;
    const state = { url: '/todos/4' } as RouterStateSnapshot;
    const guard: TodoExistGuard = TestBed.get(TodoExistGuard);
    expect(guard.canActivate(next, state)).toBeObservable(expected);
  });

  it('should forbid activation if Todo does not exist, and should redirect to home', () => {
    const todoService: TodoService = TestBed.get(TodoService);
    const response = cold('-#', {}, new Error('Todo does not exist !'));
    spyOn(todoService, 'getTodo').and.returnValue(response);

    const router: Router = TestBed.get(Router);
    const urlTree: UrlTree = router.parseUrl('/');

    const expected = cold('-(a|)', { a: urlTree });
    const next = { paramMap: convertToParamMap({ todoId: 999 }) } as ActivatedRouteSnapshot;
    const state = { url: '/todos/999' } as RouterStateSnapshot;
    const guard: TodoExistGuard = TestBed.get(TodoExistGuard);
    expect(guard.canActivate(next, state)).toBeObservable(expected);
  });

});
