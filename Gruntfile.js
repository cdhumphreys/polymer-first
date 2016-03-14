module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		connect: {
	    	server: {
		      options: {
		        port: 8000,
		        base: 'index.html',
		        livereload: true,
		        open: true,
		        hostname: 'localhost',
		        base: '.'
		      }
		    }
		},		
		watch: {
			options: {
				livereload: true
			},
			files: ['./*.html'],
			js: {
			    files: ['js/*.js']
		  	},
		  	css: {
		  		files: ['css/*.css']
		  	}
		}
	});

	grunt.registerTask('default',['connect', 'watch']);
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
};