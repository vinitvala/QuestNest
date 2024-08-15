import React from "react";
import Comment from "./comment";
import CommentForm from "./commentForm";
import { useState } from "react";

const CommentList = ({ user, handleAnswerSubmit, data, isGuest, handlePageChange }) => {

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3;
  
  if (!data || !data.comments) {
    return <div>Loading...</div>; // Handle loading state
  }

  const totalPages = Math.ceil(data.comments.length / pageSize);
  
  const handleNext = () => {
    setCurrentPage((currentPage + 1) % totalPages); // Wraps around to the first page after the last
  };

  // Navigate to the previous page
  const handlePrev = () => {
    setCurrentPage(currentPage > 0 ? currentPage - 1 : 0); // Wraps to the last page if on the first
  };

    // Calculate the slice of data to display
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const currentComments = data.comments.slice(startIndex, endIndex);

    
  console.log(data.comments)
  return (
    <div className="comment-list">
      <p>Comments</p>
      {currentComments.map((item, index) => (
        <Comment key={index} user = {user} data={item}></Comment>
      ))}
      <CommentForm handlePageChange = {handlePageChange} user = {user} isGuest = {isGuest} handleAnswerSubmit={handleAnswerSubmit}></CommentForm>

      <div className="list-navigation-btn-row">
        <button className="navigation-button" onClick={handlePrev} disabled={currentPage === 0}>Prev</button>
        <button className="navigation-button navigation-button-next" onClick={handleNext} disabled={totalPages <= 1}>Next</button>
      </div>
    </div>
  );
};

export default CommentList;
