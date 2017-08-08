const loader_utils = require('loader-utils')

module.exports = function(source) {
  //console.log(loader_utils.getRemainingRequest(this))
  //console.log(loader_utils.getCurrentRequest(this))
  return "/* habitlab javascript intervention loader */\n\n" + source
}
