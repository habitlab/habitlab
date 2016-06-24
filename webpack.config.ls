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
  devtool: 'sourcemap'
  debug: true
  watch: true
  plugins: []
  module: {
    loaders: [
        {
          test: /\.ls$/
          loader: "livescript-loader"
          include: [fromcwd('src')]
        }
        {
          test: /\.jsx$/
          loader: 'babel-loader'
          include: [fromcwd('src')]
          query: {
            plugins: [[
              'incremental-dom', {
                prefix: 'skate.vdom.IncrementalDOM'
              }
            ]]
          }
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
