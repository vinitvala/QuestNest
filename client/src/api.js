import axios from "axios";

const base_string = "http://localhost:8000";

/** Make a post request to register a new user account */
export async function registerUserAccount(
  username,
  email,
  pw,
  accountType = "public"
) {
  try {
    const response = await axios.post(
      `${base_string}/register`,
      {
        email,
        username,
        pw,
        accountType,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error registering user account.", err);
    return err;
  }
}

/** Make a post request for logging the user into their account */
export async function login(email, pw) {
  try {
    const response = await axios.post(
      `${base_string}/login`,
      {
        email,
        pw,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error logging into user account.", err);
    throw err;
  }
}

/** Makes a get request to delete the users session. */
export async function logout() {
  const response = await axios.get(`${base_string}/logout`);
  console.log(response.data);
}

/** Makes a get request to retrieve all tags created by user. */
export async function getTagsByUser(userId) {
  try {
    const response = await axios.get(`${base_string}/tagsby`, {
      params: { userId }, // Use params property
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error retrieving tags made by user", err);
  }
}

export async function getQuestionsByUser(userId) {
  try {
    const response = await axios.get(`${base_string}/questionsby`, {
      params: { userId }, // Use params property
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error retrieving questions asked by user", err);
  }
}

export async function getCommentsByUser(userId) {
  try {
    const response = await axios.get(`${base_string}/commentsby`, {
      params: { userId }, // Use params property
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error retrieving questions asked by user", err);
  }
}

export async function getQuestionsAnsweredByUser(userId) {
  try {
    const response = await axios.get(`${base_string}/questionsanswered`, {
      params: { userId }, // Use params property
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error retrieving questions answered by user", err);
  }
}

export async function getUserById(userId) {
  try {
    const response = await axios.get(`${base_string}/users/${userId}`);
    console.log("User: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user: ", error);
    return undefined;
  }
}

export async function getAllUsers() {
  try {
    const response = await axios.get(`${base_string}/users`);
    console.log("Users: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}

export async function getAllComments() {
  try {
    const response = await axios.get(`${base_string}/getallcom`);
    console.log("Comments: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}

/** Make a post request to store a question into db */
export async function postComment(id, question, text, comment_by) {
  try {
    const response = await axios.post(
      `${base_string}/comment`,
      {
        id,
        question,
        text,
        comment_by,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("New question created: ", response.data);
    return response.data;
  } catch (err) {
    console.error("Error creating a new question: ", err);
    return undefined;
  }
}

/*
Downvotes and upvotes
*/

async function addUpvoteForQuestion(questionId, voterId) {
  try {
    await axios.post(`${base_string}/questionupvote/${questionId}/add`, {
      voterId,
    });
    console.log("Question upvoted successfully.");
  } catch (err) {
    console.log("Error occured when upvoting question.");
  }
}

async function removeUpvoteForQuestion(questionId, voterId) {
  try {
    await axios.post(`${base_string}/questionupvote/${questionId}/remove`, {
      voterId,
    });
    console.log("Question upvote removed successfully.");
  } catch (err) {
    console.log("Error occured when updating question upvotes.");
  }
}

async function addDownvoteForQuestion(questionId, voterId) {
  try {
    await axios.post(`${base_string}/questiondownvote/${questionId}/add`, {
      voterId,
    });
    console.log("Question downvoted successfully.");
  } catch (err) {
    console.log("Error occured when downvoting question.");
  }
}

async function removeDownvoteForQuestion(questionId, voterId) {
  try {
    await axios.post(`${base_string}/questiondownvote/${questionId}/remove`, {
        voterId,
      });
    console.log("Question downvote removed successfully.");
  } catch (err) {
    console.log("Error occured when updating question downvote.");
  }
}

async function addUpvoteForAnswer(answerId) {
  try {
    await axios.post(`${base_string}/answerupvote/${answerId}/add`);
    console.log("Answer upvoted successfully.");
  } catch (err) {
    console.log("Error occured when upvoting answer.");
  }
}

async function removeUpvoteForAnswer(answerId) {
  try {
    await axios.post(`${base_string}/answerupvote/${answerId}/remove`);
    console.log("Answer upvote removed successfully.");
  } catch (err) {
    console.log("Error occured when updating answer upvotes.");
  }
}

async function addDownvoteForAnswer(answerId) {
  try {
    await axios.post(`${base_string}/answerdownvote/${answerId}/add`);
    console.log("Answer downvoted successfully.");
  } catch (err) {
    console.log("Error occured when downvoting answer.");
  }
}

async function removeDownvoteForAnswer(answerId) {
  try {
    await axios.post(`${base_string}/answerdownvote/${answerId}/remove`);
    console.log("Answer downvote removed successfully.");
  } catch (err) {
    console.log("Error occured when updating answer downvotes.");
  }
}

async function addUpvoteForComment(commentId) {
  try {
    await axios.post(`${base_string}/commentupvote/${commentId}/add`);
    console.log("Comment upvoted successfully.");
  } catch (err) {
    console.log("Error occured when upvoting comment.");
  }
}

async function removeUpvoteForComment(commentId) {
  try {
    await axios.post(`${base_string}/commentupvote/${commentId}/remove`);
    console.log("Comment upvote removed successfully.");
  } catch (err) {
    console.log("Error occured when updating comment upvotes.");
  }
}

export async function upvoteQuestion(questionId, action, voterId) {
  if (action === "add") await addUpvoteForQuestion(questionId, voterId);
  if (action === "remove") await removeUpvoteForQuestion(questionId, voterId);
}

export async function downvoteQuestion(questionId, action, voterId) {
  if (action === "add") await addDownvoteForQuestion(questionId, voterId);
  if (action === "remove") await removeDownvoteForQuestion(questionId, voterId);
}

export async function upvoteAnswer(answerId, action) {
  if (action === "add") await addUpvoteForAnswer(answerId);
  if (action === "remove") await removeUpvoteForAnswer(answerId);
}

export async function downvoteAnswer(answerId, action) {
  if (action === "add") await addDownvoteForAnswer(answerId);
  if (action === "remove") await removeDownvoteForAnswer(answerId);
}

export async function upvoteComment(commentId, action) {
  if (action === "add") await addUpvoteForComment(commentId);
  if (action === "remove") await removeUpvoteForComment(commentId);
}

export async function checkEmail(email) {
  try {
    const value = await axios.get(`${base_string}/email`, {
      params: { email }, // Use params property
    });
    return value;
  } catch (err) {
    console.log("Error occured when upvoting question.");
  }
}
