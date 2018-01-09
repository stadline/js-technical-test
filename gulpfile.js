var gulp        = require('gulp'),
	  sass        = require('gulp-sass'),
    babel 		  = require("gulp-babel"),
    cssmin      = require('gulp-cssmin'),
    rename      = require('gulp-rename'),
    prefix      = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    imagemin    = require('gulp-imagemin'),
  	browserSync = require('browser-sync').create();


// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'js'], function() {

    browserSync.init({
        server: './',
        https: false
    });

    gulp.watch('app/scss/**/*.sass', ['sass']);
    gulp.watch('app/js/**/*.js', ['js']);
    gulp.watch('./*.html').on('change', browserSync.reload);
});

// Configure CSS dans dossier min dist tasks.
gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.sass')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(prefix('last 2 versions'))
    //.pipe(cssmin())
    //.pipe(rename({dirname: 'min', suffix: '.min'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// Configure JS.
gulp.task('js', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(babel())
  	.pipe(uglify())
  	.pipe(concat('app.js'))
    .pipe(rename({dirname: 'min', suffix: '.min'}))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

// Configure image stuff.
gulp.task('images', function () {
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

// watch
gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.sass', ['sass']);
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', ['sass', 'js', 'images', 'serve']);