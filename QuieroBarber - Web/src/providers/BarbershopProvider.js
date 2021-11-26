import React, {useState, useEffect, createContext} from "react";
import { getAccessTokenApi } from "../api/auth";
import { getBarbershopByOwnerApi } from "../api/barbershop";
import useAuth from "../hooks/useAuth";

export const BarbershopContext = createContext();

export default function BarbershopProvider(props){
    const { children} = props;
    const [barbershop, setBarbershop] = useState(null);
    const { user } = useAuth();
    const accessToken = getAccessTokenApi();

        useEffect(() => {
            if(user){
                checkBarbershop(accessToken, setBarbershop,user._id ); 
            }
        }, [user, accessToken]);

    return <BarbershopContext.Provider value={barbershop}>{children}</BarbershopContext.Provider>
    
}


function checkBarbershop(accessToken, setBarbershop, owner) {
    
  if (accessToken&&owner) {
      getBarbershopByOwnerApi(accessToken, owner).then((result) => {
        if (result) {
          if (result.barbershop) {
            setBarbershop(result.barbershop._id);
          }
        }
      });
  }
}

