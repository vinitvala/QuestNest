import React, { useState } from "react";
import "../../stylesheets/App.css";
import axios from 'axios'; // Import Axios

const PostAnswerForm = ({ qid, handlePageChange, user }) => {
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [textError, setTextError] = useState("");
  const [hyperlinkError, setHyperlinkError] = useState("");

  const validateHyperlink = (text) => {
    const emptyHyperlinkMatch = text.match(/\[[^\]]*\]\(\)/g); // match [...]()
    const noProtocolMatch = text.match(
      /\[[^\]]*\]\((?!(https:\/\/|http:\/\/)).*?\)/g
    ); // match [...](string that does not start with protocol)

    if (emptyHyperlinkMatch) {
      setHyperlinkError("Hyperlink Invalid: () must not be empty");
      return false;
    } else if (noProtocolMatch) {
      setHyperlinkError(
        "Hyperlink Invalid: link in () must start with https:// or http://"
      );
      return false;
    }
    return true;
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    setTextError("");
    setHyperlinkError("");
  };

  // const handleUsernameChange = (e) => {
  //   setUsername(e.target.value);
  //   setUsernameError("");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
      isValid = false;
    }

    if (!text.trim()) {
      setTextError("Answer text cannot be empty.");
      isValid = false;
    }

    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = Array.from(text.matchAll(regex), (match) => match[0]);
    console.log(matches);

    isValid = true;
    setHyperlinkError("");
    for (const link of matches) {
      console.log(link);
      if (!validateHyperlink(link)) {
        isValid = false;
      }
    }

    if (isValid) {
      const newAnswer = {
        questionId: qid,
        text: text,
        ans_by: user._id
      };

      try {
        // Replace the model.putAns call with an Axios POST request
        const response = await axios.post('http://localhost:8000/answers', newAnswer);

        if (response.status === 201) {
          // Redirect to the answers page or refresh the content
          handlePageChange("questions");
        } else {
          setTextError("An error occurred while submitting the answer.");
        }
      } catch (error) {
        console.error('Error posting answer: ', error);
        setTextError("An error occurred while submitting the answer.");
      }
    }
  };

      
      
  //     const status = model.putAns(qid, newAnswer);
  //     if (status === 200) {
  //       // Redirect to the answers page or refresh the content
  //       handlePageChange("answersPage"); // Or any other page you want to redirect to
  //     } else {
  //       setTextError("An error occurred while submitting the answer.");
  //     }
  //   }
  // };

  return (
    <div className="answer-form-content">
      <form onSubmit={(e) => handleSubmit(e)}>
        {/* <h2>Username*</h2>
        <input
          type="text"
          className="single-line-textbox"
          id="username"
          value={username}
          required
          onChange={handleUsernameChange}
        />
        <div className="error">{usernameError}</div> */}

        <h2>Answer Text*</h2>
        <p>
          <i>Add details</i>
        </p>
        <textarea
          className="multi-line-textbox"
          id="answer-text"
          value={text}
          required
          onChange={handleTextChange}
        />
        <div className="error">{textError}</div>

        {hyperlinkError && <div className="error">{hyperlinkError}</div>}

        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "3vh" }}
        >
          <input
            type="submit"
            value="Post Answer"
            class="blue-btn"
            id="post-answer-btn"
          />
          <div style={{ flexGrow: 1 }}></div>
          <p style={{ color: "red" }}> * indicated mandatory fields</p>
        </div>
      </form>
    </div>
  );
};

export default PostAnswerForm;
