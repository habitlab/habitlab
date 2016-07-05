require! {
  path
  process
}

cwd = process.cwd()

npmdir = (x) ->
  path.join(cwd, 'node_modules', x)

fromcwd = (x) ->
  path.join(cwd, x)

module.exports = {
  devtool: 'eval-cheap-module-source-map'
  debug: true
  watch: true
  plugins: []
  module: {
    loaders: [
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
        {
          test: /\.ls$/
          # livescript with embedded jsx
          # need the linked-src option according to
          # https://github.com/appedemic/livescript-loader/issues/10
          loader: 'babel-loader!livescript-loader?map=linked-src'
          include: [fromcwd('src/components_skate')]
          exclude: [
            fromcwd('node_modules')
            fromcwd('bower_components')
          ]
        }
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
        {
          test: /\.jsx$/
          loader: 'babel-loader'
          include: [fromcwd('src')]
          exclude: [
            fromcwd('node_modules')
            fromcwd('bower_components')
          ]
        }
    ]
  }
  resolve: {
    moduleDirectories: ['node_modules']
    extensions: [
      ''
      '.jsx'
      '.ls'
      '.js'
    ]
    alias: {
      'zepto': npmdir 'npm-zepto'
      'prelude': npmdir 'prelude-ls'
      'skatejs': npmdir 'skatejs1'
    }
    fallback: [
      fromcwd('src')
    ]
  }
  node: {
    fs: 'empty'
  }
}
