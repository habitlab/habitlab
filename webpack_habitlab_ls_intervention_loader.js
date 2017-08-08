const livescript = require('livescript-async')

module.exports = function(source) {
  let result = livescript.compile(source)
  return "/* habitlab livescript intervention loader */\n\n" + result
}
