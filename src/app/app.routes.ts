import { Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoComponent } from './todo/todo.component';
import { TodoExistGuard } from './todo-exist.guard';

export const ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/todos' },
    { path: 'todos', component: TodoListComponent },
    { path: 'todos/:todoId', canActivate: [TodoExistGuard], component: TodoComponent }
];
