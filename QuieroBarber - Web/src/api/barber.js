import { apiVersion, basePath } from "./config";

export function getBarbersApi(token) {
  const url = `${basePath}/${apiVersion}/get-barbers`;
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error.message;
    });
}

export function getBarbersByBarbershopApi(token, barbershopId) {
  const url = `${basePath}/${apiVersion}/get-barbers-by-barbershop/${barbershopId}`;
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error.message;
    });
}


export function uploadAvatarApi(token, avatar, barberId) {
  const url = `${basePath}/${apiVersion}/upload-avatar-barber/${barberId}`;
  const formData = new FormData();
  formData.append("avatar", avatar, avatar.name);

  const params = {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: token,
    },
  };
  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error.message;
    });
}

export function getAvatarApi(avatarName) {
  const url = `${basePath}/${apiVersion}/get-avatar-barber/${avatarName}`;

  return fetch(url)
    .then((response) => {
      return response.url;
    })
    .catch((error) => {
      return error.message;
    });
}


export function updateBarberApi(token, data, itemId) {
  const url = `${basePath}/${apiVersion}/update-barber/${itemId}`;

  const params = {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result.message;
    })
    .catch((error) => {
      return error;
    });
}

export function activateBarberApi(token, itemId, status) {
  const url = `${basePath}/${apiVersion}/activate-barber/${itemId}`;

  const params = {
    method: "PUT",
    body: JSON.stringify({ active: status }),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result.message;
    })
    .catch((error) => {
      return error;
    });
}

export function addBarberApi(token, data, barbershop) {
  console.log(barbershop);
  const url = `${basePath}/${apiVersion}/add-barber/${barbershop}`;

  const params = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result.message;
    })
    .catch((error) => {
      return error;
    });
}


export function getBarbersActiveApi(token, status, barbershop) {
  const url = `${basePath}/${apiVersion}/get-barbers-active?barbershop=${barbershop}&active=${status}`;  
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log(result)
      return result;
    })
    .catch((error) => {
      return error.message;
    });
}


export function deleteBarberApi(token, itemId) {
  const url = `${basePath}/${apiVersion}/delete-barber/${itemId}`;

  const params = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result.message;
    })
    .catch((error) => {
      return error.message;
    });
}
