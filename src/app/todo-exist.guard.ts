import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { TodoService } from './todo.service';

@Injectable({
  providedIn: 'root'
})
export class TodoExistGuard implements CanActivate {

  constructor(private todoService: TodoService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    /** ToBeDiscussed with WebFactory:
     * Here we directly asks the Backend, trying to get the Todo with the specified id.
     * If there is a Todo for this id, the route can be activated, if not go back to home.
     * Disadvantage is the send of an HTTP request for that...
     * May be an other solution should be to use the Store, checking the presence of the Todo in the Todo list ?
     * If present the route can be activated, if not ask first an action to get the Todo and if it is still not present in the Store,
     * go back to home...
     * But this seems heavy, and the role of this guard goes to be a Resolver...
     */
    return this.todoService.getTodo(+next.paramMap.get('todoId')).pipe(
      switchMap(todo => of(true)),
      catchError((error: Error) => {
        console.warn(`GUARD > Access to route ${state.url} cannot be activated (${error.message}) => Redirect to home`);
        return of(this.router.parseUrl('/'));
      })
    );
  }

}
