var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');
var events = require('events');
var fh = require('fh-mbaas-api');

function fuseRoute() {
  var fuse = new express.Router();
  fuse.use(cors());
  fuse.use(bodyParser());
 
  fuse.post('/', function(req, res) {
    console.log(new Date(), 'In fuse route POST / req.body=', req.body);
    var world = req.body && req.body.fuse ? req.body.fuse : 'Fuse';
    return submitToFuse(req.body, function(error, response, body){
      return res.json(body);  
    });
  });
 
  return bpm;
}

var submissionEventListener = new events.EventEmitter();

submissionEventListener.on('submissionComplete', function(submission){
  console.log('New submission received: ');
  console.log(submission);
  return submitToFusesubmission, function(error, response, body){
      console.log('Received response from Fuse in event handler: ' + response.statusCode);
      console.log(body);
  });
});

fh.forms.registerListener(submissionEventListener, function(err){});
 
module.exports = fuseRoute;