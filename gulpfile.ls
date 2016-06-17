require! {
  'gulp'
  'gulp-changed'
  'gulp-util'
  'gulp-print'
  'gulp-babel'
  'gulp-livescript'
  'gulp-typescript'
  'gulp-yaml'
  'gulp-eslint'
  #'browserify-gulp'
  'browserify'
  'browserify-livescript'
  'vinyl-source-stream'
  'vinyl-buffer'
  'gulp-sourcemaps'
  'tsify'
}

tspattern = [
  'interventions/**/*.ts'
]

es6pattern = [
  'interventions/**/*.es6'
]

lspattern = [
  'app.ls'
  '*.ls'
  'fields/*.ls'
  'interventions/**/*.ls'
  'libs_frontend/**/*.ls'
  '!gulpfile.ls'
]

yamlpattern = [
  'manifest.yaml'
  'interventions/**/*.yaml'
]

eslintpattern_frontend = [
  'libs_frontend/**/*.js'
  'interventions/**/*.js'
]

gulp.task 'eslint_frontend', ->
  gulp.src(eslintpattern_frontend, {base: './'})
  .pipe(gulp-eslint({
    parser: 'babel-eslint'
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
      '$': true
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


gulp.task 'es6', ->
  gulp.src(es6pattern, {base: './'})
  .pipe(gulp-changed('.', {extension: '.js'}))
  .pipe(gulp-babel({
    #presets: ['es2015']
    plugins: [
      # this set of plugins will require chrome 51 or higher
      # https://github.com/askmatey/babel-preset-modern

      # the below are required by nodejs 6
      'transform-es2015-modules-commonjs'

      # the below are supported in chrome 52 and higher
      'transform-es2015-destructuring'
      'transform-es2015-function-name'

      # the below are not supported in chrome
      #'transform-exponentiation-operator'
      #'transform-async-to-generator'

      # the below are misc plugins
      #'undeclared-variables-check'
      'transform-strict-mode'
    ]
  }))
  .on('error', gulp-util.log)
  .pipe(gulp-print({colors: false}))
  .pipe(gulp.dest('.'))
  return

gulp.task 'typescript', ->
  gulp.src(tspattern, {base: './'})
  .pipe(gulp-changed('.', {extension: '.js'}))
  .pipe(gulp-typescript({noImplicitAny: true}))
  .on('error', gulp-util.log)
  .pipe(gulp-print({colors: false}))
  .pipe(gulp.dest('.'))
  return

gulp.task 'livescript', ->
  gulp.src(lspattern, {base: './'})
  .pipe(gulp-changed('.', {extension: '.js'}))
  .pipe(gulp-livescript({bare: false}))
  .on('error', gulp-util.log)
  .pipe(gulp-print({colors: false}))
  .pipe(gulp.dest('.'))
  return

# TODO sourcemaps
# https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-multiple-destination.md
/*
gulp.task 'livescript_browserify', ->
  gulp.src(lspattern, {base: './'})
  .pipe(gulp-changed('.', {extension: '.js'}))
  .pipe(gulp-livescript({bare: false}))
  .on('error', gulp-util.log)
  .pipe(gulp-print({colors: false}))
  .pipe(gulp.dest('.'))
  return
*/

/*
# based on
# https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
gulp.task 'livescript_browserify', ->
  return browserify({
    entries: ['./browserify_test/test.ls']
    transform: ['browserify-livescript']
    debug: true
  })
  .bundle()
  .on('error', gulp-util.log.bind(gulp-util, 'Browserify Error'))
  .pipe(vinyl-source-stream('./browserify_test/test.js'))
  .pipe(vinyl-buffer()) # optional, remove if you don't need to buffer file contents
  .pipe(gulp-sourcemaps.init({loadMaps: true})) # optional, remove if you don't want sourcemaps
  .pipe(gulp-sourcemaps.write('.'))
  .pipe(gulp.dest('.'))

gulp.task 'typescript_browserify', ->
  return browserify({
    entries: ['./browserify_test/test.ts']
    debug: true
  })
  .plugin(tsify, {noImplicitAny: false})
  .bundle()
  .on('error', gulp-util.log.bind(gulp-util, 'Browserify Error'))
  .pipe(vinyl-source-stream('./browserify_test/test.js'))
  .pipe(vinyl-buffer()) # optional, remove if you don't need to buffer file contents
  .pipe(gulp-sourcemaps.init({loadMaps: true})) # optional, remove if you don't want sourcemaps
  .pipe(gulp-sourcemaps.write('.'))
  .pipe(gulp.dest('.'))
*/

gulp.task 'yaml', ->
  gulp.src(yamlpattern, {base: './'})
  .pipe(gulp-changed('.', {extension: '.json'}))
  .pipe(gulp-yaml({space: 2}))
  .on('error', gulp-util.log)
  .pipe(gulp-print({colors: false}))
  .pipe(gulp.dest('.'))
  return

tasks_and_patterns = [
  ['livescript', lspattern]
  #['typescript', tspattern]
  #['es6', es6pattern]
  ['yaml', yamlpattern]
  ['eslint_frontend', eslintpattern_frontend]
  #['livescript_browserify', lspattern_browserify]
]

gulp.task 'build', tasks_and_patterns.map((.0))

# TODO we can speed up the watch speed for browserify by using watchify
# https://github.com/marcello3d/gulp-watchify/blob/master/examples/simple/gulpfile.js
# https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
gulp.task 'watch' ->
  for [task,pattern] in tasks_and_patterns
    gulp.watch pattern, [task]
  return

gulp.task 'default', ['build', 'watch']
