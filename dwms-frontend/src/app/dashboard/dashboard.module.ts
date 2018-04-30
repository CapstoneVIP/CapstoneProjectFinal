//Routing
import { dashboardRoutes } from "./dashboard.routes";

//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

//Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';

import { LeafletComponent } from './leaflet/leaflet.component';
//import { GeoLocationService } from '../_services/geo-location.service';
import { MapService } from '../_services/map.service';
import { ChatComponent } from './chat/chat.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forChild(dashboardRoutes)
  ],
  declarations: [
  	DashboardComponent, 
  	HomeComponent, 
  	AdminComponent,  
  	LeafletComponent,
    ChatComponent
  ],
  providers: [
    MapService, 
    //GeoLocationService
  ]
})
export class DashboardModule { }
