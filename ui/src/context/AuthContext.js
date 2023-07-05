import React, { useState, useEffect } from "react";

const AuthContext = React.createContext();

function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

const AuthProvider = ({ navigation, ...props }) => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Why doesn't this cause an infinite loop? When the setUser changes the state in the context it should cause this whole thing to start over again.
  // in the REST version I have to use a useEffect when running fetch()
  useEffect(() => {
    fetch(`http://localhost:3001/currentuser`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then(async (response) => {
        // console.log("HELLOOOOO response: ", response);

        if (response.ok) {
          const data = await response.json();
          console.log("data from fetch currentUser context: ", data);

          fetch(`http://localhost:3001/user/${data._id}`)
            .then((response) => response.json())
            .then((actualData) => {
              console.log("2nd fetch!!! actualData json array: ", actualData);
              setUser(actualData);
              setIsAuthenticated(true);
              setLoading(false);
            });
        } else {
          // problem with the jwt, so it's likely expired or malformed. Set to refresh and try to refresh.
          console.log("going through refresh...");
          localStorage.setItem("isRefresh", true);

          fetch(`http://localhost:3001/token`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          }).then(async (response) => {
            console.log("post token response: ", response);

            if (response.ok) {
              const data = await response.json();
              console.log("data from post token response: ", data);
              if (data.accessToken) {
                console.log("setting authenticated to TRUE");
                localStorage.setItem("accessToken", data?.accessToken);
                localStorage.setItem("isRefresh", false); // maybe?
                setIsAuthenticated(true);
                setUser(data.user);
              } else {
                console.log("setting authenticated to false");
                setIsAuthenticated(false);
              }
              setLoading(false);
            }
          });
        }
      })
      .catch((err) => {
        // don't think the catch is necessary.
        console.log("error fetching currentUser: ", err);
      });
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setUser({});
    setLoading(false);
    localStorage.setItem("accessToken", "");
    localStorage.setItem("refreshToken", "");
  };

  const value = {
    user,
    setUser,
    logout,
    loading,
    setLoading,
    isAuthenticated,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value} {...props} />;
};

export { AuthProvider, useAuth };
