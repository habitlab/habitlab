SystemJS.config({
  baseURL: chrome.extension.getURL('/'),
  packages: {
    'libs_frontend': {
      defaultExtension: 'js',
    },
    'libs_backend': {
      defaultExtension: 'js',
    },
    'libs_common': {
      defaultExtension: 'js',
    },
    'generated_libs/libs_frontend': {
      defaultExtension: 'js',
    },
    'generated_libs/libs_backend': {
      defaultExtension: 'js',
    },
    'components': {
      defaultExtension: 'js',
    },
    'bugmuncher': {
      defaultExtension: 'js',
    },
    'bower_components': {
      defaultExtension: 'js',
    },
  },
  meta: {
    '*.html': {
      loader: 'text'
    },
    'data:text/html;base64,*': {
      loader: 'text'
    }
  },
  browserConfig: {
    baseURL: chrome.extension.getURL('/'),
    paths: {
      'npm:': chrome.extension.getURL("/jspm_packages/npm/"),
      'github:': chrome.extension.getURL("/jspm_packages/github/")
    }
  }
})
