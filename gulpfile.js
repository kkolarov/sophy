'use strict';

const config = require('config');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-spawn-mocha');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');

const path = {
  'scripts': ['./src/**/*.js'],
  'devTests': ['./src/tests/**/*.js']
};

gulp.task('jshint', () => {
  return gulp.src(path.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('tests', () => {
  return gulp.src(path.devTests)
    .pipe(mocha({
      R: 'spec',
      t: 30000 ,
      env: config.get('environment')
    }));
});

gulp.task('production-tests', () => {
  return gulp.src(path.devTests)
    .pipe(mocha({
      R: 'spec',
      t: 30000
    }));
});

gulp.task('watch-tests', () => {
  gulp.watch(path.scripts, ['tests']);
});

gulp.task('watch-scripts', () => {
  gulp.watch(path.scripts, ['jshint'])
});

gulp.task('watch-app', () => {
  nodemon({
    script: 'app.js',
    ext: 'html css js ejs',
    env: config.get('environment')
  });
});

gulp.task('run-tests', ['tests', 'watch-tests']);

gulp.task('default', ['watch-app', 'watch-scripts']);
