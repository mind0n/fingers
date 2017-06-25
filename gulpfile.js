var gulp        =   require("gulp");
var runSequence =   require('run-sequence');

var reg         =   require('gulp-task-register');
reg([
    'clean'
    , 'vendor'
    , 'static'
    , 'ts'
    , 'ts:prod'
    , 'publish'
    , '_host'
    , '_watch:ts'
    , '_watch:vendor'
    , '_watch:html'
]);
gulp.task("default", function(done){
    runSequence('vendor', 'static', 'ts', function() {
        done();
    });
});
gulp.task("prod", function(done){
    runSequence('clean', 'vendor', 'ts:prod', 'publish', function() {
        done();
    });
});

