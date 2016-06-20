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
  'gulp-vulcanize'
  'gulp-crisper'
  'del'
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

eslintpattern = [
  'src/**/*.js'
  'src_gen/**/*.js'
  '!src/bower_components/**/*.js'
  '!src_gen/bower_components/**/*.js'
]

jspattern_srcgen = [
  'src/**/*.js'
]

htmlpattern_srcgen = [
  'src/**/*.html'
]

copypattern = [
  'src/**/*.html'
  'src/**/*.png'
  'src/*.js'
  'src/bower_components/**/*'
  '!src/components/components.html'
]

webpack_pattern = [
  'src/interventions/**/*.ls'
  'src/interventions/**/*.js'
  'src/backend/**/*.ls'
  'src/backend/**/*.js'
  'src/commonjs_compat/**/*.ls'
  'src/commonjs_compat/**/*.js'
]

webpack_vulcanize_pattern = [
  'src_vulcanize/components/components.js'
]

vulcanize_html_pattern = [
  'src_gen/components/components.html'
]

vulcanize_html_output_pattern = [
  'src_vulcanize/components/components.html'
]

vulcanize_watch_pattern = [
  'src/components/**/*.html'
  'src/components/**/*.js'
  'src/components/**/*.ls'
]

gulp.task 'eslint', ['livescript_srcgen', 'js_srcgen'] ->
  gulp.src(eslintpattern, {base: 'src'})
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
      'global_exports': true
      'Polymer': true
      'jsyaml': true
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

gulp.task 'livescript_srcgen', ->
  gulp.src(lspattern_srcgen, {base: 'src'})
  .pipe(gulp-changed('src_gen', {extension: '.js'}))
  #.pipe(gulp-print( -> "livescript_srcgen: #{it}" ))
  .pipe(gulp-livescript({bare: false}))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('src_gen'))

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

run_gulp_webpack = (myconfig, options) ->
  options ?= {}
  {src_pattern, src_base} = options
  src_pattern ?= webpack_pattern
  src_base ?= 'src'
  current_dir = process.cwd()
  return gulp.src(src_pattern, {base: src_base})
  #.pipe(gulp-changed('dist', {extension: '.js', hasChanged: empty_or_updated}))
  .pipe(gulp-print( -> "webpack: #{it}" ))
  .pipe(vinyl-named( (file) ->
    relative_path = path.relative(path.join(current_dir, src_base), file.path)
    relative_path_noext = relative_path.replace(/\.js$/, '').replace(/\.ls$/, '')
    return relative_path_noext
  ))
  .pipe(webpack-stream(myconfig))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('dist'))

with_created_object = (orig_obj, func_to_apply) ->
  new_obj = Object.create(orig_obj)
  func_to_apply(new_obj)
  return new_obj

webpack_config_watch = with_created_object webpack_config, (o) ->
  o.watch = true

webpack_config_nowatch = with_created_object webpack_config, (o) ->
  o.watch = false

webpack_config_nosrcmap_watch = with_created_object webpack_config, (o) ->
  o.watch = true
  o.devtool = null

webpack_config_nosrcmap_nowatch = with_created_object webpack_config, (o) ->
  o.watch = false
  o.devtool = null

webpack_config_prod_nowatch = with_created_object webpack_config, (o) ->
  o.watch = false
  o.devtool = null
  o.debug = false
  o.module.loaders.push {
    test: /\.js$/
    loader: 'uglify-loader'
    exclude: [fromcwd('src')]
  }

gulp.task 'webpack_vulcanize', ['copy_vulcanize'], ->
  run_gulp_webpack webpack_config_nosrcmap_nowatch, {
    src_pattern: webpack_vulcanize_pattern
    src_base: 'src_vulcanize'
  }

gulp.task 'webpack_vulcanize_watch', ['copy_vulcanize'], ->
  run_gulp_webpack webpack_config_nosrcmap_watch, {
    src_pattern: webpack_vulcanize_pattern
    src_base: 'src_vulcanize'
  }

gulp.task 'webpack_vulcanize_prod', ['copy_vulcanize'], ->
  run_gulp_webpack webpack_config_prod_nowatch, {
    src_pattern: webpack_vulcanize_pattern
    src_base: 'src_vulcanize'
  }

# based on
# https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
# https://github.com/shama/webpack-stream
gulp.task 'webpack', ['build_base'], ->
  run_gulp_webpack webpack_config_nowatch

gulp.task 'webpack_watch', ['watch_base'], ->
  run_gulp_webpack webpack_config_watch

gulp.task 'webpack_prod', ['build_base'], ->
  run_gulp_webpack webpack_config_prod_nowatch

gulp.task 'yaml', ->
  return gulp.src(yamlpattern, {base: 'src'})
  .pipe(gulp-changed('dist', {extension: '.json'}))
  .pipe(gulp-print( -> "yaml: #{it}" ))
  .pipe(gulp-yaml({space: 2}))
  .on('error', gulp-util.log)
  .pipe(gulp.dest('dist'))

gulp.task 'copy', ->
  return gulp.src(copypattern, {base: 'src'})
  .pipe(gulp-changed('dist'))
  #.pipe(gulp-print( -> "copy: #{it}" ))
  .pipe(gulp.dest('dist'))

gulp.task 'js_srcgen', ->
  return gulp.src(jspattern_srcgen, {base: 'src'})
  .pipe(gulp-changed('src_gen'))
  #.pipe(gulp-print( -> "js_srcgen: #{it}" ))
  .pipe(gulp.dest('src_gen'))

gulp.task 'html_srcgen', ->
  return gulp.src(htmlpattern_srcgen, {base: 'src'})
  .pipe(gulp-changed('src_gen'))
  #.pipe(gulp-print( -> "html_srcgen: #{it}" ))
  .pipe(gulp.dest('src_gen'))

gulp.task 'vulcanize', ['livescript_srcgen', 'js_srcgen', 'html_srcgen'], ->
  return gulp.src(vulcanize_html_pattern, {base: 'src_gen'})
  .pipe(gulp-vulcanize({
    #abspath: ''
    #excludes: []
    #stripExcludes: false
    inlineScripts: true
    inlineCss: false
  }))
  .pipe(gulp-crisper({
    #scriptInHead: false
    #onlySplit: false
    #jsFileName: 'components.js'
  }))
  .pipe(gulp.dest('src_vulcanize'))

gulp.task 'copy_vulcanize', ['vulcanize'] ->
  return gulp.src(vulcanize_html_output_pattern, {base: 'src_vulcanize'})
  .pipe(gulp.dest('dist'))

tasks_and_patterns = [
  ['livescript', lspattern]
  ['copy_vulcanize', vulcanize_watch_pattern]
  #['typescript', tspattern]
  #['es6', es6pattern]
  ['yaml', yamlpattern]
  #['browserify_js', browserify_js_pattern]
  #['browserify_ls', browserify_ls_pattern]
  ['copy', copypattern]
  #['eslint', eslintpattern]
  #['livescript_browserify', lspattern_browserify]
]

gulp.task 'build_base', tasks_and_patterns.map((.0))

gulp.task 'build', ['webpack', 'webpack_vulcanize']

gulp.task 'release', ['webpack_prod', 'webpack_vulcanize_prod']

# TODO we can speed up the watch speed for browserify by using watchify
# https://github.com/marcello3d/gulp-watchify/blob/master/examples/simple/gulpfile.js
# https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
gulp.task 'watch_base', ['build_base'], ->
  for [task,pattern] in tasks_and_patterns
    gulp.watch pattern, [task]
  return

gulp.task 'lint', ['eslint']

gulp.task 'lint_watch', ['lint'], ->
  gulp.watch eslintpattern, ['lint']

gulp.task 'clean', ->
  del [
    'dist'
    'src_vulcanize'
    'src_gen'
  ]

gulp.task 'watch', ['webpack_watch', 'webpack_vulcanize_watch', 'lint_watch']

gulp.task 'default', ['watch']
