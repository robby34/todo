import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { todoReducer } from './ngrx/todo.reducer';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { InMemoryTodoService } from './in-memory-todo.service';
import { environment } from 'src/environments/environment';
import { TodoEffects } from './ngrx/todo.effects';


@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ todos: todoReducer }),
    EffectsModule.forRoot([TodoEffects]),
    HttpClientModule,
    environment.production ? [] : HttpClientInMemoryWebApiModule.forRoot(InMemoryTodoService, { delay: 150 }),
    BrowserAnimationsModule, MatToolbarModule, MatCardModule, MatListModule, MatCheckboxModule, MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
