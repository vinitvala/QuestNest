import "../stylesheets/App.css";
import Banner from "./banner/banner.js";
import Sidebar from "./sidebar/sidebar";
import Homepage from "./homepage";
import Tagpage from "./tag/tagpage.js";
import PostQuestionForm from "./question/newquestion.js";
import Answer from "./answer/answer.js";
import PostAnswerForm from "./answer/newanswer.js";
import Welcome from "./welcome/welcome.js"
import axios from "axios";
import React, { useEffect, useState } from "react";
import UserProfilePage from "./userprofile/userprofilepage";

export default function FakeStackOverflow() {
  const [page, setPage] = useState("welcome");
  const [tagFilter, setTagFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("Newest");
  const [qid, setQid] = useState(0);

  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [tags, setTags] = useState("");
  const [users, setUsers] = useState("");

  const [isGuest, setIsGuest] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/getAllQstns")
      .then((res) => {
        setQuestions(res.data);
        return axios.get("http://127.0.0.1:8000/getAllTags");
      })
      .then((res) => {
        setTags(res.data);
        return axios.get("http://127.0.0.1:8000/getAllAns");
      })
      .then((res) => {
        setAnswers(res.data);
        return axios.get("http://127.0.0.1:8000/getAllUsers");
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [page]);

  useEffect(() => {
  }, [user]);

  function handleSetGuest(e){
    setIsGuest(e)
  }

   const handleUserChange = (e) => {
    setUser(e)
    console.log("user change")
    console.log(user)
  }

  function handlePageChange(e) {
    setTagFilter("");
    setSearchTerm("");
    setSortType("Newest");

    setPage(e);
  }

  function handleSortTypeChange(e) {
    setSortType(e);
    setPage("questions");
  }

  function handleTagFilterChange(e) {
    //error could be here
    console.log("fso1:" + e);
    setTagFilter(e);
    console.log("fso2:" + e);
    setPage("questions");
  }

  function handleSearchTermChange(e) {
    setSearchTerm(e);
    setTagFilter("");
    setSortType("Newest");
    setPage("questions");
  }

  function handleQidChange(e) {
    setQid(e);
  }

  return (
    <>
      <Banner page = {page} handleSearchTermChange={handleSearchTermChange} handlePageChange = {handlePageChange}></Banner>
      <div className="main-container" style={{ display: 'flex', justifyContent: 'center' }}>
        {page === "welcome"?
          (<Welcome user = {user} handleSetGuest = {handleSetGuest} handlePageChange = {handlePageChange} handleUserChange ={handleUserChange}> </Welcome>)
          :
          (
            <>
              <Sidebar page={page} handlePageChange={handlePageChange}></Sidebar>
              <div className="main-content">
                {page === "questions" ? (
                  <Homepage
                    page={page}
                    searchTerm={searchTerm}
                    tagFilter={tagFilter}
                    handleTagFilterChange={handleTagFilterChange}
                    handleSortTypeChange={handleSortTypeChange}
                    sortType={sortType}
                    handlePageChange={handlePageChange}
                    handleQidChange={handleQidChange}
                    questions={questions}
                    answers={answers}
                    tags={tags}
                    isGuest = {isGuest}
                    user = {user}
                  ></Homepage>
                ) : null}
                {page === "user"?
                  (<UserProfilePage
                    qid={qid}
                    handlePageChange={handlePageChange}
                    questions={questions}
                    user = {user}
                    isGuest = {isGuest}
                    users = {users}
                  >
                  </UserProfilePage>
              ) : null}
                {page === "tags" ? (
                  <Tagpage
                    handlePageChange={handlePageChange}
                    handleTagFilterChange={handleTagFilterChange}
                    questions={questions}
                    answers={answers}
                    tags={tags}
                    isGuest = {isGuest}
                  ></Tagpage>
                ) : null}
                {page === "ask" ? (
                  <PostQuestionForm
                    handlePageChange={handlePageChange}
                    user = {user}
                  ></PostQuestionForm>
                ) : null}
                {page === "answer" ? (
                  <PostAnswerForm
                    qid={qid}
                    handlePageChange={handlePageChange}
                    user = {user}
                  ></PostAnswerForm>
                ) : null}
                {page === "answersPage" ? (
                  <Answer
                    qid={qid}
                    handlePageChange={handlePageChange}
                    questions={questions}
                    answers={answers}
                    tags={tags}
                    isGuest = {isGuest}
                    user = {user}
                  ></Answer>
                ) : null}
              </div>
            </>
          )}
  
      </div>
    </>
  );
}
