import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpModule,  XHRBackend } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router'
import { APP_ROUTES } from './app.routes';

//Modules
import { DashboardModule } from "./dashboard/dashboard.module";

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

//Guards
import { AuthGuard, RoleGuard } from "./_guards";

//Services
import { ApiHandler, UserService, AuthService } from './_services';


//ApiHandler
export function handlerFunc(backend: XHRBackend, defaultOptions: RequestOptions){
  return new ApiHandler(backend, defaultOptions);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(APP_ROUTES),
    DashboardModule,
  ],
  exports: [
  ],
  providers: [
    AuthGuard,
    RoleGuard,
    AuthService,
    UserService,
    {
      provide: ApiHandler,
      useFactory: handlerFunc,
      deps: [XHRBackend, RequestOptions]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
