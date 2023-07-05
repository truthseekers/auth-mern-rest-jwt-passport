import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/users`)
      .then((response) => response.json())
      .then((actualData) => {
        console.log("actualData json array: ", actualData);
        setUsers(actualData);
      });
  }, []);

  return (
    <>
      <h2>Users: </h2>
      <ul>
        {users.map((user) => {
          return (
            <li key={user._id}>
              <Link key={user._id} to={`/user/${user._id}`}>
                {user.email}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default Users;
