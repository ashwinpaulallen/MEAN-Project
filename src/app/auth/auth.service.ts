import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { User } from "./user.model";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {

  private token: String;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatusLisntner() {
    return this.authStatusListner.asObservable();
  }

  createUser(user: User) {
    console.log(user);
    this.http.post("http://localhost:3000/api/user/signup", user)
    .subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const loginInfo = {email: email, password: password};
    this.http.post<{message: String, token: String}>("http://localhost:3000/api/user/login", loginInfo)
    .subscribe(response => {
      this.token = response.token;
      this.authStatusListner.next(true);
    });
  }

  getToken() {
    return this.token;
  }
}
