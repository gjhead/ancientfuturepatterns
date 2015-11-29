module.exports = function(grunt) {
 
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
	// Run Sass to compile all of our CSS
	sass: {            
      dist: {
        options: {
          style: 'nested' // compact, compressed, nested or expanded
        },
        files: {
          'source/a/pre-css/screen-pre.css' : 'source/a/sass/screen.scss'
        }
      }                  
    },
    
    // Run Autoprefixer on our css after sass compile, then move it to css dir.
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'})        
        ]
      },
      
      dist: {
        src: 'source/a/pre-css/screen-pre.css',
        dest: 'source/assets/style.css'
      }
    },
    
    // Make sure any custom js is not stupid, then concatonate stuffs
    jshint: {
      beforeuglify: 'source/a/js/script.js'
    },
    
    uglify: {      
      dist: {        
        files: {
          'source/assets/jquery-min.js' : 'source/a/js/jquery/jquery-2.1.4.js',
          'source/assets/script-min.js' : ['source/a/js/plugins/*.js', 'source/a/js/script.js']          
        }        
      }      
    }, 
    
    // Generate Pattern Lab
   shell: {
	  patternlab: {
	    command: "php core/builder.php -g"
	  }
	},
    
    // Watch options: what tasks to run when changes to files are saved
    watch: {
      options: {
        livereload: true
      },
      
		html: {
			files: ['source/_patterns/**/*.mustache', 'source/_patterns/**/*.json', 'source/_data/*.json'],
			tasks: ['shell:patternlab']			
		},
		
		sass: {
	        files: ['source/a/sass/**/*.scss'],
	        tasks: ['sass']
	    },
	      
	    postcss: {
	        files: ['source/a/pre-css/screen-pre.css'],
	        tasks: ['postcss', 'shell:patternlab']
	    },
	    
	    jstest: {
	        files: ['source/a/js/script.js'],
	        tasks: ['jshint']
	    },
	      
	    jsmin: {
	        files: ['source/a/js/**/*.js'], // Watch for changes in JS files except for script.min.js to avoid reload loops
	        tasks: ['uglify', 'shell:patternlab']
	    }
	}    

  });
 
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('default', ['sass', 'postcss', 'jshint', 'uglify', 'shell:patternlab', 'watch']);
  
};
