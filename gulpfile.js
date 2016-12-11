'use strict';

const config = require('config');
let gulp = require('gulp');
let nodemon = require('gulp-nodemon');
let mocha = require('gulp-spawn-mocha');
let jshint = require('gulp-jshint');
let stylish = require('jshint-stylish');

var path = {
  'scripts': ['./src/**/*.js'],
  'tests': ['./src/tests/**/*.js'],
  'features': './src/tests/features/**/*.js'
};

gulp.task('jshint', () => {
  return gulp.src(path.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mocha-tests', () => {
  return gulp.src(path.tests)
    .pipe(mocha({
      R: 'spec',
      t: 5000 ,
      env: config.get('environment')
    }));
});

gulp.task('watch-scripts', () => {
  gulp.watch(path.scripts, ['jshint'])
});

gulp.task('watch-tests', () => {
  gulp.watch(path.scripts, ['mocha-tests']);
});

gulp.task('watch-app', () => {
  nodemon({
    script: 'app.js',
    ext: 'html css js',
    env: config.get('environment')
  });
});

gulp.task('production-tests', () => {
  return gulp.src(path.features)
    .pipe(mocha({
      R: 'spec',
      t: 5000
    }));
});

gulp.task('default', ['watch-app', 'watch-scripts', 'mocha-tests', 'watch-tests']);
