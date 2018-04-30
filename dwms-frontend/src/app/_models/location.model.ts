import { LatLngBounds, LatLng } from "leaflet";

/**
 * This model is used for the leaflet coordinate system
*/
export class Location {
  latlng: LatLng;
  address: string;
  viewBounds: LatLngBounds;
}