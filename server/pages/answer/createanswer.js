// createAnswer.js
let Question = require('../../models/question');
let Answer = require('../../models/answer');

exports.newAnswer = async (res, questionId, answerText, answeredBy) => {
    try {
        // Create new answer document
        const newAnswer = new Answer({
            text: answerText,
            ans_by: answeredBy,
            ans_date_time: new Date(),
        });

        // Save the answer
        await newAnswer.save();

        // Update the question's answer list
        await Question.findByIdAndUpdate(
            questionId,
            { $push: { answers: newAnswer._id } }
        );

        res.status(201).send('Created new answer: ' + newAnswer);
    } catch (error) {
        console.error('Error adding answer: ', error);
        res.status(500).send('Internal Server Error');
    }
};
