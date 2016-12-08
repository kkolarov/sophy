let gulp = require('gulp');
let nodemon = require('gulp-nodemon');
let mocha = require('gulp-spawn-mocha');
let jshint = require('gulp-jshint');
let stylish = require('jshint-stylish');

var paths = {
  'scripts': ['./src/**/*.js'],
  'tests': ['./src/tests/**/*.js']
};

gulp.task('jshint', () => {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mocha-tests', () => {
  return gulp.src(paths.tests)
    .pipe(mocha({
      R: 'spec',
      t: 5000 ,
      env: {
        NODE_ENV: 'testing',
        ALLOW_CONFIG_MUTATIONS: true
      }
    }));
});

gulp.task('watch-scripts', () => {
  gulp.watch(paths.scripts, ['jshint'])
});

gulp.task('watch-tests', () => {
  gulp.watch(paths.scripts, ['mocha-tests']);
});

gulp.task('watch-app', () => {
  nodemon({
    script: 'app.js',
    ext: 'html css js',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  });
});

gulp.task('default', ['watch-app', 'watch-scripts', 'mocha-tests', 'watch-tests']);
