require! {
  path
  process
}

cwd = process.cwd()

npmdir = (x) ->
  return path.join(cwd, 'node_modules', x)

module.exports = {
  devtool: 'sourcemap'
  debug: true
  watch: true
  module: {
    loaders: [
        {
          test: /\.ls$/
          loader: "livescript-loader"
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
      #'zepto': npmdir('npm-zepto')
    }
    fallback: [
      path.join(process.cwd(), 'src')
    ]
  }
}
