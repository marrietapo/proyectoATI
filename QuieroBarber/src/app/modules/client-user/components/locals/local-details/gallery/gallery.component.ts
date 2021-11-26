import { Component, Input, OnInit } from '@angular/core';
import { imagesUrl } from 'src/environments/environment.prod';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {

  config: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 10,
    pagination: { clickable: true },
  };

  @Input() images: string[];

  constructor() { }

  ngOnInit() {}

  getImageURL(image) {
    return imagesUrl.getImage + image;
  }
}
