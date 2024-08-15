import React, { useState, useEffect } from "react";
import { registerUserAccount, checkEmail } from "../../api";

const Register = (props) => {
  // State variables to hold registration data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return; // Stop the submission if passwords do not match
    }

    // Check if the password contains the username
    if (password.toLowerCase().includes(username.toLowerCase())) {
      setErrorMessage("The password should not contain the username as it is easy to guess!");
      return; // Stop the submission if the password contains the username
    }
    // Here you can perform any actions with the registration data, like sending it to a server
    checkEmail(email).then((val)=>{
      console.log(val.data)
      if(val.data != true){
        setEmailError("Email already exists")
        throw Error("Email exists")
      }
    }).then(()=>{
      registerUserAccount(username, email, password)
      .then(() => {
        window.location.reload()// Change page on successful registration
        // Clear form fields and any error messages
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
      })
      .catch(error => {
        setErrorMessage("Failed to register. Please try again.");
        console.error('Registration Error:', error);
      });
    }).catch((e)=>{
      console.log(e)
    })
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
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
      {emailError?<p style = {{"color": "red"}}>Email already in use</p>:null}
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
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
