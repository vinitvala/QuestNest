import React from "react";
import Paragraph from "./paragraph";
import Ans from "./ans";
import CommentList from "../comment/commentList";
import { postComment } from "../../api";
import { useState, useEffect } from "react";
import axios from "axios";

const Answer = (props) => {
  const qid = props.qid;

  const [currentPage, setCurrentPage] = useState(0);
  const [sortedAnswers, setSortedAnswers] = useState([]);
  const pageSize = 5;

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/sortedanswers/${props.qid}`)
      .then((res) => {
        setSortedAnswers(res.data);
        console.log(res.data)
      })
      .catch((e) => {
        console.log(e);
      });
  }, [props.qid]);

  async function handleQuestionSubmit(text) {
    const question = getQuestionByQid(qid);
    console.log(question);
    await postComment(question._id, true, text, props.user._id);
    console.log("Comment posted for question");
  }

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  function getQuestionByQid(qid) {
    //use this
    return props.questions.find((question) => question._id === qid);
  }

  function getAnsByAid(aid) {
    //use this
    return props.answers.find((ans) => ans._id === aid);
  }

  const question = getQuestionByQid(qid);
  const totalPages = Math.ceil(question.answers.length / pageSize);
  console.log(question);
  console.log(props);

  const handleNext = () => {
    setCurrentPage((currentPage + 1) % totalPages); // Circular navigation
  };

  const handlePrev = () => {
    setCurrentPage(currentPage > 0 ? currentPage - 1 : 0);
  };

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;

  const displayedAnswers = sortedAnswers.slice(startIndex, endIndex);
  console.log(displayedAnswers)

  return (
    <div>
      <div class="answers-header">
        <div class="answers-header-info">
          <div id="answer-count">
            <p>{question.answers.length} answers</p>
          </div>
          <h1>{question.title}</h1>
          <button
            class="blue-btn"
            id="ask-question-btn"
            disabled={props.isGuest}
            onClick={(e) => {
              props.handlePageChange("ask");
            }}
          >
            {" "}
            Ask Question
          </button>
        </div>
        <div class="question-summary">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3 style={{ marginRight: "10px" }}>Summary:</h3>
            <p>{question.summary}</p>
          </div>
        </div>
      </div>
      <CommentList
        user={props.user}
        handlePageChange={props.handlePageChange}
        data={question}
        handleAnswerSubmit={handleQuestionSubmit}
        isGuest={props.isGuest}
      ></CommentList>
      <div class="answers-header-info2">
        <p class="answer-views">{question.views} views </p>
        <Paragraph text={question ? question.text : null}></Paragraph>
        <div class="answer-metadata2">
          <p class="question-metadata-user">{question.askedBy}</p>
          <p class="answer-metadata-date">
            asked {formatDate(question.ask_date_time)}
          </p>
        </div>
      </div>

      {displayedAnswers.map((obj) => {
        const ans = getAnsByAid(obj._id);
        return <Ans handlePageChange = {props.handlePageChange} isGuest={props.isGuest} ans={ans} user={props.user}></Ans>;
      })}

      <div className="list-navigation-btn-row">
        <button
          className="navigation-button"
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          Prev
        </button>
        <button
          className="navigation-button navigation-button-next"
          onClick={handleNext}
          disabled={totalPages <= 1}
        >
          Next
        </button>
      </div>

      <button
        class="blue-btn"
        id="answer-question-btn"
        disabled={props.isGuest}
        onClick={(e) => {
          props.handlePageChange("answer");
        }}
      >
        {" "}
        Answer Question
      </button>
    </div>
  );
};

export default Answer;
