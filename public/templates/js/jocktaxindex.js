<script>
//initials
var team = {{team1.team}};
var contract = {{params.contract}};
var netcontract = {{team1.netincome}};
var contractLength = {{params.years;
var discountRate = {{params.discountrate}};
//for graph and if statements
var seasons = [];
var payroll = [];
var salarycap = [94000000, 102000000, 108000000, 109000000, 114000000];
var taxthreshold = [113000000, 122000000, 130000000, 132000000, 139000000];

//initial structuregross contract
var structuredContract = [];
var netStructuredContract = [];
//table totals
var grossTotal;
var netTotal;
var netPresentValue = [];



//main
setSeasonCategories(contractLength);
payroll = setTeamPayroll(contractLength);


// var pie = new d3pie("team1PieChart", {
// 	"header": {
// 		"title": {
// 			"text": "<%= @team1[:team_name] %>",
// 			"fontSize": 24,
// 		},
// 		"subtitle": {
// 			"text": "Tax Breakdown",
// 			"color": "#999999",
// 			"fontSize": 14,
// 		},
// 		"titleSubtitlePadding": 9
// 	},
// 	"footer": {
// 		"color": "#999999",
// 		"fontSize": 10,
// 		"location": "bottom-left"
// 	},
// 	"size": {
// 	  	"canvasWidth": 300,
// 		"pieOuterRadius": "90%"
// 	},
// 	"data": {
// 		"sortOrder": "label-asc",
// 		"content": [
// 			{
// 				"label": "Net Income",
// 				"value": <%= @team1[:net_income] %>,
// 				"color": "#2c3e50"
// 			},
// 			{
// 				"label": "Federal Tax",
// 				"value": <%= @team1[:federal_tax] %>,
// 				"color": "#b5b5b5"
// 			},
// 			{
// 				"label": "State Tax",
// 				"value": <%= @team1[:state_tax] %>,
// 				"color": "#b5b5b5"
// 			},
// 			{
// 				"label": "City Tax",
// 				"value": <%= @team1[:city_tax] %>,
// 				"color": "#b5b5b5"
// 			},
// 			{
// 				"label": "Medicare",
// 				"value": <%= @team1[:medicare] %>,
// 				"color": "#b5b5b5"
// 			},
// 			{
// 				"label": "SS",
// 				"value": <%= @team1[:social_security] %>,
// 				"color": "#b5b5b5"
// 			}
// 		]
// 	},
// 	"labels": {
// 		"outer": {
// 			"pieDistance": 25
// 		},
// 		"inner": {
// 			"hideWhenLessThanPercentage": 3
// 		},
// 		"mainLabel": {
// 			"fontSize": 11
// 		},
// 		"percentage": {
// 			"color": "#ffffff",
// 			"decimalPlaces": 0
// 		},
// 		"value": {
// 			"color": "#adadad",
// 			"fontSize": 11
// 		},
// 		"lines": {
// 			"enabled": true
// 		},
// 		"truncation": {
// 			"enabled": true
// 		}
// 	},
// 	"effects": {
// 		"load": {
// 			"effect": "none"
// 		},
// 		"pullOutSegmentOnClick": {
// 			"effect": "linear",
// 			"speed": 400,
// 			"size": 8
// 		}
// 	}
// });

// var pie = new d3pie("teamsPieChart", {
// 	"header": {
// 		"title": {
// 				"text": "<%=@team1[:team_name] %>",
// 			"fontSize": 24,
// 		},
// 		"subtitle": {
// 			"text": "Tax Breakdown",
// 			"color": "#999999",
// 			"fontSize": 14,
// 		},
// 		"titleSubtitlePadding": 9
// 	},
// 	"footer": {
// 		"color": "#999999",
// 		"location": "bottom-left"
// 	},
// 	"size": {
// 		"canvasWidth": 300,
// 		"pieOuterRadius": "90%"
// 	},
// 	"data": {
// 		"sortOrder": "label-asc",
// 		"content": [
// 			{
// 				"label": "Net Income",
// 				"value": <%=@team1[:net_income] %>,
// 				"color": "#2c3e50"
// 			},
// 			{
// 				"label": "Federal Tax",
// 				"value": <%=@team1[:federal_tax] %>,
// 				"color": "#b5b5b5"
// 			},
// 			{
// 				"label": "State Tax",
// 				"value": <%=@team1[:state_tax] %>,
// 				"color": "#b5b5b5"
// 			},
// 			{
// 				"label": "City Tax",
// 				"value": <%=@team1[:city_tax] %>,
// 				"color": "#b5b5b5"
// 			},
// 			{
// 				"label": "Medicare",
// 				"value": <%=@team1[:medicare] %>,
// 				"color": "#b5b5b5"
// 			},
// 			{
// 				"label": "SS",
// 				"value": <%=@team1[:social_security] %>,
// 				"color": "#b5b5b5"
// 			}
// 		]
// 	},
// 	"labels": {
// 		"outer": {
// 			"pieDistance": 25
// 		},
// 		"inner": {
// 			"hideWhenLessThanPercentage": 3
// 		},
// 		"mainLabel": {
// 			"fontSize": 11
// 		},
// 		"percentage": {
// 			"color": "#ffffff",
// 			"decimalPlaces": 0
// 		},
// 		"value": {
// 			"color": "#adadad",
// 			"fontSize": 11
// 		},
// 		"lines": {
// 			"enabled": true
// 		},
// 		"truncation": {
// 			"enabled": true
// 		}
// 	},
// 	"effects": {
// 		"load": {
// 			"effect": "none"
// 		},
// 		"pullOutSegmentOnClick": {
// 			"effect": "linear",
// 			"speed": 400,
// 			"size": 8
// 		}
// 	}
// });




//get equal weighted contracts
  for(var i = 0; i < contractLength; i++)
  {
    var  perYearContract = contract/contractLength;
    structuredContract.push(perYearContract);

    var netPerYearContract = netcontract/contractLength;
    netStructuredContract.push(netPerYearContract)

  }
  console.log(structuredContract);
  //equalcontract
//   if($('#equal-payment').is(':checked'))
//   {
//     for(var i = 0; i < contractLength; i++)
//     {
//       var  perYearContract = contract/contractLength;
//       structuredContract.push(perYearContract);

//       var netPerYearContract = netcontract/contractLength;
//       netStructuredContract.push(netPerYearContract)

//     }
//   }
//   else if($('#ip-payment').is(':checked'))
//   {

//   }

// }

setSeasonInputs(structuredContract);
var pv = setPV(netStructuredContract);
setNetSeasonPV(pv);

pv = setPV(structuredContract);
setGrossSeasonPV(pv);

sumGrossAndNetSeasonTotals();

function formatM(number){
  var formatted = numeral(number).format('0,0');
  return formatted;
}

function setSeasonInputs(structuredContract){

  for(i = 0; i < structuredContract.length; i++){
    seasonNum = i + 1;
    $("#grossseason-" + seasonNum.toString()).val(Math.round(structuredContract[i]).toString());
    editNetStructuredContract(structuredContract[i], i);
    document.getElementById("netseason-"+(i+1)).innerHTML = formatM(netStructuredContract[i]);
  }
}

function editNetStructuredContract(grosspay ,elId){

  var ratio = grosspay/contract;
  var netPayment = ratio*netcontract;
  //document.getElementById("netseason-"+ elId).innerHTML = formatM(netPayment);
  // console.log(netPayment);

  netStructuredContract[elId] = netPayment;
}

function sumStructuredContract(){
  var ratio = grosspay/contract;
  var netPayment = ratio*netcontract;

  var arr = structuredContract;
    var tot=0;
    for(var i=0;i<arr.length;i++){

            tot += arr[i];

    }
    grosstotal = tot;
    document.getElementById("grosstotal").innerHTML = formatM(grosstotal);
    //document.getElementById("nettotal").innerHTML = formatM(nettotal);
    console.log("at ssC : " +arr);

}

function editStructuredContract(newcontract, elid){

    structuredContract[elid] = newcontract;
}


//add season totals for table
function sumGrossAndNetSeasonTotals(){
    var arrgross, arrnet = [];
    arrgross = structuredContract.slice(0);
    arrnet = netStructuredContract.slice(0);
   var totgross = 0;
   var totnet = 0;

    for(var i=0;i<arrgross.length;i++){
            totgross += arrgross[i];
    }
    grossTotal = totgross;

    for(var i=0;i<arrnet.length;i++){
            totnet += arrnet[i];
    }
    console.log(arrnet);
    document.getElementById("grosstotal").innerHTML= formatM(totgross);
    document.getElementById("nettotal").innerHTML= formatM(totnet);

}

//set categories for graph
function setSeasonCategories(years) {

  seasons = [];

   var year;
   var month = new Date().getMonth();
   for(i = 0; i < 10; i++)
   {
    year = new Date().getFullYear() + i;
     if (month < 7)
     {
       year = years - 1;
     }
   var season = year + "-" + (year + 1 - 2000) ;
   season = season.toString();

   seasons.push(season);
   console.log(seasons);
   }
   return seasons;
}



//get Team payroll for graph
function setTeamPayroll(contractLength){
  var payrollReturn = [];
  var json = '<%= raw @payrolls %>';
  var payrolls = JSON.parse(json);

  $.each(payrolls, function(k, v) {
    var value
    if (v != null){
      value = v.replace('$','');
    } else{
      value = 0;
    }
    payrollReturn.push(parseInt(value));
    console.log(k + ' is ' + v);
    console.log(payrollReturn)
  });

  if (payrollReturn.length > contractLength){
    payrollReturn = payrollReturn.slice(0,contractLength);
  }

  return payrollReturn;
}


$('#newcontract').change(function() {
    var val = $(this).is(':checked');
    chart.series[2].setVisible(val);
});

$('#currentpayroll').change(function(){
    var val = $(this).is(':checked');
    chart.series[0].setVisible(val);
    chart.series[1].setVisible(val);
    chart.series[3].setVisible(val);
});


$('.form-control.salarypayments').change(function() {
  var arr = document.getElementsByName('salarypayments');
    var tot=0;
    for(var i=0;i<arr.length;i++){
        if(parseInt(arr[i].value))
            tot += parseInt(arr[i].value);
    }
    //$().text(tot);
    //document.getElementById(".grosstotal").textContent= "testtt";
     document.getElementById("grosstotal").innerHTML = tot;
});

function setPV(contract){
  var pvresult = 0;
  var pvarr = [];
  var pvyear = 0;

  for(i = 0; i < contract.length; i++){
    pvyear = contract[i]/Math.pow((1 + discountRate), i);
    pvresult += pvyear;
    pvarr.push(pvyear);
  }
  console.log(pvarr);
  console.log(pvresult);

  return [pvarr, pvresult];
}

function setNetSeasonPV(pvdata){
  seasonpv = pvdata[0];
  totalpv = pvdata[1];
  var i;
  for(i = 0; i < seasonpv.length; i++){
    document.getElementById("netpvseason-"+(i+1)).innerHTML = formatM(seasonpv[i]);
  }
  document.getElementById("netpvtotal").innerHTML = formatM(totalpv);
}


function setGrossSeasonPV(pvdata){
  seasonpv = pvdata[0];
  totalpv = pvdata[1];
  var i;
  for(i = 0; i < seasonpv.length; i++){
    document.getElementById("grosspvseason-"+(i+1)).innerHTML = formatM(seasonpv[i]);
  }
  document.getElementById("grosspvtotal").innerHTML = formatM(totalpv);
}

function getStructuredContractTotal(){
   var arrgross = [];
    arrgross = structuredContract.slice(0);

   var sumContract = 0;

    for(var i=0;i<arrgross.length;i++){
            sumContract += arrgross[i];
    }

  return sumContract;
}

function getGrossContract(){

  return contract;
}

function getContractLength(){

  return contractLength;
}


function showWarning() {
  if ($('#distributeWarning').hasClass('hide')) {
      $('#distributeWarning').removeClass('hide');
  };

}

function hideWarning() {
  if ($('#distributeWarning').hasClass('hide')) return;
  $('#distributeWarning').addClass('hide');
}

function redistribute(){

  var contract = getGrossContract();
  var sumContract = getStructuredContractTotal();
  var years = getContractLength();
  var distribute = 0;
  var difference = 0;

  if (contract != sumContract){
    difference = contract - sumContract;
    distribute = difference / years;
      // Save it!
    for(var i=0;i<structuredContract.length;i++){
      var newcontract = structuredContract[i] + distribute;

      editStructuredContract(newcontract, i);
      editNetStructuredContract(newcontract, i);


    chart.series[2].data[i].update({
      y: newcontract
    });
      refreshTableandChart();
    }
  }
  hideWarning();
}

function refreshTableandChart(){

    for(var i=0; i < structuredContract.length; i++){

    $('#grossseason-'+(i+1)).val(structuredContract[i]);
    document.getElementById("netseason-"+(i+1)).innerHTML = formatM(netStructuredContract[i]);

    sumGrossAndNetSeasonTotals();
    var pv = setPV(netStructuredContract);
    setNetSeasonPV(pv);
    var pv2 = setPV(structuredContract);
    setGrossSeasonPV(pv2);

    }

}


 //create chart
var chart = new Highcharts.Chart({

  chart: {
    renderTo: 'container',
    animation: false
  },
  title: {
      text: ''
    },

  xAxis: {
    categories: seasons,
    title: {
      text: 'Season'
    }
  },


  yAxis: [{
    title: {
      text: '$ Dollars'
    }
  }],

  plotOptions: {
    series: {
      borderColor: '#2c3e50',
      // point: {
      //   events: {
      //     drag: function(e) {
      //       $('#drag').html(
      //         'Dragging <b>' + this.series.name + '</b>, <b>' + this.category + '</b> to <b>' + Highcharts.numberFormat(e.y, 0,'','') + '</b>');

      //         var i=0, len = seasons.length;
      //         for(;i<len;i++) if (this.category ==  seasons[i]) break;

      //         editStructuredContract(e.y, i);
      //         editNetStructuredContract(e.y, i);

      //       refreshTableandChart();

      //       var total  = getStructuredContractTotal();
      //       var origcontract = getGrossContract();

      //       if (origcontract != total){
      //         showWarning();
      //       } else {
      //           hideWarning();
      //       }
      //     },
      //     drop: function() {
      //       $('#drop').html(
      //         'In <b>' + this.series.name + '</b>, <b>' + this.category + '</b> was set to <b>' + Highcharts.numberFormat(this.y, 0,'','') + '</b>');
      //     }
      //   }
      // },
      stickyTracking: false
    },
    column: {
      stacking: 'normal'
    },
    line: {
      cursor: 'ns-resize'
    }
  },

  tooltip: {
    yDecimals: 2
  },

 series: [{
  //   name: 'Salary Cap',
  //   data: [94000000, 102000000, 108000000, 109000000, 114000000],
  //   visible: true
  // }, {
  //   name: 'Tax Cap',
  //   data: [113000000, 122000000, 130000000, 132000000, 139000000]
  // }, {
    name: 'New Contract',
    data: structuredContract.slice(0),
     visible: true,
    //draggableY: true,
   // dragMinY: 0,
    type: 'column',
    minPointLength: 2,
    color: 'whitesmoke'
  }, {
    name: 'Current Payroll',
    data: payroll,
    visible: true,
    //draggableX: true,
    draggableY: false,
    dragMinY: 0,
    type: 'column',
    minPointLength: 2,
    color: '#2c3e50'
  }]

}, function(chart) {

  $('[id^="grossseason-"]').on('keyup change', function(e){
    // this - the current el
    var elId = this.id;
    var num = +elId.split('-')[1];
    num--;

    var val = parseInt(this.value) || 0;
    console.log(this.value)
    chart.series[2].data[num].update({
      y: val
    });

    editStructuredContract(val, num);
    editNetStructuredContract(val, num);

    refreshTableandChart();

     var total  = getStructuredContractTotal();
     var origcontract = getGrossContract();

     if (origcontract != total){
       console.log("in loo")
       showWarning();

     } else {
        hideWarning();
     }
  })
});
</script>
