/**
  * Pic4ward Gulp Build Scripts
  **/

'use strict';

var del       = require('del');
var source    = require('vinyl-source-stream');
var buffer    = require('vinyl-buffer');

var cssImport  = require('postcss-import');
var cssNext    = require('cssnext');
var postcss    = require('gulp-postcss');
var minifyHtml = require('gulp-minify-html');
var ngHtml2Js  = require('gulp-ng-html2js');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');

var gulp      = require('gulp');
var plumber   = require('gulp-plumber');
var rev       = require('gulp-rev');

var browserify = require('browserify');

var debug = (process.env.NODE_ENV !== 'production');

var appBundler = browserify({
  entries: './assets/js/app.js',
  debug: debug
});

gulp.task('clean-css', function() {
  return del('./public/css/**/*');
});

gulp.task('bundle-css', ['clean-css'], function() {
  var plugins = [];

  plugins.push(cssImport({
    glob: true
  }));

  plugins.push(cssNext());

  console.log('++ Generating CSS bundle ++');

  return gulp.src('./assets/css/app.css')
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(rev())
    .pipe(gulp.dest('./public/css'))
    .pipe(rev.manifest({ base: './', merge: true }))
    .pipe(gulp.dest('./'));
});

gulp.task('clean-js', ['bundle-css'], function() {
  return del('./public/js/**/*');
});

gulp.task('bundle-js-app', ['clean-js'], function() {
  return appBundler.bundle()
    .pipe(plumber())
    .pipe(source('app.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/js'))
    .pipe(rev.manifest({ base: './', merge: true }))
    .pipe(gulp.dest('./'))
    .on('end', function() {
      console.log('++ [app] bundle has been successfully generated ++');
    });
});

gulp.task('bundle-templates', ['bundle-js-app'], function() {
  return gulp.src('./assets/templates/**/*.html')
    .pipe(plumber())
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      loose: true
    }))
    .pipe(ngHtml2Js({
      moduleName: 'app.templates',
      prefix: 'templates/'
    }))
    .pipe(concat('template-cache.min.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/js'))
    .pipe(rev.manifest({ base: './', merge: true }))
    .pipe(gulp.dest('./'));
});

gulp.task('clean-images', ['bundle-templates'], function() {
  return del('./public/images/**/*');
});

gulp.task('bundle-images', ['clean-images'], function() {
  return gulp.src('./assets/images/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./public/images'));
});

gulp.task('bundle', ['bundle-images']); 