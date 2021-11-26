import { message } from "antd";
import { apiVersion, basePath } from "./config";

export function sendNotificationForAll(token, data) {
  const url = `${basePath}/${apiVersion}/send-notifications-all-users`;
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  };
  return fetch(url, params)
    .then((response) => {
      if (response.status===200){
        return{
          status:200,
          message:"Notificación enviada correctamente"
        }
      }else{
        return{
          status:response.status,
          message:"Error al enviar notificación"
        }
      } 
      

      //return response.json()   
      
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error.message;
    });
}
