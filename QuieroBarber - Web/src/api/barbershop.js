import { apiVersion, basePath } from "./config";

export function getBarbershopsApi(token) {
  const url = `${basePath}/${apiVersion}/get-barbershops`;
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

export function getBarbershopApi(token, barbershopId) {
  const url = `${basePath}/${apiVersion}/get-barbershop/${barbershopId}`;
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

export function getBarbershopByOwnerApi(token, owner) {
  const url = `${basePath}/${apiVersion}/get-barbershop-by-owner/${owner}`;
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



export function uploadLogoApi(token, logo, barbershopId) {
  const url = `${basePath}/${apiVersion}/upload-logo/${barbershopId}`;
  const formData = new FormData();
  formData.append("logo", logo, logo.name);

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

export function getLogoApi(logoName) {
  const url = `${basePath}/${apiVersion}/get-logo/${logoName}`;

  return fetch(url)
    .then((response) => {
      return response.url;
    })
    .catch((error) => {
      return error.message;
    });
}


export function uploadImageApi(token, image, barbershopId) {
  

  const url = `${basePath}/${apiVersion}/upload-image/${barbershopId}`;
  const formData = new FormData();
 
  formData.append("image", image, image.name);

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

export function getImageApi(imageName) {
  const url = `${basePath}/${apiVersion}/get-image/${imageName}`;

  return fetch(url)
    .then((response) => {
      return response.url;
    })
    .catch((error) => {
      return error.message;
    });
}


export function updateBarbershopApi(token, data, itemId) {
  const url = `${basePath}/${apiVersion}/update-barbershop/${itemId}`;

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

export function activateBarbershopApi(token, itemId, status) {
  const url = `${basePath}/${apiVersion}/activate-barbershop/${itemId}`;

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

export function addBarbershopApi(token, data) {
  const url = `${basePath}/${apiVersion}/add-barbershop`;

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
      return result;
    })
    .catch((error) => {
      return error;
    });
}

export function addBarbershopWithAdminApi(token, data) {
  const url = `${basePath}/${apiVersion}/add-barbershop-with-admin`;

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
      return result;
    })
    .catch((error) => {
      return error;
    });
}


export function getBarbershopsActiveApi(token, status) {
  const url = `${basePath}/${apiVersion}/get-barbershops-active?active=${status}`;
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


export function deleteBarbershopApi(token, itemId) {
  const url = `${basePath}/${apiVersion}/delete-barbershop/${itemId}`;

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
