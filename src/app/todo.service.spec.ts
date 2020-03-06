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

  it('should return an Observable when want to list all the Todos', () => {
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
      .withContext('The subscription to the `list` Observable should send an HTTP request, returning an array of Todo')
      .not.toBe(0);
    expect(receivedTodoList).toEqual(fakeTodoList);
  });

  it('should return an Observable when want to update a Todo', () => {
    const modifiedTodo: Todo = {
      id: 13,
      title: 'A new task',
      state: 'UNDONE',
      description: 'This is the description of the new task',
      creationDate: new Date()
    };
    let responseReceived = false;

    // Call the service
    todoService.update(modifiedTodo).subscribe(() => responseReceived = true);

    // Assert HTTP request has been called
    const request: TestRequest = http.expectOne(`${environment.baseUrl}/api/todos/${modifiedTodo.id}`);

    // Resolve the request by returning success (without body)
    request.flush(null);

    expect(responseReceived)
      .withContext('The subscription to the `update` Observable should send an HTTP request')
      .toBeTruthy();
  });

  it('should return an Observable when want to get a Todo', () => {
    const fakeTodo: Todo = {
      id: 0,
      title: 'My first task',
      state: 'DONE',
      description: 'This is my first Task to do !!!',
      creationDate: new Date()
    };
    let receivedTodo: Todo;

    // Call the service
    todoService.getTodo(2).subscribe((todo: Todo) => receivedTodo = todo);

    // Assert HTTP request has been called
    const request: TestRequest = http.expectOne(`${environment.baseUrl}/api/todos/2`);

    // Resolve the request by returning the 'fakeTodo'
    request.flush(fakeTodo);

    expect(receivedTodo)
      .withContext('The subscription to the `getTodo` Observable should send an HTTP request, returning a Todo')
      .toEqual(fakeTodo);
  });

});
