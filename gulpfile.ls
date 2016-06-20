require! {
  'livescript'
  'livescript-loader'
  'gulp'
  'gulp-changed'
  'gulp-util'
  'gulp-print'
  'gulp-livescript'
  'gulp-yaml'
  'gulp-eslint'
  'path'
  'fs'
  'webpack-stream'
  'vinyl-named'
  'webpack'
}

webpack_config = require './webpack.config.ls'

lspattern = [
  'src/*.ls'
  'src/fields/*.ls'
  'src/libs_frontend/**/*.ls'
  'src/libs_common/**/*.ls'
  'src/libs_backend/**/*.ls'
]

lspattern_srcgen = [
  'src/**/*.ls'
]

yamlpattern = [
  'src/manifest.yaml'
  'src/interventions/**/*.yaml'
  'src/fields/**/*.yaml'
]

eslintpattern_frontend = [
  'src/libs_frontend/**/*.js'
  'src/libs_common/**/*.js'
  'src/libs_backend/**/*.js'
  'src/interventions/**/*.js'
  'src/fields/**/*.js'
  'src/backend/**/*.js'
  'src/commonjs_compat/**/*.js'
  'src_gen/libs_frontend/**/*.js'
  'src_gen/libs_common/**/*.js'
  'src_gen/libs_backend/**/*.js'
  'src_gen/interventions/**/*.js'
  'src_gen/fields/**/*.js'
  'src_gen/backend/**/*.js'
  'src_gen/commonjs_compat/**/*.js'
]

jspattern_srcgen = [
  'src/**/*.js'
]

copypattern = [
  'src/**/*.html'
  'src/**/*.png'
  'src/*.js'
  'src/bower_components/**/*'
]

webpack_pattern = [
  'src/interventions/**/*.ls'
  'src/interventions/**/*.js'
  'src/backend/**/*.ls'
  'src/backend/**/*.js'
  'src/commonjs_compat/**/*.ls'
  'src/commonjs_compat/**/*.js'
]

gulp.task 'eslint_frontend', ->
  gulp.src(eslintpattern_frontend, {base: 'src'})
  #.pipe(gulp-print( -> "eslint_frontend: #{it}" ))
  .pipe(gulp-eslint({
    #parser: 'babel-eslint'
    parserOptions: {
      sourceType: 'script'
      ecmaVersion: 6
      ecmaFeatures: {
        'impliedStrict': true
      }
    }
    extends: 'eslint:recommended'
    envs: [
      'es6'
      'browser'
      'webextensions'
      #'node'
    ]
    globals: {
      #'$': true
      'require': true
      'env': true
      'exports': true
    }
    rules: {
      'no-console': 'off'
      'no-unused-vars': 'off'
      #'no-unused-vars': ['warn', {args: 'none', vars: 'local'}]
      'comma-dangle': ['warn', 'only-multiline']
      #'strict': 2
    }
  }))
  .pipe(gulp-eslint.formatEach('compact', process.stderr))

gulp.task 'livescript', ->
  gulp.src(lspattern, {base: 'src'})
  .pipe(gulp-changed('dist', {extension: '.js'}))
  .pipe(gulp-print( -> "livescript: #{it}" ))
  .pipe(gulp-livescript({bare: false}))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('dist'))
  return

gulp.task 'livescript_srcgen', ->
  gulp.src(lspattern_srcgen, {base: 'src'})
  .pipe(gulp-changed('src_gen', {extension: '.js'}))
  #.pipe(gulp-print( -> "livescript_srcgen: #{it}" ))
  .pipe(gulp-livescript({bare: false}))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('src_gen'))
  return

empty_or_updated = (stream, cb, sourceFile, targetPath) ->
  if not fs.existsSync(targetPath)
    stream.push sourceFile
    return cb!
  if fs.statSync(targetPath).size == 0
    stream.push sourceFile
    return cb!
  return gulp-changed.compareLastModifiedTime(stream, cb, sourceFile, targetPath)

fromcwd = (x) ->
  path.join(process.cwd(), x)

run_gulp_webpack = (myconfig) ->
  current_dir = process.cwd()
  gulp.src(webpack_pattern, {base: 'src'})
  #.pipe(gulp-changed('dist', {extension: '.js', hasChanged: empty_or_updated}))
  .pipe(gulp-print( -> "webpack: #{it}" ))
  .pipe(vinyl-named( (file) ->
    relative_path = path.relative(path.join(current_dir, 'src'), file.path)
    relative_path_noext = relative_path.replace(/\.js$/, '').replace(/\.ls$/, '')
    return relative_path_noext
  ))
  .pipe(webpack-stream(myconfig))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('dist'))

# based on
# https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
# https://github.com/shama/webpack-stream
gulp.task 'webpack', ->
  myconfig = Object.create webpack_config
  myconfig.watch = false
  run_gulp_webpack myconfig

gulp.task 'webpack_watch', ->
  myconfig = Object.create webpack_config
  myconfig.watch = true
  run_gulp_webpack myconfig

gulp.task 'webpack_prod', ->
  myconfig = Object.create webpack_config
  myconfig.devtool = null
  myconfig.debug = false
  myconfig.watch = false
  #myconfig.plugins.push new webpack.optimize.UglifyJsPlugin()
  myconfig.module.loaders.push {
    test: /\.js$/
    loader: 'uglify-loader'
    exclude: [fromcwd('src')]
  }
  run_gulp_webpack myconfig

gulp.task 'yaml', ->
  gulp.src(yamlpattern, {base: 'src'})
  .pipe(gulp-changed('dist', {extension: '.json'}))
  .pipe(gulp-print( -> "yaml: #{it}" ))
  .pipe(gulp-yaml({space: 2}))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('dist'))
  return

gulp.task 'copy', ->
  gulp.src(copypattern, {base: 'src'})
  .pipe(gulp-changed('dist'))
  #.pipe(gulp-print( -> "copy: #{it}" ))
  .pipe(gulp.dest('dist'))
  return

gulp.task 'js_srcgen', ->
  gulp.src(jspattern_srcgen, {base: 'src'})
  .pipe(gulp-changed('src_gen'))
  #.pipe(gulp-print( -> "js_srcgen: #{it}" ))
  .pipe(gulp.dest('src_gen'))
  return


tasks_and_patterns = [
  ['livescript', lspattern]
  ['livescript_srcgen', lspattern_srcgen]
  #['js_srcgen', jspattern_srcgen]
  #['typescript', tspattern]
  #['es6', es6pattern]
  ['yaml', yamlpattern]
  #['browserify_js', browserify_js_pattern]
  #['browserify_ls', browserify_ls_pattern]
  ['copy', copypattern]
  ['eslint_frontend', eslintpattern_frontend]
  #['livescript_browserify', lspattern_browserify]
]

gulp.task 'build_base', tasks_and_patterns.map((.0))

gulp.task 'build', ['build_base', 'webpack']

gulp.task 'release', ['build_base', 'webpack_prod']

# TODO we can speed up the watch speed for browserify by using watchify
# https://github.com/marcello3d/gulp-watchify/blob/master/examples/simple/gulpfile.js
# https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
gulp.task 'watch_base' ->
  for [task,pattern] in tasks_and_patterns
    gulp.watch pattern, [task]
  return

gulp.task 'watch', ['build_base', 'watch_base', 'webpack_watch']

gulp.task 'default', ['build_base', 'watch_base', 'webpack_watch']
