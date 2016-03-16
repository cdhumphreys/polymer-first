	'use strict';

	var chart = document.getElementById('myChart');
	var countrySelect = document.getElementById('countrySelect');
	var sortBox = document.getElementById('sortBox');

	var checkPopulated = false;

	chart.type='column';
	chart.options = {
			title:'World Populations',
			legend: {position: 'right'},
			tooltip: {isHtml: true}
			// animation: {duration: 500}
	};
	chart.rows = [];

	var chartData = [];
	var selectedCategory = 'population';


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
	   		// Get column names
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
  	// console.log('toggling country');
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
	}
	sortData(selectedCategory);
	chart.drawChart();
  

  };

  function getActiveDataIndices() {
  	var activeIndices = [];
  	var checkboxes = document.querySelectorAll('paper-checkbox');
  	for (var i = 0; i < checkboxes.length; i++) {
  		if (checkboxes[i].checked) {
  			activeIndices.push(checkboxes[i].index);
  		}
  	}
  	return activeIndices;
  };

  function sortData(category) {
  
  	var currentData = [];
  	var indices = [];
  	indices = getActiveDataIndices();
  	for (var i = 0; i < indices.length; i++) {
  		currentData.push(sheet.rows[i]);
  	}
 	
  	currentData.sort(function(a,b){
  		var firstItem = a['gsx$'+category]['$t'];
		var secondItem = b['gsx$'+category]['$t'];

  		if (!isNaN(parseInt(firstItem)) && !isNaN(parseInt(secondItem))) { 
  				var firstNum = parseInt(firstItem.replace(/,/g,''));
				var secondNum = parseInt(secondItem.replace(/,/g,''));
  			
  		}
  		else if (typeof firstItem === 'string' && typeof secondItem === 'string'){ 			
  			return firstItem.toLowerCase().localeCompare(secondItem.toLowerCase());
  		}  		
  	});

 

  	var sortedChartData = [];
  	for (var j = 0; j < currentData.length; j++) {
  		sortedChartData.push(formatData(currentData[j]));	
  	}
 

  	chart.rows = [];
  	chart.rows = sortedChartData;
  	chart.drawChart();

  	
  };
// Might have to have an array with all of the possible countries with a variable to serve as active or not
// update this every time there is a click on a country
// search this when sorting as the checkbox state seems to be frozen on the search rather than updating 
// -- this is probably why two way binding is super useful duh
  countrySelect.addEventListener('change', function(e) {  		
  		toggleCountry(e.target);  		
  		sortData(selectedCategory);
  			
  			
  });
  sortBox.addEventListener('change', function(e){
  		selectedCategory = e.target.name.toLowerCase();   	
  		sortData(selectedCategory);
  });








