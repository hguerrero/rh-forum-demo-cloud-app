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
  var data = transform(submission);
  var url = '';
  if (submission.formId == '5616b01a62af16be309b500a' )
    url = process.env.FUSE_REGISTER_URL || 'http://85.190.180.161:8182/cxf/redhat/forum/register';
  else if(submission.formId == '5616b26ca32871323c63964d' ){
    url = process.env.FUSE_CHECKIN_URL || 'http://85.190.180.161:8182/cxf/redhat/forum/checkin';
  }
  else {
    cb(new Error("not valid"));
  }
  var options = { "url" : url, "body": data, "json": true};
  request.post(options, function (error, response, body) {
    if (error) {
      console.log(error) // Show the error
    }
    cb(error, response, body);
  });
};

var mapping = {
  "FFIRSTNAME" : "name",
  "FLASTNAME" : "lastName",
  "FEMAIL" : "email",
  "FPICTURE" : "picture",
  "FCOMPANY" : "companyName",
  "FTITLE" : "jobTitle",
  "FWEB" : "web",
  "FCODE" : "standCode",
  "FCOMMENTS" : "comments"
};

var transform = function(submission) {
  var map = {};
  _.each(submission.submission.formFields, function(item){
    //console.log(JSON.stringify(item));
    map[mapping[item.fieldId.fieldCode]] = item.fieldValues[0];
  });
  console.log(JSON.stringify(map));
  return map;
}

var submissionEventListener = new events.EventEmitter();

submissionEventListener.on('submissionComplete', function(submission){
  console.log('New submission received: ');
  //console.log(submission);
  return submitToFuse(submission, function(error, response, body){
      console.log('Received response from Fuse in event handler: ' + response.statusCode);
      console.log(body);
  });
});

fh.forms.registerListener(submissionEventListener, function(err){});
 
module.exports = fuseRoute;