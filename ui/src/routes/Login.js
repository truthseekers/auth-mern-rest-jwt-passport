import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LOGIN_MUTATION } from "../graphql/mutations";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setLoading, setIsAuthenticated, setUser } = useAuth();

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    console.log("email: ", email);
    console.log("password: ", password);

    fetch(`http://localhost:3001/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.error) {
          console.log("there was an error");
        } else {
          console.log("res.accessToken: ", res.accessToken);
          console.log("res.refreshToken: ", res.refreshToken);
          console.log("res.user: ", res.user);

          localStorage.setItem("accessToken", res.accessToken);
          localStorage.setItem("refreshToken", res.refreshToken);
          localStorage.setItem("isRefresh", false);
          setLoading(false);
          setIsAuthenticated(true);
          setUser(res.user);
          console.log("routed to dashboard");
          navigate("/dashboard");
        }
      });
  };

  return (
    <>
      <div className="flex wrap justify-center">
        <div style={{ width: "70%" }} className="flex wrap justify-center">
          <h3>Login</h3>
          <div className="break"></div>
          {state?.message && <h3 style={{ color: "red" }}>{state.message}</h3>}
          <div className="break"></div>
          {error && <h3 style={{ color: "red" }}>{error}</h3>}
          <div className="break"></div>
          <form onSubmit={formSubmitHandler}>
            <div>
              <label>Email</label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="email"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="password"
              />
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
