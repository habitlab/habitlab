if IS_CONTENT_SCRIPT
  module.exports = require('libs_frontend/intervention_utils.ls')
else
  module.exports = require('libs_backend/intervention_utils.ls')
