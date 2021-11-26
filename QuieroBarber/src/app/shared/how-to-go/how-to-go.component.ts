import { Component, Input, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Barbershops } from 'src/app/dtos/barbershops';
import { mapboxtoken, imagesUrl } from 'src/environments/environment.prod';
import { ModalController, PopoverController } from '@ionic/angular';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';


declare var mapboxgl: any;

@Component({
  selector: 'app-how-to-go',
  templateUrl: './how-to-go.component.html',
  styleUrls: ['./how-to-go.component.scss'],
})
export class HowToGoComponent implements OnInit {
  @Input() barbershop: Barbershops.Barbershop;

  position = false;
  location = {};
  loading = true;
  locations = {};
  map: any;
  locals: Barbershops.Barbershop[] = [];
  directions: any;


  constructor(
    private geolocation: Geolocation,
  ) {}

  ngOnInit() {

    this.getLocation();
  }

  ionViewDidEnter() {
    this.showRouteOnMap();
  }

  getLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.loading = false;
        this.location = [
          Number(resp.coords.longitude),
          Number(resp.coords.latitude),
        ];
        console.log(this.location);
        this.showMap(this.location);
      })
      .catch((error) => {
        console.log('Error getting location', error);
        this.loading = false;
      });
  }

  getBarbershopLogoURL(image) {
    return imagesUrl.barbershopLogo + image;
  }

  showMap(location) {
    mapboxgl.accessToken = mapboxtoken.token;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-56.1216675, -34.8995975],
      cooperativeGestures: true,
      pitch: 20,
    });

    var geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: true,
    });

    this.map.addControl(geolocate);


    this.directions = new MapboxDirections({
      accessToken: mapboxtoken.token,
      unit: 'metric',
      profile: 'mapbox/cycling',
      language: 'es',
      controls: {
        inputs: false,
        instructions: true,
      },
    });

    const userMarker = new mapboxgl.Marker({ color: '#F77F00' })
      .setLngLat([this.barbershop.geo.lng, this.barbershop.geo.lat])
      .addTo(this.map);
  }

  showRouteOnMap() {
    this.directions.setOrigin(this.location);
    this.directions.setDestination([
      this.barbershop.geo.lng,
      this.barbershop.geo.lat,
    ]);
    this.map.addControl(this.directions, 'top-left');
  }

}
