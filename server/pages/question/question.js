const mongoose = require('mongoose');
let Question = require('../../models/question.js')

exports.get_all_questions = async () => {
    let questions = await Question.find({})
    return questions
}



//awaiting other functions?



exports.get_questions_by_user = async function(res, userId) {
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    await Question.find({ asked_by: userIdObjectId })
        .populate({
            path: 'answers',
            populate: {
                path: 'ans_by',
            }
        })
        .populate({
            path: 'tags',
            populate: {
                path: 'created_by',
            }
        })
        .populate('asked_by')
        .exec()
        .then(list_questions => {
            res.send(list_questions);
        })
        .catch(
            err => res.send('Questions not found.')
        );
}

exports.get_questions_answered_by_user = async function(res, userId) {
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    try {
        const all_questions = await Question.find()
            .populate({
                path: 'answers',
                populate: {
                    path: 'ans_by',
                }
            })
            .populate({
                path: 'tags',
                populate: {
                    path: 'created_by',
                }
            })
            .populate('asked_by')
            .exec();

        const list_questions = all_questions.filter(q =>
            q.answers.some(a => {
                return a.ans_by._id.toString() === userIdObjectId.toString();
            })
        );
        res.send(list_questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).send('Internal Server Error');
    }
};