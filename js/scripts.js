	'use strict';

	var chart = document.getElementById('myChart');
	var countrySelect = document.getElementById('countrySelect');
	var sortBox = document.getElementById('sortBox');
	var activeCheckboxes = [];

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

	// +1 for ascending, -1 for descending
	var sortType = -1;

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
	   		   	activeCheckboxes.push(1);
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
	}
	activeCheckboxes[index] = 1 - activeCheckboxes[index];
	
  

  };

  function sortData(category) {
  
  	var currentData = [];

  	for (var i = 0; i < activeCheckboxes.length; i++) {
  		if (activeCheckboxes[i] === 1) {
  			currentData.push(sheet.rows[i]);
  		}
  		
  	}
 	
  	currentData.sort(function(a,b){
  		var firstItem = a['gsx$'+category]['$t'];
		var secondItem = b['gsx$'+category]['$t'];
		
		if(moment(firstItem, 'DD/MM/YYYY', true).format() !== 'Invalid date' && moment(secondItem, 'DD/MM/YYYY', true).format() !== 'Invalid date') {
			var firstDate = moment(firstItem, 'DD/MM/YYYY', true).format();
			var secondDate = moment(secondItem, 'DD/MM/YYYY', true).format();

			if (secondDate > firstDate) {
				if (sortType === -1) {
					return 1;
				}
				else if (sortType === 1) {
					return -1;
				}
				
			}
			else if (secondDate === firstDate) {
				return 0;
			}
			else {
				if (sortType === -1) {
					return -1;
				}
				else if (sortType === 1) {
					return 1;
				}
				
			}
		}

  		else if (!isNaN(parseInt(firstItem)) && !isNaN(parseInt(secondItem))) { 
  				var firstNum = parseInt(firstItem.replace(/,/g,''));
				var secondNum = parseInt(secondItem.replace(/,/g,''));
				if (sortType === -1) {
					return (secondNum - firstNum);
				}
				else if (sortType === 1) {
					return (firstNum - secondNum);
				}
				
  			
  		}
  		else if (typeof firstItem === 'string' && typeof secondItem === 'string'){ 	
  			if (sortType === -1) {  				
  				return -1*(firstItem.toLowerCase().localeCompare(secondItem.toLowerCase()));
  			}
  			else if (sortType === 1) {
  				return firstItem.toLowerCase().localeCompare(secondItem.toLowerCase());
  				
  			}		
  			
  		}  		
  	});


  	var sortedChartData = [];
  	for (var j = 0; j < currentData.length; j++) {
  		sortedChartData.push(formatData(currentData[j]));	
  	}
 

  	chart.rows = [];
  	chart.rows = sortedChartData;

  	
  };
  countrySelect.addEventListener('change', function(e) {  		
  		toggleCountry(e.target);
  		sortData(selectedCategory);
  			
  			
  });
  sortBox.addEventListener('change', function(e){  	
  		if (e.target.name.toLowerCase() === 'descending') {
  			sortType = -1;
  		}
  		else if (e.target.name.toLowerCase() === 'ascending') {
  			sortType = 1;
  		}
  		else {
  			selectedCategory = e.target.name.toLowerCase(); 
  		}  		  	
  		sortData(selectedCategory);
  });








