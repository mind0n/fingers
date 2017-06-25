var gulp        =   require("gulp");
var clean       =   require('gulp-clean');
var runSequence =   require('run-sequence');
var shell       =   require('gulp-shell');
var bnd         =   require("gulp-concat")
var rename      =   require('gulp-rename');

gulp.task('default', function(done){
    return runSequence('widget', function(){
        done();
    });
});

gulp.task('widget', function(done){
    
    return gulp.src([
            './dist/**/*.*'
        ])
        .pipe(gulp.dest('../widgetonline.github.io/fingers'));
});
