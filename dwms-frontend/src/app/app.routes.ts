import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];