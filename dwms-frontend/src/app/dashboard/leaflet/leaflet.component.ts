import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";
import { Location } from "../../_models/location.model";
import { latLng, LatLng, tileLayer, marker, polyline, icon } from 'leaflet';
import { MapService} from "../../_services/map.service";
import * as L from "leaflet";
import "rxjs/add/operator/catch";


@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.css']
})

export class LeafletComponent implements OnInit, OnDestroy {
  
  public address: string;
  private subscription;
  private interval: number;
  public baseMaps: any;

  constructor(private _mapservice: MapService, private http: HttpClient) {
    this.address = "";
    this.interval = 3000;
  }

  /**
  * Desc: On component creating this handles the wordload of the leaflet component
  * It handles intialization as well as the interval call to allow the dynamic updates
  * of shuttle on the map. 
  */
  ngOnInit() {

    //Choice of tile providers to render
    this.baseMaps = {
      OpenStreetMap: L.tileLayer(
        "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ),
      Esri: L.tileLayer(
        "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      ),
      CartoDB: L.tileLayer(
        "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"   
      )
    }; 

     //Define basic start location information
     const location = new Location();
       location.address = "Omaha, Nebraska, United Sates";
       location.latlng = L.latLng(41.247433, -96.016178); //PKI roundabout

     //Define the bounds within UNO's campus
     const botLeft = L.latLng(41.225214, -96.038337); //SW Baxter Arena
     const topRight = L.latLng(41.267042, -95.994215); //NE Dodge Street
     const bounds = L.latLngBounds(botLeft, topRight);

     //Define basic map constraints
     const map = L.map("map", {
       zoomControl: false,
       center: location.latlng,
       zoom: 16,
       minZoom: 12,
       maxZoom: 18,
       maxBounds: bounds,
       layers: [this.baseMaps.OpenStreetMap]
     });
     
     //Leaflet control structures
     L.control.zoom({ position: "topright" }).addTo(map);
     L.control.layers(this.baseMaps).addTo(map);
     L.control.scale().addTo(map);
     this.address = location.address;
     this._mapservice.map = map;  
  
     //RxJS interval call every 3 seconds
     this.subscription = Observable.interval(this.interval).subscribe(x => {
       this._mapservice.markerDecision();
     });
  }


  /**
  * Desc: Stop the RxJS interval service, and set the marker flag to false
  */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this._mapservice.flag = true;
  }
}
