import { Component, OnInit, Inject } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { latLng, tileLayer, Map, point, circle, polygon, icon, marker, featureGroup } from 'leaflet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

declare let L;

@Component({
  selector: 'app-site-location',
  templateUrl: './site-location.component.html',
  styleUrls: ['./site-location.component.scss']
})
export class SiteLocationComponent implements OnInit {
  markers: any[];
  map: L.Map;
  
  constructor(public dialogRef: MatDialogRef<SiteLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    layersControl = {
      baseLayers: {
        'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'osmAttribution' }),
        'Google map sat': tileLayer('http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 18, attribution: 'google' }),
  
      }
    }

    options = {
      layers: [
        this.layersControl.baseLayers["Open Street Map"]
      ],
      zoom: 5,
      center: latLng(46.879966, -121.726909)
    };

  ngOnInit() {
  }

  onMapReady(map) {
    // get a local reference to the map as we need it later
    this.map = map;
    this.addSiteLocation();
  }
  

// On cancel Click
cancel() {
  this.dialogRef.close();
}

addSiteLocation() {
  this.markers = [];
  var location = marker([this.data.site.latitude, this.data.site.longitude], {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
      iconUrl: 'leaflet/marker-icon.png',     
      shadowUrl: 'leaflet/marker-shadow.png'
    })
  }).bindPopup("<b> Site Name:</b>" + " " + this.data.site.name1 + " </br>" + "<b>Site Address:</b>" + " " + this.data.site.address 
  ).openPopup()
  this.markers.push(location)
  const group = new L.FeatureGroup(this.markers)
  group.addTo(this.map);
  this.map.fitBounds(group.getBounds())
}
}
