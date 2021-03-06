// Karma configuration
// Generated on Wed Sep 16 2015 06:17:18 GMT+0200 (CEST)

module.exports = function(config) {

    'use strict';

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            './src/client/js/lib/angular-1.4.6/angular.js',
            './src/client/js/lib/angular-1.4.6/angular-animate.js',
            './src/client/js/lib/angular-1.4.6/angular-mocks.js',
            './src/client/js/app/**/*.module.js',
            './src/client/js/app/**/*.js',
            './src/client/js/app/**/*.html'
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './src/client/js/app/**/*.js': ['jshint', 'jscs'],
            './src/client/js/app/**/!(*.spec).js': 'coverage',
            './src/client/js/app/**/*.html': ['ng-html2js']
        },

        jshintPreprocessor: {
            stopOnError: true
        },

        jscsPreprocessor: {
            configPath: '.jscsrc'
        },

        ngHtml2JsPreprocessor: {

            stripPrefix: 'src/client/',
            prependPrefix: 'apinterest/content/',
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots', 'coverage', 'html'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox', 'PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
