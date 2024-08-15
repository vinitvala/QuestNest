const mongoose = require('mongoose');
const Tag = require('../../models/tag');

exports.get_all_tags = function(res) {
    Tag.find()
        .populate('created_by')
        .exec()
        .then(list_tags => {
            res.send(list_tags);
        })
        .catch(
            err => res.send('Tags not found')
        );
};

exports.get_tags_by_user = async function(res, userId) {
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    await Tag.find({created_by: userIdObjectId})
        .exec()
        .then(list_tags => {
            res.send(list_tags);
        })
        .catch(
            err => res.send(`Tags not found for user.`)
        );
};