/**
 * Created by marc-iten on 02.12.16.
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var browsersync = require('browser-sync').create();

gulp.task('styles', function () {
    gulp.src('scss/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['>5% in CH'],
            cascade: false
        }))
        .pipe(cleancss({debug: true}, function(details) {
            console.log(details.name + ' (org): ' + details.stats.originalSize);
            console.log(details.name + ' (min): ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('./css/'));

});

gulp.task('serve', ['styles'], function() {

    browserSync.init({
        server: './'
    });

    gulp.watch(['scss/styles.scss', 'scss/partials/*.scss'], ['styles']);
    gulp.watch(['*.html', 'scss/styles.scss', 'scss/partials/*.scss']).on('change', browserSync.reload);

});

gulp.task('default', function () {
    browsersync.init({
        server: "./"
    });

    gulp.watch('scss/**/*.scss', ['styles']);
    gulp.watch(['*.html', 'scss/**/*']).on('change', browserSync.reload);
});
