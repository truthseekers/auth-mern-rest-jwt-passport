import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
  };

  return (
    <>
      <div className="flex wrap justify-center">
        <div style={{ width: "70%" }} className="flex wrap justify-center">
          <h3>Sign up</h3>
          <div className="break"></div>
          {error && (
            <>
              <h3 style={{ color: "red" }}>{error}</h3>
              <div className="break"></div>
            </>
          )}
          <form onSubmit={formSubmitHandler}>
            <div>
              <label>Email</label>
              <input
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            <div>
              <button disabled={submitting} type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
