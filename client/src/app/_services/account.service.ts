import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../_models/user";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  readonly baseUrl = "https://localhost:5001/api/";
  private currentUserSource = new ReplaySubject<User| null>(1);
  currentUser$: Observable<User | null> = this.currentUserSource.asObservable();

  constructor(private readonly http: HttpClient) { }

  login(model: any): Observable<any> {
    return this.http.post(this.baseUrl + "account/login", model)
      .pipe(
        map((response: User) => {
          const user = response;
          if(user) {
            localStorage.setItem("user", JSON.stringify(user));
            this.currentUserSource.next(user);
          }
        })
      );
  }

  register(model: any): Observable<any> {
    return this.http.post(this.baseUrl + "account/register", model)
      .pipe(
        map((user: User) => {
          if(user) {
            localStorage.setItem("user", JSON.stringify(user));
            this.currentUserSource.next(user);
          }
        })
      );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
  }
}
