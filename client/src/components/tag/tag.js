import React from "react";

const tag = (props) => {
  return (
    <div class="tag">
      <a href = '/#' onClick = {(e) => props.handleTagFilterChange(props.name)}>
        <p style = {{cursor: "pointer", textDecoration: "underline"}}>{props.name}</p>
      </a>
      <p>{props.questions.length} question</p>
    </div>
  );
};

export default tag;
