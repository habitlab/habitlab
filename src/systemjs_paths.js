SystemJS.config({
  defaultJSExtensions: true,
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
  },
  browserConfig: {
    defaultJSExtensions: true,
    baseURL: chrome.extension.getURL('/'),
    paths: {
      'npm:': chrome.extension.getURL("/jspm_packages/npm/"),
      'github:': chrome.extension.getURL("/jspm_packages/github/")
    }
  }
})
