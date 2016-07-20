System.registerDynamic([
    'jquery',
    'cfy',
    'libs_common/domain_utils',
    'libs_common/time_utils',
    'moment',
], true, function(require, exports, module) {
  module.exports.require = require;
  module.exports.lib_names = [
    'jquery',
    'cfy',
    'libs_common/domain_utils',
    'libs_common/time_utils',
    'moment',
  ];
});
