import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {
  private currentUserSource = new ReplaySubject<User| null>(1);
  currentUser$: Observable<User | null> = this.currentUserSource.asObservable();

  constructor(http: HttpClient) {
    super(http);
  }

  login(model: any): Observable<any> {
    return this.http.post(this.baseUrl + 'account/login', model)
      .pipe(
        map((response: User) => {
          const user = response;
          if(user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  register(model: any): Observable<any> {
    return this.http.post(this.baseUrl + 'account/register', model)
      .pipe(
        map((user: User) => {
          if(user) {
            this.setCurrentUser(user);
            this.currentUserSource.next(user);
          }
        })
      );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
