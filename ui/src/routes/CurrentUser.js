import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CurrentUser() {
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      fetch(`http://localhost:3001/currentuser`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }).then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          console.log("data yess from fetch currentUser: ", data);
        }
      });

      // try {
      //   const asyncResponse = await axios.get(
      //     `http://localhost:3001/currentuser`,
      //     {
      //       withCredentials: true,
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //       },
      //     }
      //   );
      //   console.log("asyncResponse: ", asyncResponse);
      //   console.log("asyncResponse.data: ", asyncResponse.data);
      // } catch (error) {
      //   console.log("error fetching current user: ", error);
      // }
    };

    fetchCurrentUser();
  }, []);

  console.log("currentUser: ", currentUser);

  return (
    <>
      <h2>CurrentUser yes: </h2>
      <ul>
        {/* {users.map((user) => {
          return (
            <li key={user._id}>
              <Link key={user._id} to={`/user/${user._id}`}>
                {user.email}
              </Link>
            </li>
          );
        })} */}
      </ul>
    </>
  );
}

export default CurrentUser;
