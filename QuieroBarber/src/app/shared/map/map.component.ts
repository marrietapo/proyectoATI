import { Component, Input, OnInit} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Barbershops } from 'src/app/dtos/barbershops';
import { mapboxtoken, imagesUrl } from 'src/environments/environment.prod';
import { PopoverController } from '@ionic/angular';
import { MarkerPopupComponent } from './marker-popup/marker-popup.component';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';


declare var mapboxgl: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() barbershops: Barbershops.Barbershop[];


  position = false;
  location = {};
  loading = true;
  locations = {};
  map: any;
  locals: Barbershops.Barbershop[] = [];

  constructor(
    private geolocation: Geolocation,
    public popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.getLocation();
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

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle:true
      })
    );

    // var coordinates = [
    //   {
    //     latitude: -56.1216675,
    //     longitude: -34.8995975,
    //   },
    //   {
    //     latitude: -56.1236675,
    //     longitude: -34.8995975,
    //   },
    // ];

    // var directions = new MapboxDirections({
    //   accessToken: mapboxtoken.token,
    //   unit: 'metric',
    //   profile: 'mapbox/cycling',
    //   language: 'es',
    //   controls: {
    //       inputs: false,
    //       instructions: false
    //     },
    // });
    //  directions.setOrigin(this.location);
    //  directions.setDestination([
    //    this.barbershops[0].geo.lng,
    //    this.barbershops[0].geo.lat
    //  ]);

    // this.map.addControl(
    //   directions,
    //   'top-left'
    // );



    this.barbershops.forEach((element) => {
      var marker = new mapboxgl.Marker({ color: '#003049' });
      marker.setLngLat([element.geo.lng, element.geo.lat]);
      marker.addTo(this.map);
      marker.getElement().addEventListener('click', (ev) => {
        this.presentPopover(ev, element);
      });
    });

    // const userMarker = new mapboxgl.Marker({ color: '#F77F00' })
    //   .setLngLat([location[0], location[1]])
    //   .addTo(this.map);
     this.goFlyTo();
  }

  goFlyTo() {
    this.map.flyTo({
      center: [this.location[0], this.location[1]],
      zoom: 13,
      essential: true,
    });
  }

  processEvent(mensaje) {
    console.log(mensaje);

  }

  async presentPopover(ev: any, element: Barbershops.Barbershop) {
    const popover = await this.popoverController.create({
      component: MarkerPopupComponent,
      componentProps: { element },
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    await popover.present();


    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
