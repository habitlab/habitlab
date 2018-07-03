require! {
  path
  process
  livescript
}

RewirePlugin = require 'rewire-webpack'

cwd = process.cwd()

npmdir = (x) ->
  path.join(cwd, 'node_modules', x)

fromcwd = (x) ->
  path.join(cwd, x)

webpack_config = require('./webpack.config.ls')

webpack_config.module.loaders = [
  {
    test: /\.ls$/
    loader: 'livescript-async-loader'
    include: [fromcwd('test'), fromcwd('src')]
    exclude: [
      fromcwd('src/components_skate')
      fromcwd('node_modules')
      fromcwd('bower_components')
    ]
  },
  {
    test: /\.js$/
    #loader: 'null-loader'
    include: [fromcwd('test'), fromcwd('src')]
    exclude: [
      fromcwd('src/components_skate')
      fromcwd('node_modules')
      fromcwd('bower_components')
    ]
  }
]

#webpack_config.plugins.push(new RewirePlugin())

{get_alias_info} = require './alias_utils.ls'

for lib_info in get_alias_info()
  webpack_config.resolve.alias[lib_info.path] = lib_info.backend

module.exports = webpack_config
