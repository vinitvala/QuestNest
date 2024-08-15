let Comment = require("../../models/comment.js");
let Question = require("../../models/question");
let Answer = require("../../models/answer.js");
const mongoose = require("mongoose");

exports.newComment = async (res, id, question, commentText, commentBy) => {
  console.log("commentBy:", commentBy); // Check the value
  console.log("qid", id);
  try {
    const newComment = new Comment({
      text: commentText,
      comment_by: commentBy,
    });
    await newComment.save();

    if (question == true) {
      const fQuestion = await Question.findByIdAndUpdate(id);
      fQuestion.comments.push(newComment);
      await fQuestion.save();
    } else {
      const fAnswer = await Answer.findByIdAndUpdate(id);
      fAnswer.comments.push(newComment);
      await fAnswer.save();
    }

    res.status(201).send("Created new comment: " + newComment);
  } catch (error) {
    console.error("Error creating question: ", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.get_comments_by_user = async function (res, userId) {
  const userIdObjectId = new mongoose.Types.ObjectId(userId);
  await Comment.find({ comment_by: userIdObjectId })
    .exec()
    .then((list_comments) => {
      res.send(list_comments);
    })
    .catch((err) => res.send("Comments not found."));
};
