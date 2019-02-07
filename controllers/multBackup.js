var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var path = require("path");
var fs = require('fs');
var pdf = require('html-pdf');
var Handlebars = require("handlebars")


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
exports.nbaMultGet = function(req, res) {


  res.render('nbaget0', {
    title: 'Jock Tax Index | NBA'
  });
};

/**
 * Post to /nba
 */
exports.nbaMultPost = function(req, res) {
  var teams = []
  var table =[]
  var t1 = []
  var t2 = []
  var paramTeams = [req.body.team1, "Orlando Magic", "Sacramento Kings"]
  var params = { team1: req.body.team1, team2: req.body.team2, income: req.body.contract, years: req.body.years, taxlaw: req.body.taxlaw, discountrate: req.body.discountrate}


  var t1 = calcTax(paramTeams[0],  req.body.contract, req.body.years, req.body.taxlaw)
  t1.id = 0
  teams.push(t1)
  for(var i = 1; i < paramTeams.length; i++){
    var t2 = calcTax(paramTeams[i],  req.body.contract, req.body.years, req.body.taxlaw)

    var betterDeal = ""
    var worseTeam = ""
    var matchedContract = 0
    var premium = 0

    if (t1.netIncome > t2.netIncome){
      betterTeam = t1.team
      worseTeam = t2.team
      matchedContract = t1.netIncome/(1-t2.taxRate)
      premium = req.body.contract - matchedContract
    } else {
      betterTeam = t2.team
      worseTeam = t1.team
      matchedContract = t2.netIncome/(1-t1.taxRate)
      premium = req.body.contract - matchedContract
    }


    var comparison = {contract: req.body.contract, betterTeam: betterTeam, worseTeam: worseTeam, matchedContract: matchedContract, premium: premium}
    t2.comparison = comparison
    t2.t1 = t1
    t2.params = params
    t2.id = i
    teams.push(t2)
    }


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
      console.log(teams)

  res.render('nba0',{
    title: 'Jock Tax Index | NBA',
    comparison: comparison,
    team1: t1,
    team2: t2,
    params: params,
    table: table,
    teams: teams
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

  var t1 = calcTax(req.body.team1,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)
  var t2 = calcTax(req.body.team2,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)

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

   var t1 = calcTax(req.body.team1,  req.body.contract, req.body.years, req.body.taxlaw)
   var t2 = calcTax(req.body.team2,  req.body.contract, req.body.years, req.body.taxlaw)

   var t1 = calcTax(req.body.team1,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)
   var t2 = calcTax(req.body.team2,  req.body.contract, req.body.years, req.body.taxlaw, req.body.escrow)
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
  var paramTeams = ["Utah Jazz","Utah Jazz", "Miami Heat", "Boston Celtics", "Los Angeles Lakers"]
  var paramContracts = [175740000,135744000, 130290000, 130290000, 130290000]

  var params = { team1: req.body.team1, team2: req.body.team2, income: req.body.contract, years: req.body.years, taxlaw: req.body.taxlaw, discountrate: req.body.discountrate}


  var t1 = calcTax(paramTeams[0],  paramContracts[0], req.body.years, req.body.taxlaw)
  t1.id = 0
  teams.push()
  for(var i = 0; i < paramTeams.length; i++){
    var t2 = calcTax(paramTeams[i],  paramContracts[i], req.body.years, req.body.taxlaw)

    var betterDeal = ""
    var worseTeam = ""
    var matchedContract = 0
    var premium = 0

    if (t1.netIncome > t2.netIncome){
      betterTeam = t1.team
      worseTeam = t2.team
      difference = t2.netIncome - t1.netIncome
      matchedContract = t1.netIncome/(1-t2.taxRate)
      premium = req.body.contract - matchedContract
    } else {
      betterTeam = t2.team
      worseTeam = t1.team
      difference = t2.netIncome - t1.netIncome
      matchedContract = t1.netIncome/(1-t2.taxRate)
      premium =  matchedContract - req.body.contract
    }


    var comparison = {contract: req.body.contract, betterTeam: betterTeam, worseTeam: worseTeam, difference: difference, matchedContract: matchedContract, premium: premium}

    t2.comparison = comparison
    t2.t1 = t1
    t2.params = params
    t2.id = i
    teams.push(t2)
    }


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

  ranked = teams
  ranked.sort(sort)




  for(i = 0; i < ranked.length; i++){
    id  = i+1
    ranked.id = id

      console.log("Team: " + ranked[i].team + " | Net: " + ranked[i].netIncome)
  }
  console.log(ranked)


  var p = path.join( __dirname, '..', 'public/templates/' );
  console.log(p)

  var html = fs.readFileSync(p +'app-template2.html','utf8');

  var template = Handlebars.compile(html);

  var data = {
    title: 'Jock Tax Index | NBA',
    comparison: comparison,
    team1: t1,
    team2: t2,
    params: params,
    table: table,
    teams: teams,
    ranked: ranked
  }

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
    "Sacramento Kings":{
      "Country": "US",
      "Net Income": 0.493642734,
      "Federal Tax": 0.37540958,
      "State Tax": 0.130588366,
      "City Tax": 0.000359321,
      "Credits": 0,
      "Deductions": 0.101722287,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Orlando Magic":{
      "Country": "US",
      "Net Income": 0.573115089,
      "Federal Tax": 0.414728845,
      "State Tax": 0.011447506,
      "City Tax": 0.00070856,
      "Credits": 0,
      "Deductions": 0.002431213,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Charlotte Hornets":{
      "Country": "US",
      "Net Income": 0.536178971,
      "Federal Tax": 0.403297576,
      "State Tax": 0.059832153,
      "City Tax": 0.0006913,
      "Credits": 0,
      "Deductions": 0.033422553,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "San Jose Sharks": {
      "Country": "US",
      "Net Income": 0.5095545699,
      "Federal Tax": 0.3662474633,
      "State Tax": 0.123652581,
      "City Tax": 0.0003593206091,
      "Credits": 0,
      "Deductions": 0.09720029236,
      "Medicare": 0.0145,
      "Social Security": 0.0007347,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Florida Panthers":{
      "Country": "US",
      "Net Income": 0.5867863399,
      "Federal Tax": 0.4037718023,
      "State Tax": 0.008813138644,
      "City Tax": 0.00070856,
      "Credits": 0,
      "Deductions": 0.002441860465,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Carolina Hurricanes":{
      "Country": "US",
      "Net Income": 0.5477850342,
      "Federal Tax": 0.3913124697,
      "State Tax": 0.06000501237,
      "City Tax": 0.0006913,
      "Credits": 0,
      "Deductions": 0.03390482176,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "San Diego Padres":{
      "Country": "US",
      "Net Income": 0.493642734,
      "Federal Tax": 0.37540958,
      "State Tax": 0.130588366,
      "City Tax": 0.000359321,
      "Credits": 0,
      "Deductions": 0.101722287,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Tampa Bay Rays":{
      "Country": "US",
      "Net Income": 0.573115089,
      "Federal Tax": 0.414728845,
      "State Tax": 0.011447506,
      "City Tax": 0.00070856,
      "Credits": 0,
      "Deductions": 0.002431213,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Atlanta Braves":{
      "Country": "US",
      "Net Income": 0.536178971,
      "Federal Tax": 0.403297576,
      "State Tax": 0.059832153,
      "City Tax": 0.0006913,
      "Credits": 0,
      "Deductions": 0.033422553,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Boston Celtics":{
      "Country": "US",
      "Net Income": 0.537312066,
      "Federal Tax": 0.38489766,
      "State Tax": 0.053427157,
      "City Tax": 0.000678217,
      "Credits": 0,
      "Deductions": 0.024363574,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Los Angeles Lakers":{
      "Country": "US",
      "Net Income": 0.489940398,
      "Federal Tax": 0.353839414,
      "State Tax": 0.132196299,
      "City Tax": 0.000338988,
      "Credits": 0,
      "Deductions": 0.102793488,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Miami Heat":{
      "Country": "US",
      "Net Income": 0.570062264,
      "Federal Tax": 0.393538673,
      "State Tax": 0.012035946,
      "City Tax": 0.000678217,
      "Credits": 0,
      "Deductions": 0.002542832,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    },
    "Utah Jazz":{
      "Country": "US",
      "Net Income": 0.537091591,
      "Federal Tax": 0.38475311,
      "State Tax": 0.054131411,
      "City Tax": 0.000338988,
      "Credits": 0,
      "Deductions": 0.024728599,
      "Foreign Tax": 0,
      "Foreign Tax Credit": 0
    }

}

const postTrump = {
  "Sacramento Kings": {
          "Country": "US",
          "Net Income": 0.543642734,
          "Federal Tax": 0.30135488,
          "State Tax": 0.130588366,
          "City Tax": 0.000359321,
          "Credits": 0,
          "Deductions": 0.101722287,
          "Medicare": 0.0145,
          "Social Security": 0.0007347,
          "Foreign Tax": 0,
          "Foreign Tax Credit": 0
        },
  "Charlotte Hornets": {
          "Country": "US",
          "Net Income": 0.586178971,
          "Federal Tax": 0.329242876,
          "State Tax": 0.059832153,
          "City Tax": 0.0006913,
          "Credits": 0,
          "Deductions": 0.031298053,
          "Medicare": 0.0145,
          "Social Security": 0.0007347,
          "Foreign Tax": 0,
          "Foreign Tax Credit": 0
        },
  "Orlando Magic":{
        "Country": "US",
        "Net Income": 0.623115089,
        "Federal Tax": 0.340674145,
        "State Tax": 0.011447506,
        "City Tax": 0.00070856,
        "Credits": 0,
        "Deductions": 0.002431213,
        "Medicare": 0.0145,
        "Social Security": 0.0007347,
        "Foreign Tax": 0,
        "Foreign Tax Credit": 0
      },
      "San Jose Sharks": {
              "Country": "US",
              "Net Income": 0.543642734,
              "Federal Tax": 0.30135488,
              "State Tax": 0.130588366,
              "City Tax": 0.000359321,
              "Credits": 0,
              "Deductions": 0.101722287,
              "Medicare": 0.0145,
              "Social Security": 0.0007347,
              "Foreign Tax": 0,
              "Foreign Tax Credit": 0
            },
      "Carolina Hurricanes": {
              "Country": "US",
              "Net Income": 0.586178971,
              "Federal Tax": 0.329242876,
              "State Tax": 0.059832153,
              "City Tax": 0.0006913,
              "Credits": 0,
              "Deductions": 0.031298053,
              "Medicare": 0.0145,
              "Social Security": 0.0007347,
              "Foreign Tax": 0,
              "Foreign Tax Credit": 0
            },
      "Florida Panthers":{
            "Country": "US",
            "Net Income": 0.623115089,
            "Federal Tax": 0.340674145,
            "State Tax": 0.011447506,
            "City Tax": 0.00070856,
            "Credits": 0,
            "Deductions": 0.002431213,
            "Medicare": 0.0145,
            "Social Security": 0.0007347,
            "Foreign Tax": 0,
            "Foreign Tax Credit": 0
            },
            "San Diego Padres":{
              "Country": "US",
              "Net Income": 0.493642734,
              "Federal Tax": 0.37540958,
              "State Tax": 0.130588366,
              "City Tax": 0.000359321,
              "Credits": 0,
              "Deductions": 0.101722287,
              "Foreign Tax": 0,
              "Foreign Tax Credit": 0
            },
            "Tampa Bay Rays":{
              "Country": "US",
              "Net Income": 0.573115089,
              "Federal Tax": 0.414728845,
              "State Tax": 0.011447506,
              "City Tax": 0.00070856,
              "Credits": 0,
              "Deductions": 0.002431213,
              "Foreign Tax": 0,
              "Foreign Tax Credit": 0
            },
            "Atlanta Braves":{
              "Country": "US",
              "Net Income": 0.536178971,
              "Federal Tax": 0.403297576,
              "State Tax": 0.059832153,
              "City Tax": 0.0006913,
              "Credits": 0,
              "Deductions": 0.033422553,
              "Foreign Tax": 0,
              "Foreign Tax Credit": 0
            }


}


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
                aav : "",
                taxRate: "",
                escrow: ""
              };
    if(escrow){
    } else {
      escrow = 0;
    }

    json.escrow = income * escrow
    income = income * (1-escrow)



    var deductions = income * getDeductions(team,taxlaw)
    var totalFedTax = getFederalTax(team, taxlaw)

    var federalTax = income * totalFedTax
    var taxableincome = income - deductions
    var stateTax = income * getStateTax(team, taxlaw)
    var cityTax = income * getCityTax(team, taxlaw)
    var medicare = 233000
    var socialSecurity = 7347
    federalTax = federalTax - medicare
    federalTax = federalTax - socialSecurity
    var totalTax = federalTax + stateTax + cityTax
    var netIncome = income * getNetIncome(team, taxlaw)
    var aav = netIncome  / years
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
    json.socialSecurity = socialSecurity
    json.medicare = medicare
    json.taxRate = taxRate

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
      var medicareTax = preTrump[team]['Medicare']
      return medicareTax
    } else {
    return medicareTax = postTrump[team]['Medicare']
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

  function sort(t1, t2) {
      return t2.netIncome - t1.netIncome
  }
