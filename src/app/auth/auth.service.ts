import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { User } from "./user.model";
import { Subject } from "rxjs";
import { expressionType } from "@angular/compiler/src/output/output_ast";

@Injectable({providedIn: 'root'})
export class AuthService {

  private token: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatusLisntner() {
    return this.authStatusListner.asObservable();
  }

  getAuthenticationStaus() {
    return this.isAuthenticated;
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
    this.http.post<{message: String, token: string, expiresIn: number}>("http://localhost:3000/api/user/login", loginInfo)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if(token) {
        const expiresIn = response.expiresIn;
        const now = new Date();
        const expiresInDuration = new Date(now.getTime() + (expiresIn * 1000));
        this.setAuthTimer(expiresIn);
        this.saveAuthData(token, expiresInDuration);
        this.authStatusListner.next(true);
        this.isAuthenticated = true;
        alert ('Login Successful!!!!');
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  autoLoadData() {
    const authInfo = this.getAuthData();
    if(authInfo) {
      const now = new Date();
      const expirySec = authInfo.expirationDate.getTime() - now.getTime();
      if(expirySec > 0) {
        this.token = authInfo.token;
        this.setAuthTimer(expirySec/1000);
        this.isAuthenticated = true;
        this.authStatusListner.next(true);
      }
    }
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
