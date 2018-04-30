import { Injectable } from '@angular/core';
import { UserService } from "./user.service";
import { JwtHelper } from "../_helpers/jwt-helper";
import { RequestMethod } from "@angular/http";
import { Coords } from '../_models/coords.model'
import { Observable } from "rxjs";
import { ApiHandler } from "./api-handler.service";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  private _jwt: JwtHelper = new JwtHelper();
  private redirectUrl: string;
  public message: string;

  constructor(private _apiHandler: ApiHandler, private _userService: UserService) {}

  /**
   * Desc: check for expiration and if token is still existing or not
   */
  isAuthenticated(): boolean {
    return localStorage.getItem('token') != null && !this._jwt.isTokenExpired();
  }

  /**
  * Desc: Set the redirect URL
  */
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  /**
   * Desc: Get the redirect URL
  */
  getRedirectUrl(): string {
    return this.redirectUrl;
  }

  /**
   * Desc: Used to logout the user
   */
   logout(): Observable<string> {
    return this._apiHandler.callService(`/user/logout/${this._userService.get().id}`, RequestMethod.Get)
      .map(res => <string>res.text())
      .do(() => {
        this.clear();
      });
  }

  /**
   * Desc: this is used to clear anything that needs to be removed
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Desc: this will register a user to the database (Default_User)
   */
   registration(firstname: string, lastname: string, email: string, password: string): Observable<string> {
     return this._apiHandler.callService("/user/registration", RequestMethod.Post, {firstname: firstname, lastname: lastname, email: email, password: password })
     .map(res => <string>res.text());
   }

  /**
   * Desc: this returns the token for the user
   */
  authenticate(email: string, password: string): Observable<string> {
    return this._apiHandler.callService("/user/login", RequestMethod.Post, {email: email, password: password})
      .map(res => <string>res.text())
      .do((token: string) => {
        localStorage.setItem('token', token);
        this._userService.set(this._jwt.decodeToken());
      });
  }

  /**
   * Desc: this is used to alert our caller if we should go get token for next request or
   * to be carried out request
   */
  shouldIGetToken(threshold_seconds: number = 120): boolean {
    let expDate = this._jwt.getTokenExpirationDate().valueOf() - (threshold_seconds * 1000);

    return new Date().valueOf() > expDate;
  }

  /**
   * Desc: this is used to retrieve a newer token since the current one is going to expire soon
   */
  retrieveToken(): Observable<string> {
    return this._apiHandler.callService("/user/token", RequestMethod.Get)
      .map(res => <string>res.text())
      .do((token: string) => {
        this.clear();
        localStorage.setItem('token', token);
        this._userService.set(this._jwt.decodeToken());
      });
  }
}