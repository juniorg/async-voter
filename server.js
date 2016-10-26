// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Stories = require('./models/stories');

// Connect to the async-voter MongoDB
mongoose.connect('mongodb://localhost:3000/async-voter');

// Create our Express application
var app = express();

// Use the body-parser package in our Express application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use environment defined port or 8000
var port = process.env.PORT || 8000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:8000/api
router.get('/', function(req, res) {
  res.json({ message: 'You have reached the server!' });
});

// Create a new route with the prefix /stories
var storiesRoute = router.route('/stories');

// Create endpoint /api/stories for POST
storiesRoute.post(function(req, res) {
  // Create a new instance of the Stories model
  var story = new Stories();

  // Set the story properties that came from the POST data
  story.name = req.body.name;
  story.size = req.body.size;
  story.url = req.body.url;

  // Save the story and check for errors
  story.save(function(err) {
    if (err)
      res.send("Something went wrong: " + err);

    res.json({ message: 'Story added!', data: story });
  });
});

// Create endpoint /api/stories for GET
storiesRoute.get(function(req, res) {
  // Use the Story model to find all stories
  Stories.find(function(err, stories) {
    if (err)
      res.send("Something went wrong: " + err);

    res.json({ message: 'Stories found!', data: stories });
  });
});

// Create a new route with the /stories/:story_id prefix
var storiesRoute = router.route('/stories/:story_id');

// Create endpoint /api/stories/:story_id for GET
storiesRoute.get(function(req, res) {
  // Use the Stories model to find a specific story
  Stories.findById(req.params.story_id, function(err, story) {
    if (err)
      res.send("Something went wrong: " + err);

    res.json({ message: 'Story found!', data: story });
  });
});

// Create endpoint /api/stories/:story_id for PUT
storiesRoute.put(function(req, res) {
  // Use the Stories model to find a specific story
  Stories.findById(req.params.story_id, function(err, story) {
    if (err)
      res.send("Something went wrong: " + err);

    // Update the existing story size
    story.size = req.body.size;

    // Save the story and check for errors
    story.save(function(err) {
      if (err)
        res.send("Something went wrong: " + err);

      res.json({ message: 'Story updated!', data: story });
    });
  });
});

// Create endpoint /api/stories/:story_id for DELETE
storiesRoute.delete(function(req, res) {
  // Use the Stories model to find a specific story and remove it
  Stories.findByIdAndRemove(req.params.story_id, function(err) {
    if (err)
      res.send("Something went wrong: " + err);

    res.json({ message: 'Story has been removed!' });
  });
});



// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Listening on port ' + port);
