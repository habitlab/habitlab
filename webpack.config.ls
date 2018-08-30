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
  path.join(cwd, 'src', 'modules_custom', x)


fromcwd = (x) ->
  path.join(cwd, x)

webpack_config = {
  #devtool: 'eval-cheap-module-source-map'
  #devtool: 'cheap-module-source-map'
  devtool: false
  #devtool: 'linked-src'
  #devtool: null
  #debug: true
  #mode: 'production'
  mode: 'development'
  watch: false
  plugins: [
    # new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    # new webpack.optimize.DedupePlugin()
  ]
  module: {
    rules: [
        {
          test: /\.html$/
          loader: 'html-loader?attrs=false&minimize=true'
          exclude: [
            fromcwd('node_modules')
            #fromcwd('src/bower_components')
            fromcwd('src/jspm_packages')
          ]
        }
        {
          # asset loader
          test: /\.(woff|woff2|ttf|eot)$/,
          loader: 'file-loader?name=[path][name]'
          exclude: [
            fromcwd('node_modules')
            fromcwd('src/bower_components')
            fromcwd('src/jspm_packages')
          ]
        }
        {
          # image loader
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader:'file-loader?name=[path][name]'
          exclude: [
            fromcwd('node_modules')
            fromcwd('src/bower_components')
            fromcwd('src/jspm_packages')
          ]
        }
        {
          # js loader
          test: /\.js$/
          loader: './webpack_habitlab_js_intervention_loader.js'
          include: [fromcwd('src/interventions')]
          exclude: [
            fromcwd('node_modules')
            fromcwd('src/bower_components')
            fromcwd('src/jspm_packages')
          ]
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
          loader: './webpack_habitlab_ls_intervention_loader.js'
          include: [fromcwd('src/interventions')]
          exclude: [
            fromcwd('node_modules')
            fromcwd('src/bower_components')
            fromcwd('src/jspm_packages')
          ]
        }
        {
          test: /\.ls$/
          loader: 'livescript-async-loader'
          include: [fromcwd('src')]
          exclude: [
            fromcwd('node_modules')
            fromcwd('src/bower_components')
            fromcwd('src/jspm_packages')
            fromcwd('src/interventions')
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
    unsafeCache: true
    modules: [
      fromcwd('src')
      'node_modules'
    ]
    extensions: [
      #''
      # '.jsx'
      '.ls'
      '.js'
    ]
    alias: {
    }
  }
  node: {
    fs: 'empty'
  }
<<<<<<< Updated upstream
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
=======
  # optimization: {
  #   splitChunks: {
  #     chunks: 'all'
  #   }
  # }
>>>>>>> Stashed changes
}

/*
for libname in fs.readdirSync 'src/jspm_packages/npm'
  if libname.endsWith('.json')
    continue
  libname_base = libname.split('@')[0]
  webpack_config.resolve.alias[libname_base] = npmdir_jspm libname
*/

for libname in fs.readdirSync 'src/modules_custom'
  webpack_config.resolve.alias[libname] = npmdir_custom libname

module.exports = webpack_config
