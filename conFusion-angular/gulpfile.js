var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    browserSync = require('browser-sync'),
    ngannotate = require('gulp-ng-annotate'),
    del = require('del');

gulp.task('jshint', function() {
   return gulp.src('app/scripts/**/*.js')
   .pipe(jshint())
   .pipe(jshint.reporter(stylish));
});

gulp.task('usemin', ['jshint'], function() {
   return gulp.src('./app/*.html')
        .pipe(useref({
            css: [minifycss(), rev()],
            js: [ngannotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
    
//    return gulp.src('./app/*.html')
//            .pipe(useref())
//            .pipe(gulpif('*.css', minifycss()))
//            .pipe(gulpif('*.js', ngannotate(), uglify()))
//            .pipe(gulpif('*.css', rev()))
//            .pipe(gulpif('*.js', rev()))
//            .pipe(revReplace())
//            .pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function() {
   return del(['dist/images']), gulp.src('app/images/**/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({message: 'Image task complete'}));
});

gulp.task('clean', function() {
   return del(['dist']); 
});

gulp.task('copyfonts', ['clean'], function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));

   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('watch', ['browser-sync'], function() {
   gulp.watch('{app/scripts/**/*.js, app/styles/**/*.css, app/**/*.html}', ['usemin']);
   gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('browser-sync', ['default'], function() {
    var files = [
        'app/**/*.html',
        'app/styles/**/*.css',
        'app/images/**/*.png',
        'app/scripts/**/*.js',
        'dist/**/*'
    ];
    browserSync.init(files, {
       server: {
           baseDir: 'dist',
           index: 'menu.html'
       } 
    });
    
    gulp.watch(['dist/**']).on('change', browserSync.reload)
});

gulp.task('default', ['clean'], function() {
   gulp.start('usemin', 'imagemin', 'copyfonts'); 
});