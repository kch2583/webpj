const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  contest: { type: Schema.Types.ObjectId, ref: 'contest' },
  comments: {type: String, trim: true, required: true},
  numLikes: {type: Number, default: 0},
  numHates: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Comments = mongoose.model('Comments', schema);

module.exports = Comments;
