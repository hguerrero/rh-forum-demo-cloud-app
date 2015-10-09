var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');
var events = require('events');
var fh = require('fh-mbaas-api');

var fuseRoute = function() {
  var fuse = new express.Router();
  fuse.use(cors());
  fuse.use(bodyParser());
 
  fuse.post('/', function(req, res) {
    console.log(new Date(), 'In fuse route POST / req.body=', req.body);
    return submitToFuse(req.body, function(error, response, body){
      return res.json(body);  
    });
  });
 
  return fuse;
};

var submitToFuse = function(submission, cb){
  var url = process.env.FUSE_URL;
  request.post(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML
    }
    cb(error, response, body);
  });
};

var submissionEventListener = new events.EventEmitter();

submissionEventListener.on('submissionComplete', function(submission){
  console.log('New submission received: ');
  console.log(submission);
  return submitToFuseSubmission, function(error, response, body){
      console.log('Received response from Fuse in event handler: ' + response.statusCode);
      console.log(body);
  });
});

fh.forms.registerListener(submissionEventListener, function(err){});
 
module.exports = fuseRoute;