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
    ]
  }
  resolve: {
    moduleDirectories: ['node_modules']
    extensions: [
      ''
      '.ls'
      '.js'
    ]
    alias: {
      'zepto': npmdir 'npm-zepto'
      'prelude': npmdir 'prelude-ls'
    }
    fallback: [
      fromcwd('src')
    ]
  }
}
