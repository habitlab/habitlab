(function() {
  if (!window.systemjs_fetch) {
    var {systemjsget, remoteget} = require('libs_backend/cacheget_utils');
    var chrome_base_url = chrome.runtime.getURL('');
    var is_local_package = function(input) {
      for (var prefix of ['bower_components', 'bundles', 'components', 'frontend_utils', 'generated_libs', 'goals', 'intervention_utils', 'jspm_packages', 'libs_backend', 'libs_common', 'libs_frontend', 'modules_custom']) {
        if (input.startsWith(chrome_base_url + prefix + '/')) {
          return true;
        }
      }
      return false;
    }
    window.systemjs_fetch = function(input, init) {
      if (input.startsWith(chrome_base_url)) {
        if (is_local_package(input)) {
          return systemjsget(input).then(function(text) {
            return new Response(text);
          });
        } else {
          var npm_package_name = input.replace(chrome_base_url, '');
          var url = 'https://unpkg.com/' + npm_package_name;
          return remoteget(url).then(function(text) {
            return new Response(text);
          })
        }
      }
      return fetch(input, init);
    }
  }
})();

if (!window.SystemJS) {
  require('script-loader!jspm_packages/system.js')
  require('../systemjs_paths.js')
  require('../../jspm.config.js')
  require('../../jspm_config_backend.js');
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
