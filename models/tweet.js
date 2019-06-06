var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  likes: [{
    type: Schema.Types.ObjectId, ref: 'Like'
  }],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tweet', TweetSchema)
