import React from "react";
import Paragraph from "./paragraph";
import { downvoteAnswer, upvoteAnswer } from "../../api";
import { useState, useEffect } from "react";
import CommentList from "../comment/commentList";
import { postComment } from "../../api";
import { getUserById } from "../../api";


const Ans = ({ ans, isGuest, user, handlePageChange }) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  async function handleAnswerSubmit(text){
    await postComment(ans._id, false, text, user._id)
    handlePageChange("questions")
    console.log("Comment posted")
  }

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  async function handleUpvote() {
    if (!upvoted && !downvoted) {
      setUpvotes(upvotes + 1);
      setUpvoted(true);
      await upvoteAnswer(ans._id, "add");
    } else if (upvoted && !downvoted) {
      setUpvotes(upvotes - 1);
      setUpvoted(false);
      await upvoteAnswer(ans._id, "remove");
    }
  }

  async function handleDownvote() {
    if (!downvoted && !upvoted) {
      setDownvotes(downvotes + 1);
      setDownvoted(true);
      await downvoteAnswer(ans._id, "add");
    } else if (downvoted && !upvoted) {
      setDownvotes(downvotes - 1);
      setDownvoted(false);
      await downvoteAnswer(ans._id, "remove");
    }
  }

  useEffect(() => {
    setUpvotes(ans.upvotes);
    setUpvoted(ans.upvoted);
    setDownvotes(ans.downvotes);
    setDownvoted(ans.downvoted);
    getUserById(ans.ans_by)
      .catch(error => console.error("Failed to fetch user:", error));
  }, [ans.upvotes, ans.upvoted, ans.downvotes, ans.downvoted, ans.ans_by]);

  return (
    <div key={ans._id} class="answer-container">
      <Paragraph text={ans.text}></Paragraph>
      <div className="answer-metadata2">
        <p className="answer-metadata-user">{ans.ans_by}</p>
        <p className="answer-metadata-date">
          answered {formatDate(ans.ans_date_time)}
        </p>
      </div>
      <div>
        <button  disabled = {isGuest || (user && user.reputation < 50)} onClick={handleUpvote}>Upvote: {upvotes}</button>
        <button disabled = {isGuest || (user && user.reputation < 50)} onClick={handleDownvote}>Downvote: {downvotes}</button>
      </div>
      <div>
      <CommentList handlePageChange = {handlePageChange} isGuest = {isGuest} user = {user} handleAnswerSubmit = {handleAnswerSubmit} data = {ans}></CommentList>
      </div>
    </div>
  );
};

export default Ans;
