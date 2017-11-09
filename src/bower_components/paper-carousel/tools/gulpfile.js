// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var reload = setTimeout(function(){ browserSync.reload }, 50);
var path = require('path');
var fs = require('fs');
var gulpPug = require('gulp-pug');
var pug = require('pug');
var chalk = require('chalk');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');

var AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

// Compile modules
var jadeCompile = function(path) {
	gulp.task('jadeModules', function() {
		return gulp.src([path])
			.pipe(
				gulpPug({
					pug: pug,
					pretty: true
				})
				.on('error', function(e) {
					console.log(chalk.red(e));
					this.emit('end');
				})
			)
			.pipe(gulp.dest(function() {
				return path.substr(0, path.lastIndexOf('/source/'));
			}))
			.on('finish', function(){
				browserSync.reload();
			});
	});
	gulp.start('jadeModules');
};

// Compile Sass
var sassCompile = function(path) {
	gulp.task('sass', function() {
		return gulp.src([path])
			.pipe(sass()
				.on('error', function(error) {
					console.log(chalk.red(error));
					this.emit('end');
				})
			)
			.pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
			.pipe(cleanCSS())
			.pipe(gulp.dest(function(file) {
				return file.base;
			}));
	});
	gulp.start('sass');
};

// Compile Coffee
var coffeeCompile = function(path) {
	gulp.task('coffee', function() {
		return gulp.src([path])
			.pipe($.coffee()
				.on('error', function(error) {
					console.log(chalk.red(error));
					this.emit('end');
				})
			)
			.pipe($.uglify())
			.pipe(gulp.dest(function(file) {
				return file.base;
			}));
	});
	gulp.start('coffee');
};

// Watch files for changes & reload
gulp.task('serve', function() {
	// BrowserSync config
	browserSync.init({
		port: 4000,
		logPrefix: 'localhost',
		notify: true,
		logLevel: 'silent',
		startPath: '/paper-carousel/demo/',
		server: {
			baseDir: "../../"
		}
	});

	// Changes fire reload
	$.watch(['../source/*.html', '!../dev/client/elements/**/*.html'], reload);
	$.watch(['../source/*'], reload);

	// HTML Changes
	$.watch(['../*.html', '../*.html'], function(e) {
		if (e.event === 'change') {
			var file = e.history[0].substr(e.history[0].lastIndexOf('/'));
			file = file.substr(0, file.lastIndexOf('.'));
			var folder = e.history[0].substr(e.history[0].indexOf('/source'));
			folder = folder.substr(0, folder.indexOf(file));
			var cssFilepath = '../source' + file + '.css';
			var jsFilepath = '../source' + file + '.js';

			// File compiled announcement
			console.log(chalk.white('--'));
			console.log(chalk.magenta(file.substr(1)), chalk.green('--> Element Compiled!'));
			console.log(chalk.white('--'));
			console.log(chalk.white(' '));

			//remove .css & .js unnecesary file
			var fs = require('fs');
			if (fs.existsSync(cssFilepath) && fs.existsSync(jsFilepath)) {
				fs.unlinkSync(cssFilepath);
				fs.unlinkSync(jsFilepath);
			}

			// Reload Browsers
			browserSync.reload();
		}
	});

	// Source Changes
	$.watch(
		['../source/*.scss', '../source/*.scss',
		'../source/*.coffee', '../source/*.pug'], function(e) {
		if (e.event === 'change') {
			var scssFile = '..' + e.history[0].substr(e.history[0].lastIndexOf('/source'));
			scssFile = scssFile.substr(0, scssFile.lastIndexOf('.')) + '.scss';
			var coffeeFile = '..' + e.history[0].substr(e.history[0].lastIndexOf('/source'));
			coffeeFile = coffeeFile.substr(0, coffeeFile.lastIndexOf('.')) + '.coffee';
			sassCompile(scssFile);
			coffeeCompile(coffeeFile);
		}
	});

	// JS & CSS Changes
	$.watch(
		['../source/*.css'], function(e) {
		if (e.event === 'change' || e.event === 'add') {
			var file = '..' + e.history[0].substr(e.history[0].lastIndexOf('/source'));
			file = file.substr(0, file.lastIndexOf('.')) + '.pug';
			jadeCompile(file);
		}
	});

	// Stop gulp
	$.watch('gulpfile.js', process.exit);
});

gulp.task('default', ['serve']);
