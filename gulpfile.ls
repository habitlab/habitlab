require! {
  'gulp'
  'gulp-changed'
  'gulp-util'
  'gulp-print'
  'gulp-livescript'
}

lspattern = ['app.ls', '*.ls', 'fields/*.ls']
gulp.task 'livescript', ->
  gulp.src(lspattern, {base: './'})
  .pipe(gulp-changed('.', {extension: '.js'}))
  .pipe(gulp-livescript({bare: false}))
  .on('error', gulp-util.log)
  .pipe(gulp-print({colors: false}))
  .pipe(gulp.dest('.'))
  return

gulp.task 'build', ['livescript']

gulp.task 'watch', ->
  gulp.watch lspattern, ['build']

gulp.task 'default', ['build', 'watch']
