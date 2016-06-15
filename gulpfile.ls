require! {
  'gulp'
  'gulp-changed'
  'gulp-util'
  'gulp-print'
  'gulp-livescript'
  'gulp-yaml'
}

lspattern = ['app.ls', '*.ls', 'fields/*.ls', 'interventions/**/*.ls']

yamlpattern = ['manifest.yaml', 'interventions/**/*.yaml']

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

gulp.task 'build', ['livescript', 'yaml']

gulp.task 'watch', ->
  gulp.watch lspattern, ['livescript']
  gulp.watch yamlpattern, ['yaml']
  return

gulp.task 'default', ['build', 'watch']
