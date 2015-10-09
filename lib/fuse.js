var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');
var events = require('events');
var fh = require('fh-mbaas-api');
var _ = require('underscore');

var fuseRoute = function() {
  var fuse = new express.Router();
  fuse.use(cors());
  fuse.use(bodyParser());
 
  fuse.post('/', function(req, res) {
    console.log(new Date(), 'In fuse route POST / req.body=', req.body);
    return submitToFuse(req.body, function(error, response, body){
      return res.send(body);  
    });
  });
 
  return fuse;
};

var submitToFuse = function(submission, cb){
  var data = process(submission);
  var url = process.env.FUSE_URL;
  var options = { "url" : url, "body": submission, "json": true};
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML
    }
    cb(error, response, body);
  });
};

var process = function(submission) {
  var data = _.map(submission.submission.formFields, function(item){
    return { item.fieldId.fieldCode : item.fieldValues[0] };
  });
  return data;
}

var submissionEventListener = new events.EventEmitter();

submissionEventListener.on('submissionComplete', function(submission){
  console.log('New submission received: ');
  console.log(submission);
  return submitToFuse(submission, function(error, response, body){
      console.log('Received response from Fuse in event handler: ' + response.statusCode);
      console.log(body);
  });
});

fh.forms.registerListener(submissionEventListener, function(err){});
 
module.exports = fuseRoute;