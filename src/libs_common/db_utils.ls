if chrome.windows? # is background page
  module.exports = require('libs_backend/dexie_utils.ls')
else
  module.exports = require('libs_frontend/db_utils.ls')
