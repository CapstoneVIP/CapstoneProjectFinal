import { Component, OnInit } from '@angular/core';
import { UserService } from "./_services/user.service";
import { JwtHelper } from "./_helpers/jwt-helper";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _jwt: JwtHelper = new JwtHelper();

  constructor(private _userService: UserService) {
  }

  ngOnInit(): void {
    //Check if there is a token, decode it, and set to user
    this._userService.set(this._jwt.decodeToken());
  }
}
