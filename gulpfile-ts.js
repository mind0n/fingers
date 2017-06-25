var gulp        =   require("gulp");
var browserify  =   require("browserify");
var source      =   require('vinyl-source-stream');
var tsify       =   require("tsify");
var uglify      =   require('gulp-uglify');
var buffer      =   require('vinyl-buffer');

gulp.task("default", function () {
    return browserify({
        basedir: './src',
        debug: true,
        entries: ['./main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('fingers.js'))
    .pipe(gulp.dest("dist"));
});

gulp.task("prod", function () {
    return browserify({
        basedir: './src',
        debug: false,
        entries: ['./main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('fingers.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});