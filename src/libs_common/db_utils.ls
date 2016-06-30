if IS_CONTENT_SCRIPT
  module.exports = require('libs_frontend/db_utils.ls')
else
  module.exports = require('libs_backend/dexie_utils.ls')
