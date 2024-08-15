import React from "react";
import Login from "./login";
import Register from "./register";
import { useState } from "react";

const Welcome = (props) => {
  const [button, setButton] = useState("none");
  function handleLoginBtn(e) {
    setButton("login");
  }

  function handleRegisterBtn(e) {
    setButton("register");
  }

  function handleGuestBtn(e) {
    props.handleSetGuest(true)
    props.handlePageChange("questions")
  }
  switch (button) {
    case "none":
      return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Welcome to Fake Stack Overflow!</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button className="welcome-button" onClick={handleRegisterBtn}>
              Register
            </button>
            <button className="welcome-button" onClick={handleLoginBtn}>
              Login
            </button>
            <button className="welcome-button" onClick={handleGuestBtn}>
              Continue as Guest
            </button>
          </div>
        </div>
      );
    case "login":
      return <Login handleSetGuest = {props.handleSetGuest} handlePageChange = {props.handlePageChange} handleUserChange = {props.handleUserChange}></Login>;
    case "register":
      return <Register handlePageChange = {props.handlePageChange}></Register>;
    default:
      return null;
  }
};

export default Welcome;
