const Question = require('../../models/question'); // Assuming you have a Question model

exports.getSortedAnswersForQuestion = async (questionId) => {
  try {
    // Find the question document by ID and populate its answers field
    const question = await Question.findById(questionId).populate('answers');

    if (!question) {
      throw new Error('Question not found');
    }

    // Sort the answers by ans_date_time in descending order
    const sortedAnswers = question.answers.sort((a, b) => b.ans_date_time - a.ans_date_time);

    return sortedAnswers;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}