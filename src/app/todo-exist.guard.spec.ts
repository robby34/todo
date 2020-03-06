import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodoExistGuard } from './todo-exist.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('TodoExistGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [TodoExistGuard]
    });
  });

  it('should ...', inject([TodoExistGuard], (guard: TodoExistGuard) => {
    expect(guard).toBeTruthy();
  }));

});
