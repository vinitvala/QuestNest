import React from "react";
import "../../stylesheets/App.css";
import {downvoteQuestion, upvoteQuestion} from "../../api"
import axios from "axios";
import { useEffect, useState } from "react";

const Question = (props) => {
  const [upvotes, setUpvotes] = useState(0)
  const [downvotes, setDownvotes] = useState(0)
  const [upvoted, setUpvoted] = useState(false)
  const [downvoted, setDownvoted] = useState(false)
  const data = props.data;

  useEffect(()=>{
    if(props.user){setUpvotes(props.data.upvoters.length)
    setDownvotes(props.data.downvoters.length)
    if(props.data.upvoters.indexOf(props.user._id)>=0){
      setUpvoted(true)
      console.log(upvoted)
    }
    if(props.data.downvoters.indexOf(props.user._id)>=0){
      setDownvoted(true)
      console.log(downvoted)
    }}
  }, [])

  async function handleUpvote(){
    if(!upvoted && !downvoted){
      setUpvotes(upvotes+1)
      setUpvoted(true)
    await upvoteQuestion(props.data._id, 'add', props.user._id)
    }
    else if(upvoted && !downvoted){
      setUpvotes(upvotes-1)
      setUpvoted(false)
      await upvoteQuestion(props.data._id, 'remove', props.user._id)
    }
  }

  async function handleDownvote(){
    if(!downvoted && !upvoted){
      setDownvotes(downvotes+1)
      setDownvoted(true)
      await downvoteQuestion(props.data._id, 'add', props.user._id)
    }
    else if(downvoted && !upvoted){
      setDownvotes(downvotes-1)
      setDownvoted(false)
      await downvoteQuestion(props.data._id, 'remove', props.user._id)
    }
  }

  function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000; // years
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000; // months
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400; // days
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600; // hours
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60; // minutes
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  function getTagById(tid) {
    for (const item of props.tags) {
      if (item._id === tid) {
        return item.name;
      }
    }
  }

  function handleClick(qid) {
    console.log(qid);
    data.views++
    props.handleQidChange(qid);
    axios.get(`http://127.0.0.1:8000/incrementViews/${qid}`)
    props.handlePageChange("answersPage");
  }

  return (
    <div class="question">
      <div class="question-container">
        <div class="question-info">
          <p>{data.answers.length} answers</p>
          <p>{data.views} views</p>
        </div>
        <div class="question-title-container">
          <a
            class="question-title"
            href="/#"
            style={{ "text-decoration": "none" }}
            onClick={(e) => {
              handleClick(data._id);
            }}
          >
            {data.title}
          </a>
          {/* changed this to A tag */}
         <div class="question-tags">
            {data.tags.map((id) => {
              return (
                <button class="question-tag">{getTagById(id)}</button>
              );
            })}
          </div>
        </div>
        <div>
          <div class="question-metadata">
            <p class="question-metadata-user">{data.asked_by}&nbsp;</p>
            <p class="question-metadata-date"> {timeSince(new Date(data.ask_date_time))}</p>
          </div>
          <div>
            <button disabled = {props.isGuest || (props.user && props.user.reputation < 50)} onClick = {handleUpvote}>Upvote: {upvotes}</button>
            <button disabled = {props.isGuest || (props.user && props.user.reputation < 50)} onClick = {handleDownvote}>Downvote: {downvotes}</button>
          </div>
        </div>
      </div>
      <hr class="seperator" />
    </div>
  );
};

export default Question;
