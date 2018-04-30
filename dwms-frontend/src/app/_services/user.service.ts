import { Injectable } from '@angular/core';
import { User } from "../_models/user.model";

@Injectable()
export class UserService {
  private user: User;

  constructor() {
  }

  /**
   * this is used to set our user object for current logged in user
   */
  set(user: User): void {
    this.user = user;
  }

  /**
   * this is used to get our user
   */
  get(): User {
    return this.user;
  }

  /**
   * this is used to delete our user stored, by setting it to null
   */
  delete(): void {
    this.user = null;
  }

}