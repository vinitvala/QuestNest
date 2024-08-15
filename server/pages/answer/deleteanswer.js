let Answer = require("../../models/answer");
let Comment = require("../../models/comment");
let Question = require("../../models/question");

exports.deleteAnswer = async (res, ansId) => {
  try {
    const data = await Answer.find({ _id: ansId });
    const answer = data[0];

    console.log(ansId)

    for (const commentId of answer.comments) {
      await Comment.deleteOne({ _id: commentId });
      console.log("deleted comment: ", commentId);
    }

    const updatedQuestion = await Question.findOneAndUpdate(
      { answers: ansId }, // Condition to find the document containing the answerId
      { $pull: { answers: ansId } }, // Remove the answerId from the answers array
      { new: true } // To return the updated document
    );

    console.log("Question updated: ", updatedQuestion)

    await Answer.deleteOne({ _id: ansId });

    res.status(201).send("Deleted answer: " + ansId);
  } catch (error) {
    console.error("Error adding answer: ", error);
    res.status(500).send("Internal Server Error");
  }
};
