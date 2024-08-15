let Answer = require("../../models/answer");
let Comment = require("../../models/comment");
let Question = require("../../models/question");
let Tag = require("../../models/tag");
let mongoose = require("mongoose")

exports.deleteQuestion = async (res, qid) => {
  try {
    const data = await Question.find({ _id: qid });
    console.log(qid);
    const question = data[0];
    console.log(question);

    for (const commentId of question.comments) {
      await Comment.deleteOne({ _id: commentId });
      console.log("deleted comment: ", commentId);
    }

    //delete all ans
    const answers = question.answers;
    for (const aid of answers) {
      const data = await Answer.find({ _id: aid });
      const answer = data[0];

      for (const commentId of answer.comments) {
        await Comment.deleteOne({ _id: commentId });
        console.log("deleted comment: ", commentId);
      }

      const updatedQuestion = await Question.findOneAndUpdate(
        { answers: aid }, // Condition to find the document containing the answerId
        { $pull: { answers: aid } }, // Remove the answerId from the answers array
        { new: true } // To return the updated document
      );

      console.log("Question updated: ", updatedQuestion);

      await Answer.deleteOne({ _id: aid });
    }

    //delete all tags
    const tags = question.tags;
    for (const tagId of tags) {
      let data = await Question.find({ tags: tagId });
      if (data.length == 0) {
        res.status(400).send("Tag does not exist");
        return;
      }
      data = await Question.find({
        tags: tagId,
        asked_by: { $ne: new mongoose.mongo.ObjectId(question.asked_by) },
      });
      console.log(data);
      if (data.length == 0) {
        console.log("deleting...");
        const updatedQuestion = await Question.findOneAndUpdate(
          { tags: tagId }, // Condition to find the document containing the answerId
          { $pull: { tags: tagId } }, // Remove the answerId from the answers array
          { new: true } // To return the updated document
        );

        console.log("Question updated: ", updatedQuestion);

        await Tag.deleteOne({ _id: tagId });
      }
    }

    const out = await Question.deleteOne({ _id: qid });
    console.log(out);

    res.status(201).send("Deleted question: " + qid);
  } catch (error) {
    console.error("Error adding answer: ", error);
    res.status(500).send("Internal Server Error");
  }
};
