import React, { useState, useEffect } from "react";
import { getCommentsByBarbershopApi } from "../../../api/comment";
import { getAccessTokenApi } from "../../../api/auth";
import ListComments from "../../../components/BarberAdmin/Comments/ListComments";
import useBarbershop from "../../../hooks/useBarbershop";



import "./Comments.scss";

export default function Comments() {
  const barbershop = useBarbershop();
  const [comments, setComments] = useState([]);
  const [reloadComments, setReloadComments] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = getAccessTokenApi();
  

  useEffect(() => {
    if (barbershop) {
      console.log(barbershop);
      getCommentsByBarbershopApi(token, barbershop).then((response) => {
        setComments(response.comments);
        setIsLoading(false);
      });
    } 
    
    setReloadComments(false);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reloadComments]);

  return (
    <div className="barbers">
      <ListComments
        comments={comments}
        setReloadComments={setReloadComments}
        isLoading = {isLoading}
      />
    </div>
  );
}
