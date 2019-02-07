var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('./models/User');
var path = require("path");
var fs = require('fs');
var pdf = require('html-pdf');
var Handlebars = require("handlebars")
var NumeralHelper = require("handlebars.numeral");
var helpers = require('handlebars-helpers')();



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

    value = (lvalue - cvalue + rvalue)
    value = formatNumber(value)
  return value
});

Handlebars.registerHelper("premium", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    value = (lvalue - rvalue)
    value = formatNumber(value)
  return value
});

Handlebars.registerHelper("fnumber", function(value, options) {
    value = parseFloat(value);

    value = formatNumber(value)
  return value
});

Handlebars.registerHelper("pct", function(value, options) {
  value = formatNumberPct(parseFloat(value) * 100);

  return value
});
Handlebars.registerHelper("gpct", function(value, options) {
  value = formatNumberPct(99 - parseFloat(value) * 100);

  return value
});

Handlebars.registerHelper('fCurrency', function(value) {
  		value = Math.round(value)
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



const jocktax = require('./lib/tax2.js');
  var table =[]

  var teams = [
    {
      team:"Washington Redskins",
      indexTo: "Washington Redskins",
      years: 5,
      residence: "Michigan",
      taxLaw: "preTrump",
      discountrate: 0.05,
      terms: [
              {
                signingBonus: 39000000,
                salary: 1000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
          ],
      termResults : [],
      comparison : ""
    },
    {
      team:"Arizona Cardinals",
      indexTo: "Washington Redskins",
      years: 5,
      residence: "Michigan",
      taxLaw: "preTrump",
      discountrate: 0.05,
      terms: [
              {
                signingBonus: 39000000,
                salary: 1000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
          ],
      termResults : [],
      comparison : ""
    },
    {
      team:"New York Jets",
      indexTo: "Washington Redskins",
      years: 5,
      residence: "Michigan",
      taxLaw: "preTrump",
      discountrate: 0.05,
      terms: [
              {
                signingBonus: 39000000,
                salary: 1000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
          ],
      termResults : [],
      comparison : ""
    },
    {
      team:"San Francisco 49ers",
      indexTo: "Washington Redskins",
      years: 5,
      residence: "Michigan",
      taxLaw: "preTrump",
      discountrate: 0.05,
      terms: [
              {
                signingBonus: 39000000,
                salary: 1000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
          ],
      termResults : [],
      comparison : ""
    },
    {
      team:"Jacksonville Jaguars",
      indexTo: "Washington Redskins",
      years: 5,
      residence: "Michigan",
      taxLaw: "preTrump",
      discountrate: 0.05,
      terms: [
              {
                signingBonus: 39000000,
                salary: 1000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
          ],
      termResults : [],
      comparison : ""
    },
    {
      team:"Los Angeles Rams",
      indexTo: "Washington Redskins",
      years: 5,
      residence: "Michigan",
      taxLaw: "preTrump",
      discountrate: 0.05,
      terms: [
              {
                signingBonus: 39000000,
                salary: 1000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
              {
                signingBonus: 0,
                salary: 22000000
              },
          ],
      termResults : [],
      comparison : "",
      totals: ""
    }
    ]

  for(var i = 0; i < teams.length; i++){
    console.log("##################################")
    console.log("### "+  teams[i].team +" ###")
    console.log("##################################")

    var signingBonus = 0
    var signingBonusIncome = 0
    var signingBonusTax = 0
    var income = 0
    var taxableincome = 0
    var netIncome = 0
    var federalTax = 0
    var stateTax = 0
    var cityTax = 0
    var socialSecurity = 0
    var medicare = 0
    var deductions = 0
    var totalTax = 0
    var allTax = 0
    var allIncome = 0
    var allNetIncome = 0


    for(var v = 0; v < teams[i].terms.length; v++){
      console.log("================")
      console.log("==   Year "+ (v+1) + "   ==")
      console.log("================")

      var team1 = jocktax.calcTax(teams[i].team,  teams[i].terms[v], teams[i].terms.length, teams[i].taxLaw)
      var team2 = jocktax.calcTax(teams[i].indexTo, teams[i].terms[v], teams[i].terms.length, teams[i].taxLaw)
      // console.log(team1)
      teams[i].termResults.push(team1)


      var betterDeal = ""
      var worseTeam = ""
      var matchedContract = 0
      var premium = 0

      if (team1.netIncome > team2.netIncome){
        betterTeam = team1.team
        worseTeam = team2.team
        difference = team2.netIncome - team1.netIncome
        matchedContract = team1.netIncome/(1-team2.taxRate)
        premium = teams[i].terms[v].salary - matchedContract
      } else {
        betterTeam = team2.team
        worseTeam = team1.team
        difference = team2.netIncome - team1.netIncome
        matchedContract = team1.netIncome/(1-team2.taxRate)
        premium =  matchedContract - teams[i].terms[v].salary
      }


      var comparison = {contract: teams[i].terms[v].salary, betterTeam: betterTeam, worseTeam: worseTeam, difference: difference, matchedContract: matchedContract, premium: premium}

      teams[i].comparison = comparison


      signingBonus += teams[i].terms[v].signingBonus
      signingBonusIncome += team1.signingBonusIncome
      signingBonusTax += team1.signingBonusTax
      income += team1.income
      taxableincome += team1.taxableincome
      netIncome += team1.netIncome
      federalTax += team1.federalTax
      stateTax += team1.stateTax
      cityTax += team1.cityTax
      socialSecurity += team1.socialSecurity
      medicare += team1.medicare
      deductions += team1.deductions
      totalTax += team1.totalTax
      allTax += team1.signingBonusTax + team1.totalTax
      allIncome += teams[i].terms[v].signingBonus + team1.income
      allNetIncome += team1.netIncome + team1.signingBonusIncome



    }

      var total = {
        signingBonus: signingBonus,
        signingBonusIncome: signingBonusIncome,
        signingBonusTax: signingBonusTax,
        income: income,
        taxableincome: taxableincome,
        netIncome: netIncome,
        federalTax: federalTax,
        stateTax: stateTax,
        cityTax: cityTax,
        socialSecurity: socialSecurity,
        medicare: medicare,
        deductions: deductions,
        totalTax: totalTax,
        allTax: allTax,
        allIncome: allIncome,
        allNetIncome: allNetIncome
      }
      teams[i].totals = total
console.log(teams[i])
  }



  //   var betterDeal = ""
  //   var worseTeam = ""
  //   var matchedContract = 0
  //   var premium = 0
  //
  //   if (t1.netIncome > t2.netIncome){
  //     betterTeam = t1.team
  //     worseTeam = t2.team
  //     difference = t2.netIncome - t1.netIncome
  //     matchedContract = t1.netIncome/(1-t2.taxRate)
  //     premium = paramContract[0] - matchedContract
  //   } else {
  //     betterTeam = t2.team
  //     worseTeam = t1.team
  //     difference = t2.netIncome - t1.netIncome
  //     matchedContract = t1.netIncome/(1-t2.taxRate)
  //     premium =  matchedContract - paramContract[0]
  //   }
  //
  //
  //   var comparison = {contract: paramContract[0], betterTeam: betterTeam, worseTeam: worseTeam, difference: difference, matchedContract: matchedContract, premium: premium}
  //
  //   t2.comparison = comparison
  //   t2.t1 = t1
  //   t2.params = params
  //   t2.id = i
  //   teams.push(t2)
  //   }
  //
  //
  // for(var v = 0; v < paramYears; v++){
  //   year = new Date().getFullYear() + v;
  //   year2 = new Date().getFullYear() + v + 1
  //   var season = year + "-" + year2
  //
  //   var grossseasonid = 'grossseason-' + v;
  //   var netseasonid = 'netseason-' + v;
  //   var grosspvseason = 'grosspvseason-' + v;
  //   var netpvseason = 'netpvseason-' + v;
  //
  //
  //   var trow = {season: season,grossseasonid: grossseasonid, netseasonid: netseasonid, grosspvseasonid: grosspvseason, netpvseasonid: netpvseason, discountrate: paramDiscountRate}
  //   table.push(trow)
  //
  //
  //
  // }
  //
  ranked = teams
  ranked.sort(sort)
  console.log(ranked)




  for(i = 0; i < ranked.length; i++){
    id  = i+1
    ranked.id = id

      console.log("Team: " + ranked[i].team + " | Net: " + ranked[i].totals.allNetIncome)
  }


  //  var p = path.join( __dirname, '..', 'public/templates/' );
  var p = path.join('./public/templates/' );
  console.log(p)

  var html = fs.readFileSync(p +'app-template2.html','utf8');

  var template = Handlebars.compile(html);

  var data = {
    teams: ranked
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
  var pdfname = date +'.pdf';
  pdfname = 'public/'+pdfname
  pdf.create(html, options).toFile(pdfname, function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });








function sort(t1, t2) {
    return t2.totals.allNetIncome - t1.totals.allNetIncome
}
