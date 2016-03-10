 (function(document){
	'use strict';

	// var chart = document.getElementById('my_chart');

	// chart.type='column';
	// chart.options = {
	// 		title:'Best Chart Ever',
	// 		vAxis: {minValue: 0, maxValue: 30},
	// 		legend: {position: 'right'}

	// };
	// chart.rows = [ ["Bagels", 12, 8], ["Donuts", 5, 1], ["Croissants", 20, 25] ];



	var changingChart = document.getElementById('mutating_chart');

	var randomNum = function(min, max) {
		return (Math.random() * (max - min)) + min;
	};

	// setInterval(function(){
	// 	changingChart.rows = [ 
	// 		["Col1", randomNum(0, 10)], 
	// 		["Col2", randomNum(0, 20)],
	// 		["Col3", randomNum(0, 10)] 
	// 	]
	// }, 2000);

  var sheet = document.querySelector('google-sheets');
  var fetched = false;
  sheet.addEventListener('google-sheet-data', function(e) {
   // this.spreadsheets - list of the user's spreadsheets
   // this.tab - information on the tab that was fetched
   // this.rows - cell row information for the tab that was fetched
   var columnNames = [];

   if(!fetched) {
   	fetched = true;
	   for (var key in this.rows[0]) {

			if (key.includes("gsx")) {
				columnNames.push([key.substr(key.indexOf('$')+1), key]);
				// console.log(key.substr(key.indexOf('$')+1));
			}
	   }
	   // console.log(columnNames);
	   (this.rows).forEach( function(element, index) {
	   	console.log(element['gsx$country']['$t']);
	   	console.log(element['gsx$population']['$t']);
	   	console.log(element['gsx$dateupdated']['$t']);
	   	console.log(element['gsx$ofworldpopulation']['$t']);

	   });
	}
   
  });

  sheet.addEventListener('error', function(e) {
   // e.detail.response
  });
})(document);