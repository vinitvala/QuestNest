import React, { useState } from "react";
import { login } from "../../api";

const Login = ({ handleUserChange, handlePageChange, handleSetGuest }) => {
  // State variables to hold login data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  // Function to handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    login(email, password)
      .then((data) => {
        handleUserChange(data);
        handleSetGuest(false);
        handlePageChange("questions");
        setErrorMessage(""); // Clear error message on successful login
      })
      .catch((error) => {
        // Handle login error, such as displaying an error message to the user
        if (error.response && error.response.data && error.response.data.errorMessage) {
          setErrorMessage(error.response.data.errorMessage);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
        console.error("Login error:", error);
      });

    // Clear input fields after submission
    setEmail("");
    setPassword("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display the error message if any */}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
