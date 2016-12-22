if (!window.SystemJS) {
  require('script!jspm_packages/system.js')
  require('../systemjs_paths.js')
  require('../../jspm.config.js')
  if (!chrome.windows) { // is content script
    require('../../jspm_config_frontend.js')
  } else {
    require('../../jspm_config_backend.js')
  }
}
