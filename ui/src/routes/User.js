import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function User() {
  let params = useParams();
  const [user, setUser] = useState([]);
  console.log("params: ", params.userId);

  useEffect(() => {
    fetch(`http://localhost:3001/user/${params.userId}`)
      .then((response) => response.json())
      .then((actualData) => {
        console.log("actualData json array: ", actualData);
        setUser(actualData);
      });
  }, []);

  return (
    <>
      <h1>User page for user with id: {params.userId}</h1>
      <li>email: {user.email}</li>
    </>
  );
}

export default User;
