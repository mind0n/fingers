var gulp    =   require("gulp");
var ts      =   require("gulp-typescript");
var map     =   require("gulp-sourcemaps");
var web     =   require("gulp-webserver");
var bnd     =   require("gulp-concat");
var nocmt   =   require("gulp-strip-comments");
var minify  =   require("gulp-minify");
var jade    =   require("gulp-jade");
var tsproj  =   ts.createProject("tsconfig.json");

gulp.task("assets", function(){
    gulp.src(["./node_modules/jquery/dist/jquery.js", "./src/lib/velocity.js"])
        .pipe(gulp.dest("./dist/scripts"));
    gulp.src(["./src/**/*.html"])
        .pipe(gulp.dest("./dist"));
});
gulp.task("default", ["assets"], function(){
    var tsResult = tsproj.src()
        .pipe(map.init())
        .pipe(ts(tsproj));
    tsResult.js
        .pipe(bnd("fingers.js"))
        .pipe(map.write())
        .pipe(gulp.dest("./dist"));    
});
gulp.task("test", ["assets"], function(){
    var tsResult = tsproj.src()
        .pipe(ts(tsproj));
    tsResult.js
        .pipe(nocmt())
        .pipe(bnd("fingers.js"))
        .pipe(minify({ext:{src:".js", min:"-min.js"}, ignoreFiles:["-min.js"], exclude:["tasks"]}))
        .pipe(gulp.dest("./dist/scripts"));    
});


gulp.task("host", ["assets"], function(){
    gulp.src('./dist').pipe(web({
        fallback:"index.html",
        host:"0.0.0.0",
        port:80,
        livereload:true,
        directoryListing:false,
        open:false
    }));
});

gulp.task("watch", ["default"], function(){
    gulp.watch(["./src/**/*.*"], ["default"]);
});
