var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var path = require("path");
var fs = require('fs');
var pdf = require('html-pdf');
var Handlebars = require("handlebars")
var NumeralHelper = require("handlebars.numeral");
var helpers = require('handlebars-helpers')();

const jocktax = require('../lib/tax.js');
/**
 * GET /mobile
 */
exports.mobileGet = function(req, res) {


  res.render('mobile', {
    title: 'Jock Tax Index | Mobile'
  });
};


/**
 * GET /nba
 */
exports.index = function(req, res) {

  if (req.user.products.includes("NBA")) {
    res.render('nbaget', {
      title: 'Jock Tax Index | NBA'
    });
  } else if (req.user.products.includes("NHL")) {
    res.render('nhlget', {
      title: 'Jock Tax Index | NHL'
    });
  } else if(req.user.products.includes("MLB")) {
      res.render('mlbget', {
        title: 'Jock Tax Index | MLB'
      });
  }
}

/**
 * GET /nba
 */
exports.nbaGet = function(req, res) {


  res.render('nbaget', {
    title: 'Jock Tax Index | NBA'
  });
};

/**
 * Post to /nba
 */
exports.nbaPost = function(req, res) {
  var teams = []
  var table =[]
  var t1 = []
  var t2 = []

  var t1 = jocktax.calcTax(req.body.team1,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)
  var t2 = jocktax.calcTax(req.body.team2,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)

  var betterDeal = ""
  var worseTeam = ""
  var matchedContract = 0
  var premium = 0
  if (t1.netIncome > t2.netIncome){
    betterTeam = t1.team
    worseTeam = t2.team
    matchedContract = t1.netIncome/(1-t2.taxRate)

    premium = req.body.contract - matchedContract
    premiumWord = "premium"
  } else {
    betterTeam = t2.team
    worseTeam = t1.team

    matchedContract = t1.netIncome/(1-t2.taxRate)
    console.log(matchedContract)
    premium = matchedContract - req.body.contract
    premiumWord = "discount"
  }
  var comparison = {contract: req.body.contract, betterTeam: betterTeam, worseTeam: worseTeam, matchedContract: matchedContract, premium: premium, premiumWord: premiumWord}

  teams.push(t1)
  teams.push(t2)
  var params = { team1: req.body.team1, team2: req.body.team2, income: req.body.contract, years: req.body.years,
                taxlaw: req.body.taxlaw, discountrate: req.body.discountrate, escrow: req.body.escrow}

  for(var v = 0; v < params.years; v++){
    year = new Date().getFullYear() + v;
    year2 = new Date().getFullYear() + v + 1
    var season = year + "-" + year2

    var grossseasonid = 'grossseason-' + v;
    var netseasonid = 'netseason-' + v;
    var grosspvseason = 'grosspvseason-' + v;
    var netpvseason = 'netpvseason-' + v;


    var trow = {season: season,grossseasonid: grossseasonid, netseasonid: netseasonid, grosspvseasonid: grosspvseason, netpvseasonid: netpvseason, discountrate: req.body.discountrate}
    table.push(trow)
  }

  res.render('NBA',{
    title: 'Jock Tax Index | NHL',
    comparison: comparison,
    team1: t1,
    team2: t2,
    params: params,
    table: table
  });
};

/**
 * GET /nhl
 */
exports.nhlGet = function(req, res) {


  res.render('nhlget', {
    title: 'Jock Tax Index | NHL'
  });
};

/**
 * Post to /nhl
 */
exports.nhlPost = function(req, res) {
  var teams = []
  var table =[]
  var t1 = []
  var t2 = []

  var t1 = jocktax.calcTax(req.body.team1,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)
  var t2 = jocktax.calcTax(req.body.team2,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)

  var betterDeal = ""
  var worseTeam = ""
  var matchedContract = 0
  var premium = 0
  if (t1.netIncome > t2.netIncome){
    betterTeam = t1.team
    worseTeam = t2.team
    matchedContract = t1.netIncome/(1-t2.taxRate)

    premium = req.body.contract - matchedContract
    premiumWord = "premium"
  } else {
    betterTeam = t2.team
    worseTeam = t1.team

    matchedContract = t1.netIncome/(1-t2.taxRate)
    console.log(matchedContract)
    premium = matchedContract - req.body.contract
    premiumWord = "discount"
  }
  var comparison = {contract: req.body.contract, betterTeam: betterTeam, worseTeam: worseTeam, matchedContract: matchedContract, premium: premium, premiumWord: premiumWord}

  teams.push(t1)
  teams.push(t2)
  var params = { team1: req.body.team1, team2: req.body.team2, income: req.body.contract, years: req.body.years,
                taxlaw: req.body.taxlaw, discountrate: req.body.discountrate, escrow: req.body.escrow}

  for(var v = 0; v < params.years; v++){
    year = new Date().getFullYear() + v;
    year2 = new Date().getFullYear() + v + 1
    var season = year + "-" + year2

    var grossseasonid = 'grossseason-' + v;
    var netseasonid = 'netseason-' + v;
    var grosspvseason = 'grosspvseason-' + v;
    var netpvseason = 'netpvseason-' + v;


    var trow = {season: season,grossseasonid: grossseasonid, netseasonid: netseasonid, grosspvseasonid: grosspvseason, netpvseasonid: netpvseason, discountrate: req.body.discountrate}
    table.push(trow)
  }

  res.render('nhl',{
    title: 'Jock Tax Index | NHL',
    comparison: comparison,
    team1: t1,
    team2: t2,
    params: params,
    table: table
  });
};


 /**
  * GET /mlb
  */
 exports.mlbGet = function(req, res) {

   res.render('mlbget', {
     title: 'Jock Tax Index | MLB'
   });
 };

 /**
  * Post to /mlb
  */
 exports.mlbPost = function(req, res) {
   var teams = []
   var table =[]
   var t1 = []
   var t2 = []

   var t1 = jocktax.calcTax(req.body.team1,  req.body.contract, req.body.years, req.body.taxlaw)
   var t2 = jocktax.calcTax(req.body.team2,  req.body.contract, req.body.years, req.body.taxlaw)

   var t1 = jocktax.calcTax(req.body.team1,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)
   var t2 = jocktax.calcTax(req.body.team2,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)
   var betterDeal = ""
   var worseTeam = ""
   var matchedContract = 0
   var premium = 0
   if (t1.netIncome > t2.netIncome){
     betterTeam = t1.team
     worseTeam = t2.team
     matchedContract = t1.netIncome/(1-t2.taxRate)
     premium = req.body.contract - matchedContract
     premiumWord = "discount"
   } else{
     betterTeam = t2.team
     worseTeam = t1.team
     matchedContract = t2.netIncome/(1-t1.taxRate)
     premium =  matchedContract - req.body.contract
     premiumWord = "premium"
   }
   var comparison = {contract: req.body.contract, betterTeam: betterTeam, worseTeam: worseTeam, matchedContract: matchedContract, premium: premium}


   teams.push(t1)
   teams.push(t2)
   var params = { team1: req.body.team1, team2: req.body.team2, income: req.body.contract, years: req.body.years, taxlaw: req.body.taxlaw, discountrate: req.body.discountrate}

   for(var v = 0; v < params.years; v++){
     year = new Date().getFullYear() + v;
     year2 = new Date().getFullYear() + v + 1
     var season = year + "-" + year2

     var grossseasonid = 'grossseason-' + v;
     var netseasonid = 'netseason-' + v;
     var grosspvseason = 'grosspvseason-' + v;
     var netpvseason = 'netpvseason-' + v;


     var trow = {season: season,grossseasonid: grossseasonid, netseasonid: netseasonid, grosspvseasonid: grosspvseason, netpvseasonid: netpvseason, discountrate: req.body.discountrate}
     table.push(trow)
   }

   res.render('mlb',{
     title: 'Jock Tax Index | MLB',
     comparison: comparison,
     team1: t1,
     team2: t2,
     params: params,
     table: table
   });
 };
 /**
  * Post to /print /
  */
exports.jockTaxPrintPost = function(req, res) {
  var teams = []
  var table =[]
  var t1 = []
  var t2 = []


  var t1 = jocktax.calcTax(req.body.team1,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)
  var t2 = jocktax.calcTax(req.body.team2,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)

  var betterDeal = ""
  var worseTeam = ""
  var matchedContract = 0
  var premium = 0
  if (t1.netIncome > t2.netIncome){
    betterTeam = t1.team
    worseTeam = t2.team
    matchedContract = t1.netIncome/(1-t2.taxRate)
    premium = req.body.contract - matchedContract
  } else{
    betterTeam = t2.team
    worseTeam = t1.team
    matchedContract = t2.netIncome/(1-t1.taxRate)
    premium = req.body.contract - matchedContract
  }

  var comparison = {contract: req.body.contract, betterTeam: betterTeam, worseTeam: worseTeam, matchedContract: matchedContract, premium: premium}

  teams.push(t1)
  teams.push(t2)
  var params = { team1: req.body.team1, team2: req.body.team2, income: req.body.contract, years: req.body.years,
                taxlaw: req.body.taxlaw, discountrate: req.body.discountrate, escrow: req.body.escrow}

  for(var v = 1; v <= params.years; v++){
    year = new Date().getFullYear() + v;
    year2 = new Date().getFullYear() + v + 1
    var season = year + "-" + year2

    var grossseasonid = 'grossseason-' + v;
    var netseasonid = 'netseason-' + v;
    var grosspvseason = 'grosspvseason-' + v;
    var netpvseason = 'netpvseason-' + v;


    var trow = {season: season,grossseasonid: grossseasonid, netseasonid: netseasonid, grosspvseasonid: grosspvseason, netpvseasonid: netpvseason, discountrate: req.body.discountrate}
    table.push(trow)
  }

  var p = path.join( __dirname, '..', 'public/templates/' );
  console.log(p)

  var html = fs.readFileSync(p +'app-template.html','utf8');

  var template = Handlebars.compile(html);

  var data = {
    comparison: comparison,
    team1: t1,
    team2: t2,
    params: params,
    table: table}

  var templateResult = template(data);

  html = templateResult;

  var options = { format: 'A4',
  "phantomPath": "./node_modules/phantomjs/bin/phantomjs", // PhantomJS binary which should get downloaded automatically
   "phantomArgs": [], // array of strings used as phantomjs args e.g. ["--ignore-ssl-errors=yes"]
   // "script": '/url',           // Absolute path to a custom phantomjs script, use the file in lib/scripts as example
   // File options
    "base": 'file://' + p,
   "timeout": 30000,           // Timeout that will cancel phantomjs, in milliseconds
  };

  console.log("Generating PDF ...")

  var date = (new Date()).getTime();
  var pdfname = req.body.team1 + '.' + req.body.team2 + '.' + req.body.contract + date +'.pdf';
  pdfname = 'public/'+pdfname
  pdf.create(html, options).toFile(pdfname, function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });




  res.send(pdfname)
};


const preTrump ={
   'Boston Celtics':{
      'League':'NBA',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.537312066,
      'Deductions':0.024363574,
      'Federal Tax':0.38489766,
      'Medicare Tax':0.02344,
      'State Tax':0.053427157,
      'City Tax':0.000678217,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Los Angeles Lakers':{
      'League':'NBA',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.489940398,
      'Deductions':0.102793488,
      'Federal Tax':0.353839414,
      'Medicare Tax':0.02344,
      'State Tax':0.132196299,
      'City Tax':0.000338988,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Utah Jazz':{
      'League':'NBA',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.537091591,
      'Deductions':0.024728599,
      'Federal Tax':0.38475311,
      'Medicare Tax':0.02344,
      'State Tax':0.054131411,
      'City Tax':0.000338988,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Miami Heat':{
      'League':'NBA',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.570062264,
      'Deductions':0.002542832,
      'Federal Tax':0.393538673,
      'Medicare Tax':0.02344,
      'State Tax':0.012035946,
      'City Tax':0.000678217,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Anaheim Ducks':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.510452312,
      'Deductions':0.09678703,
      'Federal Tax':0.34014026,
      'Medicare Tax':0.02278,
      'State Tax':0.12323916,
      'City Tax':0.0004495,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Boston Bruins':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.552694156,
      'Deductions':0.0268502,
      'Federal Tax':0.36783524,
      'Medicare Tax':0.02278,
      'State Tax':0.0530708,
      'City Tax':0.000681,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Buffalo Sabres':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.531371596,
      'Deductions':0.06227166,
      'Federal Tax':0.35380834,
      'Medicare Tax':0.02278,
      'State Tax':0.08854152,
      'City Tax':0.0006317,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Carolina Hurricanes':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.549919768,
      'Deductions':0.03144356,
      'Federal Tax':0.36601627,
      'Medicare Tax':0.02278,
      'State Tax':0.05738014,
      'City Tax':0.000965,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Chicago BlackHawks':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.55911032,
      'Deductions':0.01622741,
      'Federal Tax':0.37204187,
      'Medicare Tax':0.02278,
      'State Tax':0.04258102,
      'City Tax':0.000548,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Columbus BlueJackets':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.538437472,
      'Deductions':0.05045398,
      'Federal Tax':0.35848814,
      'Medicare Tax':0.02278,
      'State Tax':0.05174932,
      'City Tax':0.0256063,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Dallas Stars':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.588514692,
      'Deductions':0.00252,
      'Federal Tax':0.37747,
      'Medicare Tax':0.02278,
      'State Tax':0.00779777,
      'City Tax':0.0004987,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Colorado Avalanche':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.554851724,
      'Deductions':0.02327807,
      'Federal Tax':0.36924981,
      'Medicare Tax':0.02278,
      'State Tax':0.04968093,
      'City Tax':0.0004987,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Detroit Red Wings':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.542954648,
      'Deductions':0.04297521,
      'Federal Tax':0.36144974,
      'Medicare Tax':0.02278,
      'State Tax':0.0452685,
      'City Tax':0.0246083,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Los Angeles Kings':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.510600188,
      'Deductions':0.0965422,
      'Federal Tax':0.34023721,
      'Medicare Tax':0.02278,
      'State Tax':0.12299433,
      'City Tax':0.0004495,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Florida Panthers':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.588134248,
      'Deductions':0.00252,
      'Federal Tax':0.37747,
      'Medicare Tax':0.02278,
      'State Tax':0.00794753,
      'City Tax':0.0007294,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Minnesota Wild':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.526324604,
      'Deductions':0.0705084,
      'Federal Tax':0.35054659,
      'Medicare Tax':0.02278,
      'State Tax':0.0967397,
      'City Tax':0.0006703,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'New Jersey Devils':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.533802752,
      'Deductions':0.05812736,
      'Federal Tax':0.35544949,
      'Medicare Tax':0.02278,
      'State Tax':0.08412713,
      'City Tax':0.0009018,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'New York Islanders':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.508152352,
      'Deductions':0.10059491,
      'Federal Tax':0.33863234,
      'Medicare Tax':0.02278,
      'State Tax':0.08805643,
      'City Tax':0.0394401,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'New York Rangers':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.508228904,
      'Deductions':0.10046817,
      'Federal Tax':0.33868253,
      'Medicare Tax':0.02278,
      'State Tax':0.08780653,
      'City Tax':0.0395632,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Nashville Predators':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.585493968,
      'Deductions':0.00252,
      'Federal Tax':0.37747,
      'Medicare Tax':0.02278,
      'State Tax':0.01076923,
      'City Tax':0.000548,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Tampa Bay Lightning':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.587018332,
      'Deductions':0.00252,
      'Federal Tax':0.37747,
      'Medicare Tax':0.02278,
      'State Tax':0.00906345,
      'City Tax':0.0007294,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Philadelphia Flyers':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.538716128,
      'Deductions':0.04999264,
      'Federal Tax':0.35867084,
      'Medicare Tax':0.02278,
      'State Tax':0.03734191,
      'City Tax':0.0395523,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Pittsburgh Penguins':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.544967916,
      'Deductions':0.03964199,
      'Federal Tax':0.36276969,
      'Medicare Tax':0.02278,
      'State Tax':0.03584862,
      'City Tax':0.0306949,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Arizona Coyotes':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.55586306,
      'Deductions':0.02160368,
      'Federal Tax':0.36991287,
      'Medicare Tax':0.02278,
      'State Tax':0.0480558,
      'City Tax':0.0004495,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'San Jose Sharks':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.510452312,
      'Deductions':0.09678703,
      'Federal Tax':0.34014026,
      'Medicare Tax':0.02278,
      'State Tax':0.12323916,
      'City Tax':0.0004495,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'St. Louis Blues':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.540836556,
      'Deductions':0.04648199,
      'Federal Tax':0.36006106,
      'Medicare Tax':0.02278,
      'State Tax':0.06298338,
      'City Tax':0.0104002,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Washington Capitals':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.531338384,
      'Deductions':0.06220744,
      'Federal Tax':0.35383378,
      'Medicare Tax':0.02278,
      'State Tax':0.08831558,
      'City Tax':0.0007935,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Calgary Flames':{
      'League':'NHL',
      'Country':'CA',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.533065,
      'Deductions':0.00252,
      'Federal Tax':0.45573984,
      'Medicare Tax':0,
      'State Tax':0.0106961,
      'City Tax':0.0004991,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Edmonton Oilers':{
      'League':'NHL',
      'Country':'CA',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.533065,
      'Deductions':0.00252,
      'Federal Tax':0.45526565,
      'Medicare Tax':0,
      'State Tax':0.01117028,
      'City Tax':0.0004991,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Ottawa Senators':{
      'League':'NHL',
      'Country':'CA',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.478976856,
      'Deductions':0.00252,
      'Federal Tax':0.51083429,
      'Medicare Tax':0,
      'State Tax':0.00950804,
      'City Tax':0.0006808,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Toronto Maple Leafs':{
      'League':'NHL',
      'Country':'CA',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.478976856,
      'Deductions':0.00252,
      'Federal Tax':0.51109253,
      'Medicare Tax':0,
      'State Tax':0.08893854,
      'City Tax':0.0006321,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Vancouver Canucks':{
      'League':'NHL',
      'Country':'CA',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.534825608,
      'Deductions':0.00252,
      'Federal Tax':0.45534227,
      'Medicare Tax':0,
      'State Tax':0.00933305,
      'City Tax':0.0004991,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Winnipeg Jets':{
      'League':'NHL',
      'Country':'CA',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.506612452,
      'Deductions':0.00252,
      'Federal Tax':0.48391385,
      'Medicare Tax':0,
      'State Tax':0.00892537,
      'City Tax':0.0005483,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Las Vegas Golden Knights':{
      'League':'NHL',
      'Country':'US',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.584840208,
      'Deductions':0.00252,
      'Federal Tax':0.3775497,
      'Medicare Tax':0.02278,
      'State Tax':0.01122099,
      'City Tax':0.0006703,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   },
   'Montreal Canadiens':{
      'League':'NHL',
      'Country':'CA',
      'IncomeFrom':0,
      'To':1000000000000,
      'Net Income':0.476982148,
      'Deductions':0.00252,
      'Federal Tax':0.51193845,
      'Medicare Tax':0,
      'State Tax':0.01038822,
      'City Tax':0.0006912,
      'Credits':0,
      'Foreign Tax':0,
      'Foreign Tax Credit':0
   }
 }
// const preTrump =
// {
// 	"Boston Celtics": {
// 		"League": "NBA",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.537312066,
// 		"Deductions": 0.024363574,
// 		"Federal Tax": 0.38489766,
// 		"Medicare Tax": 0.02344,
// 		"State Tax": 0.053427157,
// 		"City Tax": 0.000678217,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Los Angeles Lakers": {
// 		"League": "NBA",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.489940398,
// 		"Deductions": 0.102793488,
// 		"Federal Tax": 0.353839414,
// 		"Medicare Tax": 0.02344,
// 		"State Tax": 0.132196299,
// 		"City Tax": 0.000338988,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Utah Jazz": {
// 		"League": "NBA",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.537091591,
// 		"Deductions": 0.024728599,
// 		"Federal Tax": 0.38475311,
// 		"Medicare Tax": 0.02344,
// 		"State Tax": 0.054131411,
// 		"City Tax": 0.000338988,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Miami Heat": {
// 		"League": "NBA",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.570062264,
// 		"Deductions": 0.002542832,
// 		"Federal Tax": 0.393538673,
// 		"Medicare Tax": 0.02344,
// 		"State Tax": 0.012035946,
// 		"City Tax": 0.000678217,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Anaheim Ducks": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.510452312,
// 		"Deductions": 0.09678703,
// 		"Federal Tax": 0.34014026,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.12323916,
// 		"City Tax": 0.0004495,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Boston Bruins": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.552694156,
// 		"Deductions": 0.0268502,
// 		"Federal Tax": 0.36783524,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.0530708,
// 		"City Tax": 0.000681,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Buffalo Sabres": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.531371596,
// 		"Deductions": 0.06227166,
// 		"Federal Tax": 0.35380834,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.08854152,
// 		"City Tax": 0.0006317,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Carolina Hurricanes": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.549919768,
// 		"Deductions": 0.03144356,
// 		"Federal Tax": 0.36601627,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.05738014,
// 		"City Tax": 0.000965,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Chicago Blackhawks": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.55911032,
// 		"Deductions": 0.01622741,
// 		"Federal Tax": 0.37204187,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.04258102,
// 		"City Tax": 0.000548,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Columbus Blue Jackets": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.538437472,
// 		"Deductions": 0.05045398,
// 		"Federal Tax": 0.35848814,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.05174932,
// 		"City Tax": 0.0256063,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Dallas Stars": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.588514692,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.37747,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.00779777,
// 		"City Tax": 0.0004987,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Colorado Avalanche": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.554851724,
// 		"Deductions": 0.02327807,
// 		"Federal Tax": 0.36924981,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.04968093,
// 		"City Tax": 0.0004987,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Detroit Red Wings": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.542954648,
// 		"Deductions": 0.04297521,
// 		"Federal Tax": 0.36144974,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.0452685,
// 		"City Tax": 0.0246083,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Los Angeles Kings": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.510600188,
// 		"Deductions": 0.0965422,
// 		"Federal Tax": 0.34023721,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.12299433,
// 		"City Tax": 0.0004495,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Florida Panthers": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.588134248,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.37747,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.00794753,
// 		"City Tax": 0.0007294,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Minnesota Wild": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.526324604,
// 		"Deductions": 0.0705084,
// 		"Federal Tax": 0.35054659,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.0967397,
// 		"City Tax": 0.0006703,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"New Jersey Devils": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.533802752,
// 		"Deductions": 0.05812736,
// 		"Federal Tax": 0.35544949,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.08412713,
// 		"City Tax": 0.0009018,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"New York Islanders": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.508152352,
// 		"Deductions": 0.10059491,
// 		"Federal Tax": 0.33863234,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.08805643,
// 		"City Tax": 0.0394401,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"New York Rangers": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.508228904,
// 		"Deductions": 0.10046817,
// 		"Federal Tax": 0.33868253,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.08780653,
// 		"City Tax": 0.0395632,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Nashville Predators": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.585493968,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.37747,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.01076923,
// 		"City Tax": 0.000548,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Tampa Bay Lightning": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.587018332,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.37747,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.00906345,
// 		"City Tax": 0.0007294,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Philadelphia Flyers": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.538716128,
// 		"Deductions": 0.04999264,
// 		"Federal Tax": 0.35867084,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.03734191,
// 		"City Tax": 0.0395523,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Pittsburgh Penguins": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.544967916,
// 		"Deductions": 0.03964199,
// 		"Federal Tax": 0.36276969,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.03584862,
// 		"City Tax": 0.0306949,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Arizona Coyotes": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.55586306,
// 		"Deductions": 0.02160368,
// 		"Federal Tax": 0.36991287,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.0480558,
// 		"City Tax": 0.0004495,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"San Jose Sharks": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.510452312,
// 		"Deductions": 0.09678703,
// 		"Federal Tax": 0.34014026,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.12323916,
// 		"City Tax": 0.0004495,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"St. Louis Blues": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.540836556,
// 		"Deductions": 0.04648199,
// 		"Federal Tax": 0.36006106,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.06298338,
// 		"City Tax": 0.0104002,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Washington Capitals": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.531338384,
// 		"Deductions": 0.06220744,
// 		"Federal Tax": 0.35383378,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.08831558,
// 		"City Tax": 0.0007935,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Calgary Flames": {
// 		"League": "NHL",
// 		"Country": "CA",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.533065,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.45573984,
// 		"Medicare Tax": 0,
// 		"State Tax": 0.0106961,
// 		"City Tax": 0.0004991,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Edmonton Oilers": {
// 		"League": "NHL",
// 		"Country": "CA",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.533065,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.45526565,
// 		"Medicare Tax": 0,
// 		"State Tax": 0.01117028,
// 		"City Tax": 0.0004991,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Ottawa Senators": {
// 		"League": "NHL",
// 		"Country": "CA",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.478976856,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.51083429,
// 		"Medicare Tax": 0,
// 		"State Tax": 0.00950804,
// 		"City Tax": 0.0006808,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Toronto Maple Leafs": {
// 		"League": "NHL",
// 		"Country": "CA",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.478976856,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.51109253,
// 		"Medicare Tax": 0,
// 		"State Tax": 0.08893854,
// 		"City Tax": 0.0006321,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Vancouver Canucks": {
// 		"League": "NHL",
// 		"Country": "CA",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.534825608,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.45534227,
// 		"Medicare Tax": 0,
// 		"State Tax": 0.00933305,
// 		"City Tax": 0.0004991,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Winnipeg Jets": {
// 		"League": "NHL",
// 		"Country": "CA",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.506612452,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.48391385,
// 		"Medicare Tax": 0,
// 		"State Tax": 0.00892537,
// 		"City Tax": 0.0005483,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Vegas Golden Knights": {
// 		"League": "NHL",
// 		"Country": "US",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.584840208,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.3775497,
// 		"Medicare Tax": 0.02278,
// 		"State Tax": 0.01122099,
// 		"City Tax": 0.0006703,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	},
// 	"Montreal Canadiens": {
// 		"League": "NHL",
// 		"Country": "CA",
// 		"IncomeFrom": 0,
// 		"To": 1000000000000,
// 		"Net Income": 0.476982148,
// 		"Deductions": 0.00252,
// 		"Federal Tax": 0.51193845,
// 		"Medicare Tax": 0,
// 		"State Tax": 0.01038822,
// 		"City Tax": 0.0006912,
// 		"Credits": 0,
// 		"Foreign Tax": 0,
// 		"Foreign Tax Credit": 0
// 	}
// }

    // "Sacramento Kings":{
    //   "Country": "US",
    //   "Net Income": 0.493642734,
    //   "Federal Tax": 0.37540958,
    //   "State Tax": 0.130588366,
    //   "City Tax": 0.000359321,
    //   "Credits": 0,
    //   "Deductions": 0.101722287,
    //   "Foreign Tax": 0,
    //   "Foreign Tax Credit": 0
    // },
    // "Orlando Magic":{
    //   "Country": "US",
    //   "Net Income": 0.573115089,
    //   "Federal Tax": 0.414728845,
    //   "State Tax": 0.011447506,
    //   "City Tax": 0.00070856,
    //   "Credits": 0,
    //   "Deductions": 0.002431213,
    //   "Foreign Tax": 0,
    //   "Foreign Tax Credit": 0
    // },
    // "Charlotte Hornets":{
    //   "Country": "US",
    //   "Net Income": 0.536178971,
    //   "Federal Tax": 0.403297576,
    //   "State Tax": 0.059832153,
    //   "City Tax": 0.0006913,
    //   "Credits": 0,
    //   "Deductions": 0.033422553,
    //   "Foreign Tax": 0,
    //   "Foreign Tax Credit": 0
    // },
    // "San Jose Sharks": {
    //   "Country": "US",
    //   "Net Income": 0.5095545699,
    //   "Federal Tax": 0.3662474633,
    //   "State Tax": 0.123652581,
    //   "City Tax": 0.0003593206091,
    //   "Credits": 0,
    //   "Deductions": 0.09720029236,
    //   "Medicare": 0.0145,
    //   "Social Security": 0.0007347,
    //   "Foreign Tax": 0,
    //   "Foreign Tax Credit": 0
    // },
    // "Florida Panthers":{
    //   "Country": "US",
    //   "Net Income": 0.5867863399,
    //   "Federal Tax": 0.4037718023,
    //   "State Tax": 0.008813138644,
    //   "City Tax": 0.00070856,
    //   "Credits": 0,
    //   "Deductions": 0.002441860465,
    //   "Foreign Tax": 0,
    //   "Foreign Tax Credit": 0
    // },
    // "Carolina Hurricanes":{
    //   "Country": "US",
    //   "Net Income": 0.5477850342,
    //   "Federal Tax": 0.3913124697,
    //   "State Tax": 0.06000501237,
    //   "City Tax": 0.0006913,
    //   "Credits": 0,
    //   "Deductions": 0.03390482176,
    //   "Foreign Tax": 0,
    //   "Foreign Tax Credit": 0
    // },
    // "San Diego Padres":{
    //   "Country": "US",
    //   "Net Income": 0.493642734,
    //   "Federal Tax": 0.37540958,
    //   "State Tax": 0.130588366,
    //   "City Tax": 0.000359321,
    //   "Credits": 0,
    //   "Deductions": 0.101722287,
    //   "Foreign Tax": 0,
    //   "Foreign Tax Credit": 0
    // },
    // "Tampa Bay Rays":{
    //   "Country": "US",
    //   "Net Income": 0.573115089,
    //   "Federal Tax": 0.414728845,
    //   "State Tax": 0.011447506,
    //   "City Tax": 0.00070856,
    //   "Credits": 0,
    //   "Deductions": 0.002431213,
    //   "Foreign Tax": 0,
    //   "Foreign Tax Credit": 0
    // },
    // "Atlanta Braves":{
    //   "Country": "US",
    //   "Net Income": 0.536178971,
    //   "Federal Tax": 0.403297576,
    //   "State Tax": 0.059832153,
    //   "City Tax": 0.0006913,
    //   "Credits": 0,
    //   "Deductions": 0.033422553,
    //   "Foreign Tax": 0,
    //   "Foreign Tax Credit": 0
    // }

// }

// const postTrump = {
//   "Sacramento Kings": {
//           "Country": "US",
//           "Net Income": 0.543642734,
//           "Federal Tax": 0.30135488,
//           "State Tax": 0.130588366,
//           "City Tax": 0.000359321,
//           "Credits": 0,
//           "Deductions": 0.101722287,
//           "Medicare": 0.0145,
//           "Social Security": 0.0007347,
//           "Foreign Tax": 0,
//           "Foreign Tax Credit": 0
//         },
//   "Charlotte Hornets": {
//           "Country": "US",
//           "Net Income": 0.586178971,
//           "Federal Tax": 0.329242876,
//           "State Tax": 0.059832153,
//           "City Tax": 0.0006913,
//           "Credits": 0,
//           "Deductions": 0.031298053,
//           "Medicare": 0.0145,
//           "Social Security": 0.0007347,
//           "Foreign Tax": 0,
//           "Foreign Tax Credit": 0
//         },
//   "Orlando Magic":{
//         "Country": "US",
//         "Net Income": 0.623115089,
//         "Federal Tax": 0.340674145,
//         "State Tax": 0.011447506,
//         "City Tax": 0.00070856,
//         "Credits": 0,
//         "Deductions": 0.002431213,
//         "Medicare": 0.0145,
//         "Social Security": 0.0007347,
//         "Foreign Tax": 0,
//         "Foreign Tax Credit": 0
//       },
//       "San Jose Sharks": {
//               "Country": "US",
//               "Net Income": 0.543642734,
//               "Federal Tax": 0.30135488,
//               "State Tax": 0.130588366,
//               "City Tax": 0.000359321,
//               "Credits": 0,
//               "Deductions": 0.101722287,
//               "Medicare": 0.0145,
//               "Social Security": 0.0007347,
//               "Foreign Tax": 0,
//               "Foreign Tax Credit": 0
//             },
//       "Carolina Hurricanes": {
//               "Country": "US",
//               "Net Income": 0.586178971,
//               "Federal Tax": 0.329242876,
//               "State Tax": 0.059832153,
//               "City Tax": 0.0006913,
//               "Credits": 0,
//               "Deductions": 0.031298053,
//               "Medicare": 0.0145,
//               "Social Security": 0.0007347,
//               "Foreign Tax": 0,
//               "Foreign Tax Credit": 0
//             },
//       "Florida Panthers":{
//             "Country": "US",
//             "Net Income": 0.623115089,
//             "Federal Tax": 0.340674145,
//             "State Tax": 0.011447506,
//             "City Tax": 0.00070856,
//             "Credits": 0,
//             "Deductions": 0.002431213,
//             "Medicare": 0.0145,
//             "Social Security": 0.0007347,
//             "Foreign Tax": 0,
//             "Foreign Tax Credit": 0
//             },
//             "San Diego Padres":{
//               "Country": "US",
//               "Net Income": 0.493642734,
//               "Federal Tax": 0.37540958,
//               "State Tax": 0.130588366,
//               "City Tax": 0.000359321,
//               "Credits": 0,
//               "Deductions": 0.101722287,
//               "Foreign Tax": 0,
//               "Foreign Tax Credit": 0
//             },
//             "Tampa Bay Rays":{
//               "Country": "US",
//               "Net Income": 0.573115089,
//               "Federal Tax": 0.414728845,
//               "State Tax": 0.011447506,
//               "City Tax": 0.00070856,
//               "Credits": 0,
//               "Deductions": 0.002431213,
//               "Foreign Tax": 0,
//               "Foreign Tax Credit": 0
//             },
//             "Atlanta Braves":{
//               "Country": "US",
//               "Net Income": 0.536178971,
//               "Federal Tax": 0.403297576,
//               "State Tax": 0.059832153,
//               "City Tax": 0.0006913,
//               "Credits": 0,
//               "Deductions": 0.033422553,
//               "Foreign Tax": 0,
//               "Foreign Tax Credit": 0
//             }
//
// }


function calcTax(team, income, years, taxlaw, escrow){

    var json = {
                team : "",
                income : "",
                taxableincome : "",
                deduction : "",
                netIncome : "", federalTax : "",
                stateTax : "",
                cityTax : "",
                socialSecurity : "",
                medicare : "",
                aav: "",
                netaav : "",
                taxRate: "",
                escrow: "",
                years:""
              };
    if(escrow){
    } else {
      escrow = 0;
    }

    json.escrow = income * escrow
    income = income * (1-escrow)

    country = getCountry(team, taxlaw)

    if(country == "CA"){
      console.log(years)
      var deductions = income * getDeductions(team,taxlaw)
      console.log("Deductions " + deductions)

      var federalTax = income * getFederalTax(team, taxlaw)
      var taxableincome = income - deductions
      console.log("Income - Deductions " + taxableincome)
      var stateTax = income * getStateTax(team, taxlaw)
      var cityTax = income * getCityTax(team, taxlaw)
      var medicare = income * getMedicareTax(team, taxlaw)
      var socialSecurity = 0
      federalTax = federalTax - socialSecurity
      var totalTax = federalTax + stateTax + cityTax + medicare +socialSecurity
      var netIncome = income * getNetIncome(team, taxlaw)
      var netaav = netIncome  / years
      var aav = income/years
      var taxRate = 1-netIncome/income
    } else {

      var deductions = income * getDeductions(team,taxlaw)
      console.log("Deductions " + deductions)

      var federalTax = income * getFederalTax(team, taxlaw)
      var taxableincome = income - deductions
      console.log("Income - Deductions " + taxableincome)
      var stateTax = income * getStateTax(team, taxlaw)
      var cityTax = income * getCityTax(team, taxlaw)
      var medicare = income * getMedicareTax(team, taxlaw)
      var socialSecurity = 7347
      federalTax = federalTax - socialSecurity
      var totalTax = federalTax + stateTax + cityTax + medicare +socialSecurity
      var netIncome = income * getNetIncome(team, taxlaw)
      var netaav = netIncome  / years
      var aav = income/years
      var taxRate = 1-netIncome/income
    }
    console.log(years)
    var deductions = income * getDeductions(team,taxlaw)
    console.log("Deductions " + deductions)

    var federalTax = income * getFederalTax(team, taxlaw)
    var taxableincome = income - deductions
    console.log("Income - Deductions " + taxableincome)
    var stateTax = income * getStateTax(team, taxlaw)
    var cityTax = income * getCityTax(team, taxlaw)
    var medicare = income * getMedicareTax(team, taxlaw)
    var socialSecurity = 7347
    federalTax = federalTax - socialSecurity
    var totalTax = federalTax + stateTax + cityTax + medicare +socialSecurity
    var netIncome = income * getNetIncome(team, taxlaw)
    var netaav = netIncome  / years
    var aav = income/years
    var taxRate = 1-netIncome/income


    json.team = team
    json.income = income
    json.taxableincome = taxableincome
    json.deductions = deductions
    json.federalTax = federalTax
    json.stateTax = stateTax
    json.cityTax = cityTax
    json.totalTax = totalTax
    json.netIncome = netIncome
    json.aav = aav
    json.netaav = netaav
    json.socialSecurity = socialSecurity
    json.medicare = medicare
    console.log(medicare)
    json.taxRate = taxRate
    json.payGraph = 1 - netIncome/175740000 * 1.5
    json.years = years

    return json
  }

  function getFederalTax(team, taxlaw){
    if(taxlaw == "preTrump"){
      var federalTax = preTrump[team]['Federal Tax']

      return federalTax
    } else {
    return federalTax = postTrump[team]['Federal Tax']
    }

  }
  function getMedicareTax(team, taxlaw){
    if(taxlaw == "preTrump"){
      var medicareTax = preTrump[team]['Medicare Tax']
      return medicareTax
    } else {
    return medicareTax = postTrump[team]['Medicare Tax']
    }

  }
  function getSocialSecurityTax(team, taxlaw){
    if(taxlaw == "preTrump"){
      var federalTax = preTrump[team]['Social Security']
      return federalTax
    } else {
    return federalTax = postTrump[team]['Social Security']
    }

  }

  function getStateTax(team, taxlaw){
    if(taxlaw == "preTrump"){
      return preTrump[team]['State Tax']
    } else {
    return postTrump[team]['State Tax']
    }
  }

  function getCityTax(team, taxlaw){
    if(taxlaw == "preTrump"){
      return preTrump[team]['City Tax']
    } else {
    return postTrump[team]['City Tax']
    }
  }

  function getNetIncome(team, taxlaw){
    if(taxlaw == "preTrump"){
      return preTrump[team]['Net Income']
    } else {
    return postTrump[team]['Net Income']
    }
  }

  function getForeignTax(team, taxlaw){
    if(taxlaw == "preTrump"){
      return preTrump[team]['Foreign Tax']
    } else {
    return postTrump[team]['Foreign Tax']
    }
  }

  function getTaxCredit(team, taxlaw){
    if(taxlaw == "preTrump"){
      return preTrump[team]['Foreign Tax Credit']
    } else {
    return postTrump[team]['Foreign Tax Credit']
    }
  }

  function getDeductions(team, taxlaw){
    if(taxlaw == "preTrump"){
      return preTrump[team]['Deductions']
    } else {
    return postTrump[team]['Deductions']
    }
  }

  function getCountry(team, taxlaw){
    if(taxlaw == "preTrump"){
      return preTrump[team]['Country']
    } else {
    return postTrump[team]['Country']
    }
  }
