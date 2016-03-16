	'use strict';

	var chart = document.getElementById('myChart');
	var countrySelect = document.getElementById('countrySelect');
	var sortBox = document.getElementById('sortBox');

	chart.type='column';
	chart.options = {
			title:'World Populations',
			legend: {position: 'right'},
			tooltip: {isHtml: true}
			// animation: {duration: 500}
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
	   var selectionItems = [];

	   if(!fetched) {
	   	fetched = true;

		   for (var key in this.rows[0]) {
				if (key.includes("gsx")) {
					var category = key.substr(key.indexOf('$')+1)
					category = category[0].toUpperCase() + category.substr(1);
					columnNames.push({category: category});
					
				}				
		   }
		   sortBox.categories = columnNames;
		   // Populate chart data and selection box from spreadsheet data
		   (this.rows).forEach( function(element, index) {
			   
			   	chartData.push(formatData(element));	
	   		   	selectionItems.push({
	   		   		name: element['gsx$country']['$t'],
	   		   		index: index
	   		   	});
		    });
		   chart.rows = chartData;

		   selectionItems.sort(function(a,b){
		   		return (a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
		   });
		   countrySelect.countries = selectionItems;
		}
		
		
   
  });
  sheet.addEventListener('error', function(e) {
	console.log('Error fetching sheet');
  });

  function formatData(element) {
  		var formatted = [];

		var country = element['gsx$country']['$t'];
	   	var population = parseInt(element['gsx$population']['$t'].replace(/,/g,''));
	   	var percentOfWorld = element['gsx$ofworldpopulation']['$t'];
	   	var dateUpdated = element['gsx$dateupdated']['$t'];
	   	
	   	formatted.push(
	   		country,
   			population,
	   		returnHTMLToolTip(country, population, percentOfWorld, dateUpdated)
	   		);

	   	return formatted;

  }

  function returnHTMLToolTip(country, population, percentage, updated) {

	var tooltip = '<div style="border:1px solid black; padding:8px">';
	tooltip += 'Country:' + '<b>'+country+'</b>' + '<br>' +
					'Population: ' + '<b>'+population+'</b>' + '<br>' +
					'Percentage of World: ' + '<b>'+percentage+'</b>' + '<br>' +
					'Last Updated: ' + '<b>'+updated+'</b>';
	tooltip += '</div>';

  	return tooltip;
  };

  function toggleCountry(country) {
  	var index = country.index;
  	var name = country.value;
  	var nowChecked = country.checked;
  	if (!nowChecked) {
	  	var filtered = chart.rows.filter(function(ele){  		
	  		return (ele[0].toUpperCase() != name.toUpperCase());
	  	});
	  	chart.rows = filtered;	  	
	}
	else {
		var newChartData = chart.rows;
		var newData = formatData(sheet.rows[index]);
		
		newChartData.push(newData);
		chart.rows=[];
		chart.rows = newChartData;

		// chart.rows = newData;
	}

	chart.drawChart();
  	// chart.rows = [
  	// ["Mordor", 122, '<div></div>'],
  	// ["Mars", 102, '<div></div>'], 
  	// ["Australia", 5, '<div></div>'],
  	// ["A shed", 1, '<div></div>'] 
  	// ]

  };

  countrySelect.addEventListener('change', function(e) {  		
  		toggleCountry(e.target); 
  		// console.log(e.target.checked) 		
  });










