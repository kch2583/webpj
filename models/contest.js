var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

var contestschema = new Schema({
  title: {type: String, required:true, trim: true},
  company: {type: String, trim: true},
  author : { type: Schema.Types.ObjectId, ref: 'user' },
  field : [String],
  target: [String],
  reader : [String],
  email: {type: String},
  manager: {type:String, required:true,trim:true},
  phone: {type: String, required:true },
  details : {type: String, required:true},
  img : {type: String},
  numLikes: {type: Number, default: 0},
  numHates: {type: Number, default: 0},
  numcomments: {type: Number, default: 0},
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