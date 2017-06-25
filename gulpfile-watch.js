var gulp    =   require('gulp');
var shell   =   require('gulp-shell');

gulp.task("ts", function(){
    gulp.watch(["./src/**/*.ts", "../kernel/src/**/*.ts"], ["rebuild"]);
});
gulp.task("vendor", function(){
    gulp.watch(["../themes/src/**/*.scss"], ["revendor"]);
});
gulp.task("html", function(){
    gulp.watch(["./tests/**/*.html"], ["recopy"]);
});
gulp.task("rebuild", shell.task(['gulp --gulpfile gulpfile-ts.js']));
gulp.task("revendor", shell.task(['gulp --gulpfile gulpfile-vendor.js']));
gulp.task("recopy", shell.task(['gulp --gulpfile gulpfile-static.js']));
