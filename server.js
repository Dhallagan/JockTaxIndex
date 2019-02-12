var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var Handlebars = require("handlebars");
var NumeralHelper = require("handlebars.numeral");
var helpers = require('handlebars-helpers')();

// Load environment variables from .env file
dotenv.load();
console.log(process.env.MONGODB);
// Controllers
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var jockTaxController = require('./controllers/jocktax');
var jockTaxMultController = require('./controllers/jocktax-mult');
var pdfController = require('./controllers/pdf');
var mobileController = require('./controllers/mobile');

// Passport OAuth strategies
require('./config/passport');

var app = express();

app.use("/public",express.static(path.join(__dirname, 'public')));


mongoose.connect(process.env.MONGODB, {useMongoClient: true});
mongoose.connection.on('error', function(err) {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.'+ err);
  process.exit(1);
});

var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
});

NumeralHelper.registerHelpers(Handlebars);

// greater than
Handlebars.registerHelper('gt', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a > b) ? next.fn(this) : next.inverse(this);
});

// greater than
Handlebars.registerHelper('ifeq', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper("difference", function(lvalue, operator, cvalue, operator2, rvalue, options) {
    lvalue = parseFloat(lvalue);
    cvalue = parseFloat(cvalue);
    rvalue = parseFloat(rvalue);

    value = (lvalue - cvalue + rvalue);
    value = formatNumber(value);
  return value;
});

Handlebars.registerHelper("premium", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    value = (lvalue - rvalue);
    value = formatNumber(value);
  return value;
});

Handlebars.registerHelper("fnumber", function(value, options) {
    value = parseFloat(value);

    value = formatNumber(value);
  return value;
});

Handlebars.registerHelper("pct", function(value, options) {
  value = formatNumberPct(parseFloat(value) * 100);

  return value;
});
Handlebars.registerHelper("gpct", function(value, options) {
  value = formatNumberPct(99 - parseFloat(value) * 100);

  return value;
});

Handlebars.registerHelper('fCurrency', function(value) {
  		value = Math.round(value);
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
});


function formatNumber(num) {
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "") ;
}
Handlebars.registerHelper("counter", function (index){
    return index + 1;
});

function formatNumberDec(num) {
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "")+ "." + p[1] ;
}

function formatNumberPct(num) {
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "")+ "." + p[1] + "%";
}

Handlebars.registerHelper("contains", function(array, value, options ){
	// fallback...
	array = ( array instanceof Array ) ? array : [array];
	return (array.indexOf(value) > -1) ? options.fn( this ) : "";
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 80);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',  userController.ensureAuthenticated, jockTaxController.index);
app.get('/mobile', mobileController.mobile);

app.get('/contact', contactController.contactGet);
app.post('/contact', contactController.contactPost);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.get('/nba', userController.ensureAuthenticated, jockTaxController.nbaGet);
app.post('/nba', userController.ensureAuthenticated, jockTaxController.nbaPost);
app.get('/nbaMult', userController.ensureAuthenticated, jockTaxMultController.nbaMultGet);
app.post('/nbaMult', userController.ensureAuthenticated, jockTaxMultController.nbaMultPost);
app.get('/nhlMult', userController.ensureAuthenticated, jockTaxMultController.nhlGet);
app.post('/nhlMult', userController.ensureAuthenticated, jockTaxMultController.nhlPost);
app.get('/nhl', userController.ensureAuthenticated, jockTaxController.nhlGet);
app.post('/nhl', userController.ensureAuthenticated, jockTaxController.nhlPost);
app.get('/mlb', userController.ensureAuthenticated, jockTaxController.mlbGet);
app.post('/mlb', userController.ensureAuthenticated, jockTaxController.mlbPost);
app.post('/print', userController.ensureAuthenticated, jockTaxController.jockTaxPrintPost);
app.post('/print2', userController.ensureAuthenticated, jockTaxMultController.jockTaxPrintPost);

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
