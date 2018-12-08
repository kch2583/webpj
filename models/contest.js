var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

var contestschema = new Schema({
  title: {type: String, required:true, trim: true,index:true ,unique: true},
  company: {type: String, trim: true},
  // field: {type: String, required:true,trim: true},
  // target: {type: String, required:true, trim:true},
  author : { type: Schema.Types.ObjectId, ref: 'user' },
  field : [String],
  target: [String],
  manager: {type:String, required:true,trim:true},
  phone: {type: Number, required:true },
  details : {type: String, required:true},
  img : {type: String},
  numLikes: {type: Number, default: 0},
  numAnswers: {type: Number, default: 0},
  numReads: {type: Number, default: 0},
  address : {type:String},
  startdate:{type:Date, required:true, default: Date.now},
  enddate:{type:Date, required:true},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
contestschema.plugin(mongoosePaginate);

var Contest = mongoose.model('contest', contestschema);

module.exports = Contest;