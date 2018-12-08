var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var favoriteschema = new Schema({
  email: { type: Schema.Types.ObjectId, ref: 'User' },
  //question: { type: Schema.Types.ObjectId, ref: 'Question' },
  favorites : {tyep:String}
});

var Favorite = mongoose.model('favorite', favoriteschema);

module.exports = Favorite;