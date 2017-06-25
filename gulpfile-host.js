var gulp    =   require('gulp');
var web     =   require("gulp-webserver");

gulp.task("default", function(){
    gulp.src('./dist').pipe(web({
        fallback:"index.html",
        host:"0.0.0.0",
        port:80,
        livereload:true,
        directoryListing:false,
        open:false
    }));
});