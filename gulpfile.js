const gulp = require('gulp');
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const rename = require("gulp-rename");
const newer = require("gulp-newer");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('browser-sync', function(done){
    browserSync.init({
        server: {
            baseDir: "./public"
        },
        port: 7000
    });
    done();
});
gulp.task("images", images);
gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("watch", () => { 
    gulp.watch("./assets/img/*", images);
    gulp.watch("./assets/sass/*", styles);
    gulp.watch("./assets/js/*.js", scripts);
    gulp.watch("./public/**/*",  browserSyncReload);
});
function browserSyncReload(done) {
    browserSync.reload();
    done();
}
function images() {
    return gulp
            .src("./assets/img/*")
            .pipe(newer("./public/assets/img"))
            .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                plugins: [
                    {
                    removeViewBox: false,
                    collapseGroups: true
                    }
                ]
                })
            ])
            )
            .pipe(gulp.dest("./public/assets/img"));
}

function styles(){
    return gulp.src("./assets/sass/*")
                .pipe(plumber())
                .pipe(sass())
                //Minificacao
                .pipe(postcss([cssnano()]))
                .pipe(rename({ suffix: ".min" }))
                .pipe(gulp.dest("./public/assets/css/"))
                .pipe(browserSync.stream());
}
function scripts() {
    return gulp.src("./assets/js/*.js", {
                sourcemaps: true
            })
            .pipe(uglify())
            .pipe(concat('main.min.js'))
            .pipe(gulp.dest("./public/assets/js/"));
}
gulp.task('default', gulp.parallel("browser-sync", "images", "styles", "scripts", "watch"));
