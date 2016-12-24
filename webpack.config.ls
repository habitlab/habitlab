require! {
  path
  process
  webpack
  fs
}

cwd = process.cwd()

npmdir = (x) ->
  path.join(cwd, 'node_modules', x)

npmdir_jspm = (x) ->
  path.join(cwd, 'src', 'jspm_packages', 'npm', x)

npmdir_custom = (x) ->
  path.join(cwd, 'src', 'node_modules_custom', x)


fromcwd = (x) ->
  path.join(cwd, x)

webpack_config = {
  #devtool: 'eval-cheap-module-source-map'
  devtool: 'cheap-module-source-map'
  #devtool: 'linked-src'
  #devtool: null
  debug: true
  watch: false
  plugins: [
    # new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    new webpack.optimize.DedupePlugin()
  ]
  module: {
    loaders: [
        {
          test: /\.html$/
          loader: 'html-loader?attrs=false'
        }
        {
          # asset loader
          test: /\.(woff|woff2|ttf|eot)$/,
          loader: 'file-loader?name=[path][name]'
        }
        {
          # image loader
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader:'file-loader?name=[path][name]'
        }
        {
          # html loader
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader:'file-loader?name=[path][name]'
        }
        # {
        #  test: /\.ls$/
        #  # livescript with embedded jsx
        #  # need the linked-src option according to
        #  # https://github.com/appedemic/livescript-loader/issues/10
        #  loader: 'babel-loader!livescript-loader?map=linked-src'
        #  include: [fromcwd('src/components_skate')]
        #  exclude: [
        #    fromcwd('node_modules')
        #    fromcwd('bower_components')
        #  ]
        # }
        {
          test: /\.ls$/
          loader: 'livescript-loader'
          include: [fromcwd('src')]
          exclude: [
            fromcwd('src/components_skate')
            fromcwd('node_modules')
            fromcwd('bower_components')
          ]
        }
        # {
        #  test: /\.jsx$/
        #  loader: 'babel-loader'
        #  include: [fromcwd('src')]
        #  exclude: [
        #    fromcwd('node_modules')
        #    fromcwd('bower_components')
        #  ]
        # }
    ]
  }
  resolve: {
    moduleDirectories: ['node_modules']
    extensions: [
      ''
      # '.jsx'
      '.ls'
      '.js'
    ]
    alias: {
      'prelude': npmdir 'prelude-ls'
    }
    fallback: [
      fromcwd('src')
    ]
  }
  node: {
    fs: 'empty'
  }
}

/*
for libname in fs.readdirSync 'src/jspm_packages/npm'
  if libname.endsWith('.json')
    continue
  libname_base = libname.split('@')[0]
  webpack_config.resolve.alias[libname_base] = npmdir_jspm libname
*/

for libname in fs.readdirSync 'src/node_modules_custom'
  webpack_config.resolve.alias[libname] = npmdir_custom libname

module.exports = webpack_config
