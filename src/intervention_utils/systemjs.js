(function() {
  if (!window.systemjs_fetch) {
    var {localget} = require('libs_frontend/cacheget_utils');
    var chrome_base_url = chrome.runtime.getURL('');
    window.systemjs_fetch = function(input, init) {
      if (input.startsWith(chrome_base_url)) {
        return localget(input).then(function(text) {
          return new Response(text);
        });
      }
      return fetch(input, init);
    }
  }
})();

if (!window.SystemJS) {
  require('script-loader!jspm_packages/system.js')
  require('../systemjs_paths.js')
  require('../../jspm.config.js')
  require('../../jspm_config_frontend.js');
  SystemJS.import_multi = function(libs_list, callback) {
    if (callback) {
      Promise.all(libs_list.map(lib_name => SystemJS.import(lib_name))).then(function(args) {
        callback(...args);
      });
    } else {
      return Promise.all(libs_list.map(lib_name => SystemJS.import(lib_name)));
    }
  }
}
