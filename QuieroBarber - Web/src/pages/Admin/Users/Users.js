import React, { useState, useEffect } from "react";
import { getUsersActiveApi } from "../../../api/user";
import { getAccessTokenApi } from "../../../api/auth";
import ListUsers from "../../../components/Admin/Users/ListUsers/ListUsers";

import "./Users.scss";

export default function Users() {
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [reloadUsers, setReloadUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = getAccessTokenApi();

  useEffect(() => {
    getUsersActiveApi(token, true).then((response) => {
      setActiveUsers(response.users);
    });
    getUsersActiveApi(token, false).then((response) => {
      setInactiveUsers(response.users);
      setIsLoading(false);
    });
    setReloadUsers(false);
  }, [token, reloadUsers]);

  return (
    <div className="users">
      <ListUsers
        activeUsers={activeUsers}
        inactiveUsers={inactiveUsers}
        setReloadUsers={setReloadUsers}
        isLoading={isLoading}
      />
    </div>
  );
}
