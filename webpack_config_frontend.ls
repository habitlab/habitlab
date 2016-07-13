require! {
  livescript
  deepcopy
  webpack
}

webpack_config = deepcopy require './webpack.config.ls'

{get_alias_info} = require './alias_utils.ls'

for lib_info in get_alias_info()
  webpack_config.resolve.alias[lib_info.path] = lib_info.frontend

webpack_config.plugins.push new webpack.DefinePlugin {
  IS_CONTENT_SCRIPT: true
}

module.exports = webpack_config
