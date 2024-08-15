let Question = require("../../models/question");
let Tag = require("../../models/tag");
let mongoose = require("mongoose")

exports.deleteTag = async (res, tagId, userId) => {
  try {
    console.log(userId)
    //find the questions associated with this tag
    let data = await Question.find({ tags : tagId})
    if(data.length == 0){
        res.status(400).send("Tag does not exist");
        return
    }
    data = await Question.find({ tags : tagId, asked_by: { $ne: new mongoose.mongo.ObjectId(userId) } });
    if(data.length == 0){
        console.log("deleting...")
        const updatedQuestion = await Question.findOneAndUpdate(
            { tags: tagId, asked_by: userId }, // Condition to find the document containing the answerId
            { $pull: { tags: tagId } }, // Remove the answerId from the answers array
        );

        console.log("Question updated: ", updatedQuestion)

        const value = await Tag.deleteOne({ _id: tagId });
        res.status(201).send("Deleted tags: " + tagId);
        return
    }
    else{
        res.status(200).send("Tag is associated with multiple users");
        return
    }
  } catch (error) {
    console.error("Error adding answer: ", error);
    res.status(500).send("Internal Server Error");
  }
};
