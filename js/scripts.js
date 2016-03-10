(function(document){
	'use strict';

	var chart = document.getElementById('my_chart');

	// chart.type='pie';
	chart.options = {title:'Best Chart Ever'};
	chart.rows = [ ["Bagels", 12], ["Donuts", 5], ["Croissants", 20] ];

})(document);