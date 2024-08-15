import React from 'react';
import { useState } from 'react';

const CommentForm = ({ user, handleAnswerSubmit, isGuest, handlePageChange }) => {
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTextChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= 140) {
      setText(inputText);
      setErrorMessage(''); // Clear error message if within limit
    } else {
      setText(inputText.slice(0, 140)); // Prevent inputting more than 140 characters
      setErrorMessage('Comment must be 140 characters or less.'); // Show error message when limit is reached
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form from submitting
    if (text.length <= 140) {
      handleAnswerSubmit(text);
      setText(''); // Clear the text field after submission
      handlePageChange("questions")
    } else {
      setErrorMessage('Comment must be 140 characters or less.'); // Just in case, but should be prevented by handleTextChange
    }
  };

  return (
    <div>
      <div>
        <textarea
          maxLength="140"
          rows="5"
          cols="100"
          onChange={handleTextChange}
          value={text}
        ></textarea>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
      <button 
        type="submit" 
        onClick={handleSubmit} // Use handleSubmit instead of directly calling handleAnswerSubmit
        disabled={isGuest || (user && user.reputation < 50)}
      >
        Add Comment
      </button>
    </div>
  );
}

export default CommentForm;
