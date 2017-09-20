module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-execute');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            cache: '.cache',
            src: {
                js: 'js',
                css: 'css',
                templates: 'templates'
            },
            public: {
                js: 'public/js',
                css: 'public/css'
            }
        },

        browserify: {
            ui: {
                options: { transform: [ 'babelify'] },
                files: {
                    '<%= dirs.public.js %>/base.js': ['<%= dirs.src.js %>/ui/base/index.es6.js'],
                    '<%= dirs.public.js %>/trackers.js': ['<%= dirs.src.js %>/ui/pages/trackers.es6.js'],
                    '<%= dirs.public.js %>/options.js': ['<%= dirs.src.js %>/ui/pages/options.es6.js'],
                }
            },
            background: {
                options: { transform: [ 'babelify'] },
                files: {
                    '<%= dirs.src.js %>/abp.js': ['<%= dirs.src.js %>/abp-preprocessed.es6.js'],
                    '<%= dirs.src.js %>/url-parse.js': ['<%= dirs.src.js %>/url-parse.es6.js']
                    '<%= dirs.src.js %>/indexed-db.js': ['<%= dirs.src.js %>/indexed-db.es6.js'],
                    '<%= dirs.src.js %>/https.js': ['<%= dirs.src.js %>/https.es6.js'],
                    '<%= dirs.src.js %>/utils.js': ['<%= dirs.src.js %>/utils.es6.js'],
                    '<%= dirs.src.js %>/load.js': ['<%= dirs.src.js %>/load.es6.js'],
                    '<%= dirs.src.js %>/settings.js': ['<%= dirs.src.js %>/settings.es6.js'],
                    '<%= dirs.src.js %>/trackerLists.js': ['<%= dirs.src.js %>/trackerLists.es6.js'],
                    '<%= dirs.src.js %>/trackers.js': ['<%= dirs.src.js %>/trackers.es6.js']
                }
            }
        },

        sass: {
            dist: {
                files: {
                    '<%= dirs.public.css %>/noatb.css': ['<%= dirs.src.css %>/noatb.scss'],
                    '<%= dirs.public.css %>/base.css': ['<%= dirs.src.css %>/base/base.scss'],
                    '<%= dirs.public.css %>/trackers.css': ['<%= dirs.src.css %>/trackers.scss'],
                    '<%= dirs.public.css %>/options.css': ['<%= dirs.src.css %>/options.scss']
                }
            }
        },

        execute: {
            preProcessLists: {
                src: ['scripts/buildLists.js', 'scripts/buildEntityMap.js']
            },
            tosdr: {
                src: ['scripts/tosdr.js']
            }
        },

        watch: {
            css: {
                files: ['<%= dirs.src.css %>/**/*.scss'],
                tasks: ['sass']
            },
            ui: {
                files: ['<%= dirs.src.js %>/ui/**/*.es6.js'],
                tasks: ['browserify:ui']
            },
            background: {
                files: ['<%= dirs.src.js %>/*.es6.js'],
                tasks: ['browserify:background']
            }
        }
    });

    grunt.registerTask('build', 'Build project(s)css, templates, js', ['sass', 'browserify', 'execute:preProcessLists']);
    grunt.registerTask('dev', 'Build and watch files for development', ['build', 'watch']);
    grunt.registerTask('default', 'build');
}
