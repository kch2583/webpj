var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var contestschema = new Schema({
  title: {type: String, required:true, trim: true,index:true ,unique: true},
  company: {type: String, required: true, trim: true},
  // field: {type: String, required:true,trim: true},
  // target: {type: String, required:true, trim:true},
  author : { type: Schema.Types.ObjectId, ref: 'User' },
  field : [String],
  target: [String],
  manager: {type:String, required:true,trim:true},
  phone: {type: Number, required:true },
  details : {type: String, required:true},
  img : {type: String},
  startdate:{type:Date, required:true, default: Date.now},
  enddate:{type:Date, required:true},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Contest = mongoose.model('contest', contestschema);

module.exports = Contest;