if IS_CONTENT_SCRIPT
  module.exports = require('libs_frontend/import_lib')
else
  module.exports = require('libs_backend/import_lib')
