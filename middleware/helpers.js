var Handlebars = require("handlebars");
var NumeralHelper = require("handlebars.numeral");

NumeralHelper.registerHelpers(Handlebars);

// greater than
Handlebars.registerHelper('gt', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a > b) ? next.fn(this) : next.inverse(this);
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


function formatNumber(num) {
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "") ;
}

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
