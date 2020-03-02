import { InMemoryDbService } from 'angular-in-memory-web-api';
import { substractDays } from './model/todo.state';

export class InMemoryTodoService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const todos = [
      {
        id: 1,
        title: 'My first task',
        state: 'DONE',
        description: 'This is my first Task to do !!!',
        creationDate: substractDays(new Date(), 5)
      },
      {
        id: 2,
        title: 'A new task',
        state: 'UNDONE',
        description: 'This is the description of the new task',
        creationDate: substractDays(new Date(), 2)
      },
      {
        id: 3, title: 'Again a new task', state: 'UNDONE', description: 'This is again a description',
        creationDate: substractDays(new Date(), 1)
      },
      { id: 4, title: 'Still a new task', state: 'UNDONE', description: 'This is still a description', creationDate: new Date() }
    ];
    return { todos };
  }

}
