// Comment Document Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
  text: { type: String, required: true},
  comment_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment_date_time: { type: Date, default: new Date() },
  upvotes: {type: Number, required: false, default: 0},
  upvoted: {type: Boolean, required: false, default: false},
});
CommentSchema.virtual('url').get(function(){
  return 'posts/comment/' + this._id
})
module.exports = mongoose.model("Comment", CommentSchema);
