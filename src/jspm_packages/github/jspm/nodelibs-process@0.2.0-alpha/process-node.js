var productionEnv = require('@system-env').production;
var process = require('@node/process');
var pEnv = process.env;
pEnv.NODE_ENV = productionEnv ? 'production' : 'development';
module.exports = process;