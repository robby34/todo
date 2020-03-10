import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../model/todo.state';
import { createTodoAction } from '../ngrx/todo.actions';
import { Todo } from '../model/todo.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'todo-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addTodoForm: FormGroup;
  titleCtrl: FormControl;

  constructor(private store: Store<{ todos: AppState }>, private fb: FormBuilder) { }

  ngOnInit() {
    this.titleCtrl = this.fb.control('');
    this.addTodoForm = this.fb.group({
      title: this.titleCtrl
    });
  }

  addNewTodo() {
    const newTodo = { title: this.titleCtrl.value, state: 'UNDONE', creationDate: new Date() };
    this.store.dispatch(createTodoAction({ todo: newTodo as Todo }));
    this.titleCtrl.reset();
  }

}
