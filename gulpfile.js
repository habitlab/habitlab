(function(){
  var gulp, gulpChanged, gulpUtil, gulpPrint, gulpLivescript, gulpYaml, lspattern, yamlpattern;
  gulp = require('gulp');
  gulpChanged = require('gulp-changed');
  gulpUtil = require('gulp-util');
  gulpPrint = require('gulp-print');
  gulpLivescript = require('gulp-livescript');
  gulpYaml = require('gulp-yaml');
  lspattern = ['app.ls', '*.ls', 'fields/*.ls', 'interventions/**/*.ls'];
  yamlpattern = ['manifest.yaml', 'interventions/**/*.yaml'];
  gulp.task('livescript', function(){
    gulp.src(lspattern, {
      base: './'
    }).pipe(gulpChanged('.', {
      extension: '.js'
    })).pipe(gulpLivescript({
      bare: false
    })).on('error', gulpUtil.log).pipe(gulpPrint({
      colors: false
    })).pipe(gulp.dest('.'));
  });
  gulp.task('yaml', function(){
    gulp.src(yamlpattern, {
      base: './'
    }).pipe(gulpChanged('.', {
      extension: '.json'
    })).pipe(gulpYaml({
      space: 2
    })).on('error', gulpUtil.log).pipe(gulpPrint({
      colors: false
    })).pipe(gulp.dest('.'));
  });
  gulp.task('build', ['livescript', 'yaml']);
  gulp.task('watch', function(){
    gulp.watch(lspattern, ['livescript']);
    gulp.watch(yamlpattern, ['yaml']);
  });
  gulp.task('default', ['build', 'watch']);
}).call(this);
