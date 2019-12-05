import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { API_URL } from '../../../services/authentication.service';


import {} from 'googlemaps';


@Component({
  selector: 'app-map-viewer',
  template: '<div #map style="width:100%;height:100%"></div>',
})
export class MapViewerComponent implements OnInit, AfterViewInit{
  title = 'maps';
  src = API_URL + '/kmlview/';

  @ViewChild('map') mapElement: any;

  map: google.maps.Map;
  kmlLayer: google.maps.KmlLayer;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) {
    this.src = this.src + data.uploadId
    console.log(this.src)
  }

  ngOnInit(): void {
    const mapProperties = {
         center: new google.maps.LatLng(33.7829, -118.1088),
         zoom: 5,
         mapTypeId: google.maps.MapTypeId.ROADMAP
    };

   this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
 }

 ngAfterViewInit() {
   
  const layerProperties = {
    url: this.src,
    map: this.map
  }
  
  this.kmlLayer = new google.maps.KmlLayer(layerProperties )
 }

}
