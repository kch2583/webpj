var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-paginate');

var userschema = new Schema({
  name: {type: String, required:true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String},
  auth: {type:String},
  favorites: [String],
  facebook: {id: String, token:String, photo: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true},
  // useEachPush : true
});

userschema.methods.generateHash = function(password) {
  return bcrypt.hash(password, 10); // return Promise
};

userschema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password); // return Promise
};
userschema.plugin(mongoosePaginate);
//user's' 로 저장됨?
var User = mongoose.model('user', userschema);

module.exports = User;