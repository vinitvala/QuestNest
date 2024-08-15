var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  username: { type: String, required: true},
  email: { type: String, required: true},
  passwordHash: {type: String, required: true},
  reputation: {type: Number, required: false, default: 50},
  account_type: { type: String },
  date_created: { type: Date, default: Date.now() },
  questions: [{type: Schema.Types.ObjectId, ref: 'Question'}], 
  answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
  // comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}]
});

module.exports = mongoose.model("User", UserSchema);