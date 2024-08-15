import React, { useState, useEffect } from "react";
import Question from "../components/question/question";
import "../stylesheets/App.css";
import axios from "axios";

const Homepage = (props) => {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  const totalPages = Math.ceil(filteredQuestions.length / pageSize);

  const handleNext = () => {
    const nextPage = (currentPage + 1) % totalPages; // Circular navigation
    setCurrentPage(nextPage);
  };

  const handlePrev = () => {
    const prevPage = currentPage > 0 ? currentPage - 1 : 0;
    setCurrentPage(prevPage);
  };

  // Calculate the current page's questions
  const start = currentPage * pageSize;
  const currentQuestions = filteredQuestions.slice(start, start + pageSize);
  
  function searchTags(questions, tags, word) { //console log here?
    const results = [];
    const tag = getTag(tags, word); //get the tag id based on the word
    if (tag) {
      for (const question of questions) {
        //add the question in results if question belongs to the tag
        const tags = question.tags;
        if (tags.includes(tag)) {
          results.push(question);
        }
      }
    }
    return results;
  }

  function getTag(tags, word) {
    for (const tag of tags) {
      const name = tag.name.toLowerCase();
      const arr = name.split(" ");
      if (arr.includes(word)) {
        return tag._id;
      }
    }
    return null;
  }

  function search(questions, tags, string) {
    const results = new Set();
    const lowerString = string.toLowerCase();
    const strArr = lowerString.split(" ");
    console.log(strArr);
    for (let item of strArr) {
      if (item.charAt(0) === "[" && item.charAt(item.length - 1) === "]") {
        item = item.slice(1, item.length - 1);
        const arr = searchTags(questions, tags, item);
        arr.forEach((element) => results.add(element));
      } else {
        let arr = searchTitle(questions, item);
        arr.forEach((element) => results.add(element));
        arr = searchText(questions, item);
        arr.forEach((element) => results.add(element));
      }
    }
    return Array.from(results);
  }

  function searchTitle(questions, word) {
    const results = [];
    for (const question of questions) {
      const title = question.title.toLowerCase();
      const arr = title.split(" ");
      if (arr.includes(word)) {
        results.push(question);
      }
    }
    return results;
  }

  function searchText(questions, word) {
    const results = [];
    for (const question of questions) {
      const text = question.text.toLowerCase();
      const arr = text.split(" ");
      if (arr.includes(word)) {
        results.push(question);
      }
    }
    return results;
  }

  function getAnsIdSortedByTime() {
    const newData = [...props.answers];
    newData.sort(function (a, b) {
      return new Date(b.ans_date_time) - new Date(a.ans_date_time);
    });
    console.log(newData)
    return newData;
  }

  function getQuestionByAid(aid) {
    for (const question of props.questions) {
      if (question.answers.includes(aid)) {
        return question;
      }
    }
  }

  

  function sort(questions, type) {
      if (type === "Newest") {
        const newData = questions.sort(function (a, b) {
          return new Date(b.ask_date_time) - new Date(a.ask_date_time);
        });
        console.log(newData);
        return newData;
      } else if (type === "Unanswered") {
        const filteredData = questions.filter(function (a) {
          return a.answers.length === 0;
        });
        return filteredData;
      } else {
        const results = new Set();
        const ans = []
        const answers = getAnsIdSortedByTime();
        console.log(answers)
        for (const answer of answers) {
          const question = getQuestionByAid(answer._id);
          for (const item of questions) {
            if (item._id === question._id) {
              if(!results.has(question)){
                ans.push(item)
              }
              results.add(item)
            }
          }
        }
      console.log(ans)
      return ans;
    }
  }

  useEffect(() => {
    console.log(props.page)
    setFilteredQuestions(sort(props.questions, "Newest"))
  }, [props.page, props.questions]);

  useEffect(() => {
    if (props.searchTerm !== "") {
      axios.get("http://127.0.0.1:8000/getAllQstns").then((res) => {
        setFilteredQuestions(search(props.questions, props.tags, props.searchTerm));
        setCurrentPage(0);
      });
    }
  }, [props.searchTerm]);

  useEffect(() => {
    console.log("tag filter changed")
    if (props.tagFilter !== "") {
      console.log(props.tagFilter)
      const questions = searchTags(props.questions, props.tags, props.tagFilter)
      console.log("here:" + questions)
      setFilteredQuestions(questions)
      console.log(filteredQuestions)
    }
  }, [props.tagFilter, filteredQuestions]);


  useEffect(() => {
    if (props.sortType !== "" && props.questions) {
      setFilteredQuestions(sort(props.questions, props.sortType));
    }
  }, [props.sortType]);

  return (filteredQuestions && props.tags) ||
    (props.questions && props.tags) ? (
    <>
      <div class="questions-header">
        <div class="questions-header-info">
          {props.searchTerm !== "" ? (
            <h2>Search Results</h2>
          ) : (
            <h2>All Questions</h2>
          )}
          <p class="question-count">{filteredQuestions? filteredQuestions.length:props.questions.length} questions</p>
        </div>
        <div class="questions-header-btns">
          <button
            class="blue-btn"
            id="ask-question-btn"
            onClick={(e) => {
              props.handlePageChange("ask");
            }}
            disabled = {props.isGuest}
          >
            Ask Question
          </button>
          <div class="sort-btns">
            <button
              href="#"
              class="sort-btn"
              onClick={(e) => {
                props.handleSortTypeChange("Newest");
              }}
            >
              Newest
            </button>
            <button
              href="#"
              class="sort-btn"
              onClick={(e) => {
                props.handleSortTypeChange("Active");
              }}
            >
              Active
            </button>
            <button
              href="#"
              class="sort-btn"
              onClick={(e) => {
                props.handleSortTypeChange("Unanswered");
              }}
            >
              Unanswered
            </button>
          </div>
        </div>
      </div>

      {props.searchTerm !== "" && props.questions === 0 ? (
        <div class="list-range-text" style={{ minWidth: "90vw" }}>
          <h1>No Questions Found</h1>
        </div>
      ) : (
        <div class="questions">
          {currentQuestions
            ? currentQuestions.map((data) => {
                return (
                  <Question
                    data={data}
                    handleQidChange={props.handleQidChange}
                    handlePageChange={props.handlePageChange}
                    tags = {props.tags}
                    isGuest = {props.isGuest}
                    user = {props.user}
                  ></Question>
                );
              })
            : sort(props.questions, "Newest").map((data) => {
                return (
                  <Question
                    data={data}
                    handleQidChange={props.handleQidChange}
                    handlePageChange={props.handlePageChange}
                    tags = {props.tags}
                    isGuest = {props.isGuest}
                    user = {props.user}
                  ></Question>
                );
              })}
        </div>
      )}
      <div className="list-navigation-btn-row">
        <button className="navigation-button" onClick={handlePrev} disabled={currentPage === 0}>Prev</button>
        <button className="navigation-button navigation-button-next" onClick={handleNext} disabled={totalPages <= 1}>Next</button>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Homepage;