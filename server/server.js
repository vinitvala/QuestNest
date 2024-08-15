// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

//Model Schemas
var Question = require("./models/question.js");
var Tag = require("./models/tag");
var Answer = require("./models/answer");
var User = require("./models/user");
var Comment = require("./models/comment");

var express = require("express");
const session = require("express-session");

//DB methods
//Question
var Questions = require("./pages/question/question.js");
var createQuestion = require("./pages/question/createquestion.js");
var deleteQuestion = require("./pages/question/deletequestion.js");
//Answer
var createAnswer = require("./pages/answer/createanswer.js");
var deleteAnswer = require("./pages/answer/deleteanswer.js");
//User
var Users = require("./pages/user/users.js");
var CreateUser = require("./pages/user/create_user.js");
//Tags
var Tags = require("./pages/tag/tags.js");
var deleteTag = require("./pages/tag/deletetag.js");
//Comments
var CreateComment = require("./pages/comment/createcomment.js");

const port = 8000;
const saltRounds = 10;

//MongoDB setup
let mongoose = require("mongoose");
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
const MongoStore = require("connect-mongo");

//Express middleware setup
const app = express();
app.use(express.json()); //use Express to parse JSON bodies

//CORs
var cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

//Bcrypt configuration
const bcrypt = require("bcrypt");
const { getSortedAnswersForQuestion } = require("./pages/answer/sortedAns.js");
const secretKey = process.argv[2] || "ITxnjokRGEc9dkNkDzW7";
app.use(
  session({
    secret: secretKey,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
      secure: false,
      sameSite: "strict",
    },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: mongoDB }),
  })
);

//one outside connection of many inside await connections?
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", function () {
  console.log("Connected to database");
});

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/email", async function (req, res) {
  const emailId = req.query.email;
  const arr = await User.find({ email: emailId });
  console.log(arr);
  res.send(arr.length == 0 ? true : false);
});

//Delete comment
app.delete("/comment/:commentId", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    const commentId = req.params.commentId;
    await Comment.deleteOne({ _id: commentId });
    res.send("Comment deleted");
  });
});

//Delete answer
app.delete("/answer/:answerId", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    const answerId = req.params.answerId;
    const response = await deleteAnswer.deleteAnswer(res, answerId);
    res.send(response);
  });
});

//Delete tag
app.delete("/tag/:tagId", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    const tagId = req.params.tagId;
    const userId = req.body.userId;
    const response = await deleteTag.deleteTag(res, tagId, userId);
    res.send(response);
  });
});

//Delete question
app.delete("/question/:id", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    const qid = req.params.id;
    const response = await deleteQuestion.deleteQuestion(res, qid);
    res.send(response);
  });
});

//Get all methods
app.get("/getAllQstns", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    let questions = await Question.find({});
    res.send(questions);
  });
});

app.delete("");

app.get("/getAllTags", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    let tags = await Tag.find({});
    res.send(tags);
  });
});

app.get("/getAllUsers", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    let tags = await User.find({});
    res.send(tags);
  });
});

app.get("/getAllAns", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    let answers = await Answer.find({});
    res.send(answers);
  });
});

app.get("/getAllCom", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    let comments = await Comment.find({})
      .sort({ comment_date_time: -1 }) // Sort by comment_date_time in descending order
      .exec();
    res.send(comments);
  });
});

//View methods
app.get("/incrementViews/:id", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    const updatedUser = await Question.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.json(updatedUser);
  });
});

app.get("/getViews/:id", async function (req, res) {
  await mongoose.connect(mongoDB).then(async (res2) => {
    const collect = await Question.findByIdAndUpdate(req.params.id).views;
    res.json(collect);
  });
});

// POST endpoint to add a new question
app.post("/questions", (req, res) => {
  console.log(req.body); // Check what data is received
  const { title, summary, text, tags, asked_by } = req.body;
  createQuestion.newQuestion(res, title, summary, text, tags, asked_by);
});

// POST endpoint to add a new comment
app.post("/comment", (req, res) => {
  console.log(req.body); // Check what data is received
  const { id, question, text, comment_by } = req.body;
  CreateComment.newComment(res, id, question, text, comment_by);
});

// POST endpoint to add a new answer to a question
app.post("/answers", (req, res) => {
  console.log(req.body); // Check what data is received
  const { questionId, text, ans_by } = req.body;
  createAnswer.newAnswer(res, questionId, text, ans_by);
});

//Get user by ID
app.get("/users/:userId", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId).exec();
    res.send(user);
  } catch (error) {
    console.log("Error occured when retrieving user: ", error);
    res.send(undefined);
  }
});

app.get("/sortedcomments/:questionId", async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Find the question document by ID and populate its comments field
    const question = await Question.findById(questionId).populate("comments");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Sort the comments by comment_date_time in descending order
    const sortedComments = question.comments.sort(
      (a, b) => b.comment_date_time - a.comment_date_time
    );

    // Send the sorted comments as the response
    res.json(sortedComments);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/sortedanswers/:questionId", async (req, res) => {
  try {
    const questionId = req.params.questionId
    const sortedAnswers = await getSortedAnswersForQuestion(questionId)
    res.send(sortedAnswers)
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//User profile methods
app.get("/tagsby", async (req, res) => {
  const userId = req.query.userId;
  await Tags.get_tags_by_user(res, userId);
}); // make changes to tags page

app.get("/questionsby", async (req, res) => {
  const userId = req.query.userId;
  await Questions.get_questions_by_user(res, userId);
});

app.get("/commentsby", async (req, res) => {
  const userId = req.query.userId;
  await CreateComment.get_comments_by_user(res, userId);
});

app.get("/commentby/:id", async (req, res) => {
  const itemId = req.params.id;
  const result = await Comment.findById(itemId).exec();
  res.send(result);
});

app.get("/questionsanswered", async (req, res) => {
  const userId = req.query.userId;
  await Questions.get_questions_answered_by_user(res, userId);
});

/* welcome page methods */
app.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const uid = req.body.username;
  const email = req.body.email;
  const accountType =
    req.body.accountType === "" ? "public" : req.body.accountType;
  const duplicateEmailAccounts = (await User.find({ email: email }))[0];
  if (duplicateEmailAccounts)
    return res
      .status(401)
      .json({ errorMessage: "An account already exists with this email." });
  console.log("PASSWORD: ", req.body.pw, "SALT: ", salt);
  const pwHash = await bcrypt.hash(req.body.pw, salt);
  await CreateUser.new_user(res, uid, email, pwHash, accountType);
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const enteredPassword = req.body.pw;
  const user = (await User.find({ email: email }).exec())[0];
  if (!user)
    return res
      .status(401)
      .json({ errorMessage: "Wrong email address or password." });
  const verdict = await bcrypt.compare(enteredPassword, user.passwordHash);
  if (!verdict) {
    return res
      .status(401)
      .json({ errorMessage: "Wrong email address or password." });
  } else {
    console.log("Successfully logged in as: ", user.username);
    req.session.user = user;
    req.session.save();
    res.send(user);
  }
});

// app.get("/cachedlogin", async (req, res) => {
//   const user = req.session.user;
//   console.log(req.session);
//   if (user) console.log("Found previous login, ", user.username);
//   else console.log("Did not find a previous login.");
//   res.send(user);
// });

app.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      res.clearCookie("connect.sid");
      res.send("Logout successful");
    }
  });
});

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port 8000");
});

app.post("/questionupvote/:questionId/:action", async (req, res) => {
  const questionId = req.params.questionId;
  const voterId = req.body.voterId;
  const action = req.params.action;
  let rep_amt = 5,
    upvote_amt = 1;
  if (action === "remove") {
    rep_amt *= -1;
    upvote_amt *= -1;
  }

  try {
    const question = await Question.findById(questionId).populate("asked_by");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const user = question.asked_by;

    user.reputation += rep_amt;
    await user.save();

    const voter = await User.findById(voterId); // Use findById to find a user by ID

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    console.log(voter);

    question.upvotes += upvote_amt;

    // Use $push to add the voter ID to the upvoters array
    if (action == "remove") {
      await Question.updateOne(
        { _id: questionId },
        { $pull: { upvoters: voter._id } }
      );
    } else {
      await Question.updateOne(
        { _id: questionId },
        { $addToSet: { upvoters: voter._id } }
      );
    }

    res.status(200).json({ message: "Upvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/questiondownvote/:questionId/:action", async (req, res) => {
  const questionId = req.params.questionId;
  const voterId = req.body.voterId;
  const action = req.params.action;
  let rep_amt = -10,
    upvote_amt = 1;
  if (action === "remove") {
    rep_amt *= -1;
    upvote_amt *= -1;
  }

  try {
    const question = await Question.findById(questionId).populate("asked_by");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const user = question.asked_by;

    user.reputation += rep_amt;
    await user.save();

    const voter = await User.findById(voterId); // Use findById to find a user by ID

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    console.log(voter);

    question.upvotes += upvote_amt;

    // Use $push to add the voter ID to the upvoters array
    if (action == "remove") {
      await Question.updateOne(
        { _id: questionId },
        { $pull: { downvoters: voter._id } }
      );
    } else {
      await Question.updateOne(
        { _id: questionId },
        { $addToSet: { downvoters: voter._id } }
      );
    }

    res.status(200).json({ message: "Downvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/answerupvote/:answerId/:action", async (req, res) => {
  const answerId = req.params.answerId;
  const action = req.params.action;
  let rep_amt = 5,
    upvote_amt = 1;
  if (action === "remove") {
    rep_amt *= -1;
    upvote_amt *= -1;
  }

  try {
    const answer = await Answer.findById(answerId).populate("ans_by").exec();

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const user = answer.ans_by;

    user.reputation += rep_amt;
    await user.save();

    answer.upvotes += upvote_amt;
    answer.upvoted = !answer.upvoted;
    await answer.save();

    res.status(200).json({ message: "Upvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/answerdownvote/:answerId/:action", async (req, res) => {
  const answerId = req.params.answerId;
  const action = req.params.action;
  let rep_amt = -10,
    downvote_amt = 1;
  if (action === "remove") {
    rep_amt *= -1;
    downvote_amt *= -1;
  }

  try {
    const answer = await Answer.findById(answerId).populate("ans_by");

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const user = answer.ans_by;

    user.reputation += rep_amt;
    await user.save();

    answer.downvotes += downvote_amt;
    answer.downvoted = !answer.downvoted;
    await answer.save();

    res.status(200).json({ message: "Downvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/commentupvote/:commentId/:action", async (req, res) => {
  const commentId = req.params.commentId;
  const action = req.params.action;

  let upvote_amt = 1;
  if (action === "remove") {
    upvote_amt = -1;
  }

  try {
    const comment = await Comment.findById(commentId)
      .populate("comment_by")
      .exec();

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.upvotes += upvote_amt;
    comment.upvoted = !comment.upvoted;
    await comment.save();

    res.status(200).json({ message: "Upvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
