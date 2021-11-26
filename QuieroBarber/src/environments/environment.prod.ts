
export const environment = {
  production: true,
};

export const mapboxtoken = {
  token:
    'pk.eyJ1IjoibWFycmlldGEiLCJhIjoiY2t2aGc5dHJ0MXA2bzJ3bnVsdTIxY3J5cCJ9.dfe0V3LGbIcYEN7yJrlYUQ',
};

export const api = {
  //path: 'https://quiero-barber-api.herokuapp.com/api/',
  path: 'http://50.17.61.40:3977/api/',
  version: 'v1/',
};

export const imagesUrl = {
  barbershopLogo: api.path + api.version + 'get-logo/',
  barberAvatar: api.path + api.version + 'get-avatar-barber/',
  serviceImage: api.path + api.version + 'get-image-service/',
  userAvatar: api.path + api.version + 'get-avatar/',
  getImage: api.path + api.version + 'get-image/'
};

export const imagesBarberUrl = {
  avatarBarber: api.path + api.version + 'get-logo/',
};
