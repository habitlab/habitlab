if (!window.SystemJS) {
  require('script-loader!jspm_packages/system.js')
  require('../systemjs_paths.js')
  require('../../jspm.config.js')
  if (!chrome.windows) { // is content script
    require('../../jspm_config_frontend.js')
  } else {
    require('../../jspm_config_backend.js')
  }
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
