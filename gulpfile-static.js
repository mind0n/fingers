var gulp        =   require("gulp");

gulp.task("default", function () {
    return gulp.src("./tests/*.html")
        .pipe(gulp.dest("dist/"));
});

