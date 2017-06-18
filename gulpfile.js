var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var input = './assets/styles/styles.scss';
var output = './public/';

gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(output));
});
