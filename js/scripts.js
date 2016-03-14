 (function(document){
	'use strict';

	var chart = document.getElementById('my_chart');
	var countriesList = document.getElementById('countriesList');
	
	chart.type='column';
	chart.options = {
			title:'World Populations',
			legend: {position: 'right'},
			tooltip: {isHtml: true}

	};
	chart.rows = [];

	var chartData = [];



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
					
				}
		   }
		   
		   (this.rows).forEach( function(element, index) {
		   	var country = element['gsx$country']['$t'];
		   	var population = parseInt(element['gsx$population']['$t'].replace(/,/g,''));
		   	var percentOfWorld = element['gsx$ofworldpopulation']['$t'];
		   	var dateUpdated = element['gsx$dateupdated']['$t']    
			   	chartData.push([
			   		country, 
			   		population,
			   		returnHTMLToolTip(country, population, percentOfWorld, dateUpdated) 
			   		]);	   	
			   
		   });
		   chart.rows = chartData;
		}
   
  });

  sheet.addEventListener('error', function(e) {
   // e.detail.response
  });

  function returnHTMLToolTip(country, population, percentage, updated) {

	var tooltip = '<div style="border:1px solid black">';
	tooltip += 'Country:' + '<b>'+country+'</b>' + '<br>' +
					'Population: ' + '<b>'+population+'</b>' + '<br>' +
					'Percentage of World: ' + '<b>'+percentage+'</b>' + '<br>' +
					'Last Updated: ' + '<b>'+updated+'</b>';
	tooltip += '</div>';

  	return tooltip;
  }
})(document);









