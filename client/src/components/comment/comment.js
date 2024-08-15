import React from "react";
import { useEffect, useState } from "react";
import { getUserById, upvoteComment } from "../../api";
import axios from "axios";

const Comment = ({ data, isGuest, user }) => {
  const [comment, setComment] = useState("");
  const [upvotes, setUpvotes] = useState(null);
  const [upvoted, setUpvoted] = useState(false);

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  async function handleUpvote() {
    if (!upvoted) {
      setUpvotes(upvotes + 1);
      setUpvoted(true);
      await upvoteComment(comment._id, "add");
    } else if (upvoted) {
      setUpvotes(upvotes - 1);
      setUpvoted(false);
      await upvoteComment(comment._id, "remove");
    }
  }

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/commentby/${data}`).then((fetch) => {
      setComment(fetch.data);
    }).then(getUserById(comment.comment_by).then((res) => {
      setUpvotes(comment.upvotes);
      setUpvoted(comment.upvoted);
    }));
  }, [upvotes, comment.comment_by, comment.upvotes, comment.upvoted, data]);

 
  console.log(data)
  return (
    <div>
      <div className="comment">
        <p>{comment.text}</p>
        <p>
          By {comment.comment_by} on {formatDate(comment.comment_date_time)}
        </p>
        {/* <button>Upvote: {5}</button> */}
      </div>
      <div>
        <button
          disabled={isGuest || (user && user.reputation < 50)}
          onClick={handleUpvote}
        >
          Upvote: {upvotes ? upvotes : 0}
        </button>
      </div>
    </div>
  );
};

export default Comment;