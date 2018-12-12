const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  contest: { type: Schema.Types.ObjectId, ref: 'contest' },
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var HateLog = mongoose.model('HateLog', schema);

module.exports = HateLog;

