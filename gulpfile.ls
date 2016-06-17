require! {
  'gulp'
  'gulp-changed'
  'gulp-util'
  'gulp-print'
  'gulp-babel'
  'gulp-livescript'
  'gulp-yaml'
  'gulp-eslint'
}

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
  'interventions/**/*.js'
]

gulp.task 'eslint_frontend', ->
  gulp.src(eslintpattern_frontend, {base: './'})
  .pipe(gulp-eslint({
    parser: 'babel-eslint'
    parserOptions: {
      sourceType: 'script'
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
      'no-console': 0
      'no-unused-vars': 0
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

gulp.task 'livescript', ->
  gulp.src(lspattern, {base: './'})
  .pipe(gulp-changed('.', {extension: '.js'}))
  .pipe(gulp-livescript({bare: false}))
  .on('error', gulp-util.log)
  .pipe(gulp-print({colors: false}))
  .pipe(gulp.dest('.'))
  return

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
  #['es6', es6pattern]
  ['yaml', yamlpattern]
  ['eslint_frontend', eslintpattern_frontend]
]

gulp.task 'build', tasks_and_patterns.map((.0))

gulp.task 'watch', ->
  for [task,pattern] in tasks_and_patterns
    gulp.watch pattern, [task]
  return

gulp.task 'default', ['build', 'watch']
