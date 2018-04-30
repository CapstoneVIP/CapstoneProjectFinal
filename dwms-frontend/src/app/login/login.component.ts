import {Component, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public message: string;
  public loginForm;
  public loading: boolean = false;

  constructor(private _authService: AuthService, private fb: FormBuilder, private _router: Router) {
    this.createForm();
  }

  /**
   * this is used to set our message incase there's one to our user before clearing our
   * local storage using our auth service
   */
  ngOnInit() {
    this.message = this._authService.message;
    this._authService.clear();
  }

  /**
   * we create our simple reactive form here
   */
  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * this is called when the user click on the submit button
   * and it also checks for the validity of the form , if invalid return don't do anything
   * and after authentication is successful we move to the redirectUrl if it was existing else
   * to dashboard
   */
  public submitted() {
    if (this.loginForm.invalid)
      return;

    //set our login loading indicator to show we have started the server communication
    this.loading = true;
    this._authService.authenticate(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(()=> {
        this.loading = false; //hide our loading indicator
        //navigate back to our redirect url if empty goto our dashboard
        let to: string = this._authService.getRedirectUrl() || '/dashboard';
        this._router.navigate([to]);
      }, (error)=> {
        this.loading = false;
        this.message = error;
        //alert(error);
        console.error("auth error", error);
      });
  }
}