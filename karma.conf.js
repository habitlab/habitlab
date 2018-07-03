require('livescript-async')

webpack_config = require('./webpack_config_test.ls')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/**/*.ls',
      'test/**/*.js'
    ],
    exclude: [
    ],
    preprocessors: {
      'test/**/*.ls': ['webpack'],
      'test/**/*.js': ['webpack']
    },
    webpack: webpack_config,
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    //browsers: ['Chrome'],
    //browsers: ['PhantomJS'],
    browsers: ['Chrome_without_security'], // You may use 'ChromeCanary' or 'Chromium' as well
    // you can define custom flags
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },
    singleRun: false,
    concurrency: Infinity,
  })
}
