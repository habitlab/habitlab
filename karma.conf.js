require('livescript')

webpack_config = require('./webpack_config_test.ls')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/**/*.ls'
    ],
    exclude: [
    ],
    preprocessors: {
      'test/**/*.ls': ['webpack']
    },
    webpack: webpack_config,
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    //browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
  })
}
