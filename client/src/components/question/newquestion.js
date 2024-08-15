import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../stylesheets/App.css";

/**
 * Renders a form for posting a question.
 *
 * @returns {JSX.Element} The rendered form component.
 */

// addQuestion function is passed as a prop from the parent component and is responsible for adding the new question to the data model

//remove addQuestion and model from the props
const PostQuestionForm = ({ handlePageChange, user }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [username, setUsername] = useState(""); //remove username!
  const [summary, setSummary] = useState("");
  const [titleError, setTitleError] = useState("");
  const [textError, setTextError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [hyperlinkError, setHyperlinkError] = useState("");
  const [summaryError, setSummaryError] = useState("");

  // const validateHyperlink = (text) => {
  //     const hyperlinkRegex = /\[([^\]]+)\]\((http:\/\/|https:\/\/)[^\)]+\)/g; // /\[[^\]]*\]\((3?!(https:\/\/|http:\/\/)).*\)/g
  //     return text.match(hyperlinkRegex) || [];
  // };
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
  // Validation and state update functions

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.length > 100) {
      setTitleError("Title must be 100 characters or less.");
    } else {
      setTitleError("");
    }
  };

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
    if (e.target.value.length > 140) {
      setSummaryError("Title must be 140 characters or less.");
    } else {
      setSummaryError("");
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTags(value);
    const tagList = value.split(" ").filter((tag) => tag);
    if (tagList.length > 5) {
      setTagsError("No more than 5 tags are allowed.");
    } else if (tagList.some((tag) => tag.length > 10)) {
      setTagsError("Each tag must be no longer than 10 characters.");
    } else {
      setTagsError("");
    }
  };

  // const handleUsernameChange = (e) => {
  //   const value = e.target.value;
  //   setUsername(value);
  //   if (!value.trim()) {
  //     setUsernameError("Username cannot be empty.");
  //   } else {
  //     setUsernameError("");
  //   }
  // };

  //const handleSubmit = async (e) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = Array.from(text.matchAll(regex), (match) => match[0]);
    console.log(matches);


    setHyperlinkError("");
    for (const link of matches) {
      console.log(link);
      if (!validateHyperlink(link)) {
      }
    }

    if (
      titleError ||
      textError ||
      tagsError ||
      summaryError ||
      usernameError ||
      hyperlinkError
    ) {
      // If there are any validation errors, stop the form submission
      console.log("Validation errors, submission aborted.");
      return;
    }

    // Construct the question object
    const newQuestion = {
      title,
      summary,
      text,
      tags: tags.split(" "), // Assuming tags are sent as an array
      asked_by: user._id, //should be id!!
    };

    try {
      // Send a POST request to the server
      const response = await axios.post(
        "http://localhost:8000/questions",
        newQuestion
      );
      console.log(response.data);

      // Reset the form and redirect to the questions page
      setTitle("");
      setSummary("");
      setText("");
      setTags("");
      handlePageChange("questions");
    } catch (error) {
      console.error("Error submitting the question: ", error);
      setTextError("An error occurred while submitting the question.");
    }
  };

  return (
    <div className="question-form-content">
      <form onSubmit={(e) => handleSubmit(e)}>
        <h2>Question Title*</h2>
        <p style={{ color: "red" }}>
          <i>Limit title to 100 characters or less</i>
        </p>

        <input
          type="text"
          className="single-line-textbox"
          id="question-title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Limit title to 100 characters or less"
          required
        />
        {titleError && <div className="error">{titleError}</div>}

        <h2>Question Summary*</h2>
        <p style={{ color: "red" }}>
          <i>Limit summary to 140 characters or less</i>
        </p>

        <input
          type="text"
          className="single-line-textbox"
          id="question-summary"
          value={summary}
          onChange={handleSummaryChange}
          placeholder="Limit summary to 140 characters or less"
          required
        />
        {summaryError && <div className="error">{summaryError}</div>}

        <h2>Question Text*</h2>
        <p>
          <i>Add details</i>
        </p>
        <textarea
          className="multi-line-textbox"
          id="question-text"
          value={text}
          onChange={handleTextChange}
          placeholder="Add details"
          required
        />
        {textError && <div className="error">{textError}</div>}
        {hyperlinkError && <div className="error">{hyperlinkError}</div>}

        <h2>Tags*</h2>
        <p>
          <i>Add keywords separated by whitespace</i>
        </p>
        <input
          type="text"
          className="single-line-textbox"
          id="question-tags"
          value={tags}
          onChange={handleTagsChange}
          placeholder="Add keywords separated by whitespace"
        />
        {tagsError && <div className="error">{tagsError}</div>}

        {/* <h2>Username*</h2>
        <p>
          <i>Your Username</i>
        </p>
        <input
          type="text"
          id="username"
          className="single-line-textbox"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Your username"
          required
        />
        {usernameError && <div className="error">{usernameError}</div>} */}

        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "3vh" }}
        >
          <input
            type="submit"
            value="Post Question"
            class="blue-btn"
            id="post-question-btn"
          >
            {/* onChange= "handlePostAnswerClick()" //keep this?   */}
          </input>
          <div></div>
          <p style={{ color: "red" }}> * indicated mandatory fields</p>
        </div>
      </form>
    </div>
  );
};

export default PostQuestionForm;
