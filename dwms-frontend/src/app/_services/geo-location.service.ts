/* 
Unused for now!!!
Not necessary as it wasnt terribly accurate at times. 
More research into this could prove beneficial, but setting it
to the center of campus is just a smarter idea
*/

/*
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Location } from "../_models/location.model";
import * as L from "leaflet";
import "rxjs/add/operator/map";

@Injectable()
export class GeoLocationService {

  constructor(private http: HttpClient) { }

  getClientLocation() {
    
    return this.http
      .get("http://ipv4.myexternalip.com/json")
      .flatMap((result: any) =>
        this.http.get(`https://ipapi.co/${result.ip}/json`)
      )
      .map((result: any) => {
        const location = new Location();

        location.address =
          result.city + ", " + result.region + ", " + result.country;
        location.latlng = L.latLng(result.latitude, result.longitude);

        return location;
      }); 
  }
}



//////This should go into the leaflet component//////
this.geoloc
      .getClientLocation()
      .catch(err => {
        console.error(err);

        // default map location
        const location = new Location();
        location.address = "Omaha, Nebraska, United Sates";
        location.latlng = L.latLng(41.249168, -96.014571); //Elmwood Park

        return Observable.of(location);
      })
      .subscribe((location: Location) => {
        const map = L.map("map", {
          zoomControl: false,
          center: location.latlng,
          zoom: 15,
          minZoom: 12,
          maxZoom: 18,
          layers: [this.baseMaps.OpenStreetMap]
        });

        L.control.zoom({ position: "topright" }).addTo(map);
        L.control.layers(this.baseMaps).addTo(map);
        L.control.scale().addTo(map);

        this.address = location.address;
        this._mapservice.map = map;
      });

*/
