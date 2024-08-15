import React from "react";
import '../../stylesheets/App.css'
import { logout } from "../../api";

const banner = (props) => {
  async function handleLogOut(e){
    console.log("logging out ...")
    await logout()
    props.handlePageChange("welcome")
  }

  function handleSearchSubmit(e){
    if(e.which === 13){
      props.handleSearchTermChange(document.getElementById("search-bar").value)
    }
  }

  return (
    <div class="banner">
      <div class="title-and-search"></div>
      <h1>Fake Stack Overflow</h1>
      {props.page != "welcome"? <input
        type="text"
        id="search-bar"
        class="search-bar"
        placeholder="Search ..."
        onKeyDown = {(e)=>handleSearchSubmit(e)}
      />:null}
      {props.page != "welcome"?
      <button onClick = {handleLogOut}>Logout</button>:null}
    </div>
  );
};

export default banner;
