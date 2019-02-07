var fs = require('fs');
var pdf = require('html-pdf');
var Handlebars = require("handlebars")
var path = require("path");

//POST APPLICATION
exports.printGet = function(req, res){

  var p = path.join( __dirname, '..', 'public/templates/' );
  console.log(p)

  var html = fs.readFileSync(p +'app-template.html','utf8');

  var template = Handlebars.compile(html);

  var data = {team1: "dylan"}

  var templateResult = template(data);

  html = templateResult;

  var options = { format: 'Letter',
  "phantomPath": "./node_modules/phantomjs/bin/phantomjs", // PhantomJS binary which should get downloaded automatically
   "phantomArgs": [], // array of strings used as phantomjs args e.g. ["--ignore-ssl-errors=yes"]
   // "script": '/url',           // Absolute path to a custom phantomjs script, use the file in lib/scripts as example
   // File options
    "base": 'file://' + p,
   "timeout": 30000,           // Timeout that will cancel phantomjs, in milliseconds
  };

  console.log("Generating PDF ...")

  var date = (new Date()).getTime();
  var pdfname = date +'-test_.pdf';
  pdf.create(html, options).toFile( pdfname, function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });


res.send('{Generate PDF}');
};
