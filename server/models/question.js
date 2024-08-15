var mongoose = require('mongoose');

var mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 100, minLength: 1 },
        text: { type: String, required: true, minLength: 1 },
        summary: { type: String, minLength: 1, maxLength: 140 },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: false }],
        answers: [{ type: Schema.Types.ObjectId, ref: 'Answer', required: true }],
        asked_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        ask_date_time: { type: Date, default: new Date() },
        views: { type: Number, default: 0 },
        upvotes: {type: Number, required: false, default: 0},
        downvotes: {type: Number, required: false, default: 0},
        upvoters: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
        downvoters: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true}],
    }
);

QuestionSchema
.virtual('url')
.get(function() {
    return '/posts/question/' + this._id;
});

module.exports = mongoose.model('Question', QuestionSchema);
