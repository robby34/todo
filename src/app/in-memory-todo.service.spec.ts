import { TestBed } from '@angular/core/testing';

import { InMemoryTodoService } from './in-memory-todo.service';

describe('InMemoryTodoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InMemoryTodoService = TestBed.get(InMemoryTodoService);
    expect(service).toBeTruthy();
  });
});
