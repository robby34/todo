import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo } from './model/todo.model';
import { environment } from 'src/environments/environment';

describe('TodoService', () => {

  let todoService: TodoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    todoService = TestBed.get(TodoService);
    http = TestBed.get(HttpTestingController);
  });

  afterAll(() => http.verify());

  it('should return an Observable of 2 Todos', () => {
    const fakeTodoList = [
      {
        id: 0,
        title: 'My first task',
        state: 'DONE',
        description: 'This is my first Task to do !!!',
        creationDate: new Date()
      },
      {
        id: 1,
        title: 'A new task',
        state: 'UNDONE',
        description: 'This is the description of the new task',
        creationDate: new Date()
      }
    ] as Array<Todo>;
    let receivedTodoList: Array<Todo> = [];

    // Call the service
    todoService.list().subscribe((todos: Array<Todo>) => receivedTodoList = todos);

    // Assert HTTP request has been called
    const request: TestRequest = http.expectOne(`${environment.baseUrl}/api/todos`);

    // Resolve the request by returning the 'fakeTodoList'
    request.flush(fakeTodoList);

    expect(receivedTodoList.length)
      .withContext('The `list` method should return an array of Todo wrapped in an Observable')
      .not.toBe(0);
    expect(receivedTodoList).toEqual(fakeTodoList);
  });

});
