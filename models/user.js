var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userschema = new Schema({
  name: {type: String, required:true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

// schema.virtual("password_confirmation")
// .get(function(){ return this._password_confirmation; })
// .set(function(value){ this._password_confirmation=value; });

// schema.virtual("original_password")
// .get(function(){ return this._original_password; })
// .set(function(value){ this._original_password=value; });

// schema.virtual("current_password")
// .get(function(){ return this._current_password; })
// .set(function(value){ this._current_password=value; });

// schema.virtual("new_password")
// .get(function(){ return this._new_password; })
// .set(function(value){ this._new_password=value; });

// // password validation 
// schema.path("password").validate(function(v) {
//  var user = this;

//  // create user 
//   if(user.isNew){ 
//     if(!user.password_confirmation){
//       user.invalidate("passwordConfirmation", "Password Confirmation is required!");
//   }
//   if(user.password !== user.passwordConfirmation) {
//     user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
//   }
//  }

//  // update user 
//   if(!user.isNew){
//     if(!user.currentPassword){
//       user.invalidate("current_password", "Current Password is required!");
//   }
//   if(user.current_password && user.current_password != user.original_password){
//     user.invalidate("currentPassword", "Current Password is invalid!");
//   }
//   if(user.new_password !== user.password_confirmation) {
//     user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
//   }
//  }
// });

var User = mongoose.model('user', userschema);

module.exports = User;
