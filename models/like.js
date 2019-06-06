var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LikeSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Like', TweetSchema)
