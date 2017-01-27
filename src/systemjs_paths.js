SystemJS.config({
  baseURL: chrome.extension.getURL('/'),
  packages: {
    '.': {}
  },
  browserConfig: {
    baseURL: chrome.extension.getURL('/'),
    paths: {
      'npm:': chrome.extension.getURL("/jspm_packages/npm/"),
      'github:': chrome.extension.getURL("/jspm_packages/github/")
    }
  }
})
