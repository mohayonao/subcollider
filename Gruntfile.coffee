module.exports = (grunt)->
  'use strict'

  GRUNT_CHANGED_PATH = '.grunt-changed-file'
  if grunt.file.exists GRUNT_CHANGED_PATH
    changed = grunt.file.read GRUNT_CHANGED_PATH
    grunt.file.delete GRUNT_CHANGED_PATH    
    changed_only = (file)-> file is changed
  else
    changed_only = (file)-> true

  grunt.initConfig
    connect:
      server:
        options:
          port: 3000
          base: '.'
          hostname: '0.0.0.0'
    watch:
      src:
        files: 'src/**/*.js'
        tasks: ['jshint', 'concat', 'nodeunit']
      test:
        files: 'test/*.coffee'
        tasks: 'nodeunit'
    jshint:
      src:
        expand: true
        src   : 'src/**/*.js'
        filter: changed_only
      options:
        curly   : true
        eqeqeq  : true
        latedef : true
        noarg   : true
        noempty : true
        quotmark: 'double'
        undef   : true
        strict  : true
        trailing: true
        newcap  : false
        browser : true
        node    : true
        predef  : ['sc']
    concat:
      src:
        src : ['src/sc.js', 'src/lib/*.js']
        dest: 'build/subcollider.js'
    uglify:
      prototype:
        src : 'build/subcollider.js'
        dest: 'build/subcollider-min.js'
        options:
          sourceMap: 'build/subcollider-min.map'
    nodeunit:
      prototype:
        src: 'test/*.coffee'

  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-nodeunit'  
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.event.on 'watch', (action, changed)->
    grunt.file.write GRUNT_CHANGED_PATH, changed
  
  grunt.registerTask 'default', ['connect', 'watch']
  grunt.registerTask 'build'  , ['jshint', 'concat', 'nodeunit', 'uglify']
