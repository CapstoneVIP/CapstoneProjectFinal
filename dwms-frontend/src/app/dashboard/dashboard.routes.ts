import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home/home.component";
import { AdminComponent } from "./admin/admin.component";
import { AuthGuard, RoleGuard } from "../_guards";
import { ChatComponent } from "./chat/chat.component";
import { LeafletComponent } from "./leaflet/leaflet.component"

export const dashboardRoutes: Routes = [
   {
    path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard], canActivateChild:[AuthGuard], children: [
       { path: '', redirectTo: 'home', pathMatch: 'full' },
       { path: 'home', component: HomeComponent },
       { path: 'leaflet', component: LeafletComponent },
       { path: 'chat', component: ChatComponent },
       { path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data:{ role: "ADMIN" }},
   ]},
];