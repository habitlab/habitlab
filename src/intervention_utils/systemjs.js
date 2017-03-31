(function() {
  if (!window.systemjs_fetch) {
    var {localget, remoteget} = require('libs_frontend/cacheget_utils');
    var chrome_base_url = chrome.runtime.getURL('');
    var is_local_package = function(input) {
      for (var prefix of ['bower_components', 'bundles', 'components', 'frontend_utils', 'generated_libs', 'goals', 'intervention_utils', 'jspm_packages', 'libs_backend', 'libs_common', 'libs_frontend', 'node_modules_custom']) {
        if (input.startsWith(chrome_base_url + prefix + '/')) {
          return true;
        }
      }
      return false;
    }
    window.systemjs_fetch = function(input, init) {
      console.log('systemjs_fetch with input')
      console.log(input)
      if (input.startsWith(chrome_base_url)) {
        if (is_local_package(input)) {
          return localget(input).then(function(text) {
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
  require('script-loader!jspm_packages/system.js');
  require('../systemjs_paths.js');
  require('../../jspm.config.js');
  require('../../jspm_config_frontend.js');
  SystemJS.import_multi = function(libs_list, callback) {
    console.log('systemjs.import_multi being called')
    console.log('libs_list=')
    console.log(libs_list)
    console.log('callback=')
    console.log(callback)
    if (callback) {
      console.log('calling promise.all 1')
      Promise.all(libs_list.map(lib_name => SystemJS.import(lib_name))).then(function(args) {
        console.log('done running imports')
        callback(...args);
      });
    } else {
      console.log('calling promise.all 2')
      return Promise.all(libs_list.map(lib_name => SystemJS.import(lib_name)));
    }
  }
}
