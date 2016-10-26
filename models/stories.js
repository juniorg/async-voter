// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var StorySchema   = new mongoose.Schema({
  name: String,
  size: String,
  url: String
});

// Export the Mongoose model
module.exports = mongoose.model('Stories', StorySchema);
