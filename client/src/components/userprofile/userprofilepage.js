import React, { useEffect } from "react";
import PublicUserPage from "./publicuserpage";
import AdminUserPage from "./adminuserpage";
import {
  getQuestionsAnsweredByUser,
  getQuestionsByUser,
  getTagsByUser,
  getCommentsByUser,
} from "../../api";
import { useState } from "react";

const UserProfilePage = (props) => {
  const [tagsList, setTagsList] = useState([]);
  const [questionsAskedList, setQuestionsAskedList] = useState([]);
  const [questionsAnsweredList, setQuestionsAnsweredList] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (props.user) {
      console.log(props.user);
    }
  }, [props.user, props.tagsList, questionsAskedList, questionsAnsweredList]);

  useEffect(() => {
    const fetchData = async () => {
      const tags = await getTagsByUser(props.user._id);
      const questionsAsked = await getQuestionsByUser(props.user._id);
      const questionsAnswered = await getQuestionsAnsweredByUser(
        props.user._id
      );
      const comments = await getCommentsByUser(props.user._id);

      console.log("User:", props.user);
      console.log("Tags:", tags);
      console.log("Questions:", questionsAsked);
      console.log("Answers:", questionsAnswered);
      console.log("Comments:", comments);

      setTagsList(tags);
      setQuestionsAskedList(questionsAsked);
      setQuestionsAnsweredList(questionsAnswered);
      setComments(comments)
    };

    if (props.user) {
      fetchData();
    }
  }, [props.user]);

  if (props.isGuest)
    return (
      <div id="user-profile-page">
        <p id="guest-profile-banner">Viewing as Guest</p>
        <p id="guest-redirect">Please sign in to view a profile</p>
      </div>
    );

  switch (props.user.account_type) {
    case "public":
      return (
        <PublicUserPage
          user={props.user}
          tagsByUser={tagsList}
          questionsAskedByUser={questionsAskedList}
          questionsAnsweredByUser={questionsAnsweredList}
          comments = {comments}
        />
      );
    case "admin":
      return (
        <AdminUserPage
          users={props.users}
          user={props.user}
          tagsByUser={tagsList}
          questionsAskedByUser={questionsAskedList}
          questionsAnsweredByUser={questionsAnsweredList}
        />
      );
    default:
      return <div id="user-profile-page">Error Occurred</div>;
  }
};

export default UserProfilePage;
