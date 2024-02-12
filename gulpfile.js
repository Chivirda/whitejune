import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import ghPages from 'gulp-gh-pages'

const files = {
    htmlPath: 'src/**/*.html',
    sassPath: 'src/sass/**/*.scss',
    jsPath: 'src/js/**/*.js',
    imagePath: 'src/images/**/*',
    fontPath: 'src/fonts/**/*',
    distPath: 'dist/**/*'
};
const sass = gulpSass(dartSass);

function htmlTask() {
    return gulp.src(files.htmlPath)
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
}

function sassTask() {
    return gulp.src(files.sassPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

function jsTask() {
    return gulp.src(files.jsPath)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
}

function imageTask() {
    return gulp.src(files.imagePath)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}

function fontTask() {
    return gulp.src(files.fontPath)
        .pipe(gulp.dest('dist/fonts'));
}

function watchTask() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        },
        notify: true
    });
    gulp.watch([files.htmlPath, files.sassPath, files.jsPath], gulp.parallel(htmlTask, sassTask, jsTask)).on('change', browserSync.reload);
}

function deploy() {
    return gulp.src(files.distPath)
        .pipe(ghPages());
}

export default gulp.series(
    gulp.parallel(htmlTask, sassTask, jsTask, imageTask, fontTask),
    watchTask
);

export { deploy };
