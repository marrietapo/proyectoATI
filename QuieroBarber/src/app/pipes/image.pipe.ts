import { Pipe, PipeTransform } from '@angular/core';
import { imagesBarberUrl } from '../../environments/environment.prod';


const URL = imagesBarberUrl.avatarBarber;


@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform( img: string, size: string = 'w500'): string {
    if ( !img ) {
      return './assets/no-image-banner.jpg';
    }

    const imgUrl = `${ URL }/${ size }${ img }`;

    return imgUrl;
  }

}
