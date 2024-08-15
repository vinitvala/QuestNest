var mongoose = require('mongoose');

var mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var AnswerSchema = new Schema(
    {
        text: {type: String, required: true, minLength: 1},
        ans_by: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        ans_date_time: {type: Date, required: false, default: new Date()},
        upvotes: {type: Number, required: false, default: 0},
        downvotes: {type: Number, required: false, default: 0},
        upvoted: {type: Boolean, required: false, default: false},
        downvoted: {type: Boolean, required: false, default: false},
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true}],
    }
);

AnswerSchema
.virtual('url')
.get(function() {
    return '/posts/answer/' + this._id;
});

module.exports = mongoose.model('Answer', AnswerSchema);