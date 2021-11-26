import React, {useState, useEffect, createContext} from "react";
import {getAccessTokenApi, getRefreshTokenApi, logout, refreshAccessToken} from "../api/auth";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export default function AuthProvider(props){
    const { children} = props;
    const [user, setUser] = useState({
        user:null,
        isLogged : false
    });
    
    useEffect(() => {
        checkUserLogin(setUser);
    }, [])
    
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}


function checkUserLogin(setUser){
    const accessToken = getAccessTokenApi();

    if(!accessToken){
        const refreshToken = getRefreshTokenApi();
        if(!refreshToken){
            logout();
            setUser({
                user:null, 
                isLogged: false,
            });
        }else{
            refreshAccessToken(refreshToken);
        }
    }else{
        setUser({
          user: jwtDecode(accessToken),
          isLogged: true,
        });
    }
}

