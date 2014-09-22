var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var yargs = require('yargs');
var fs = require('fs');
var insert = require('gulp-insert');
var gulpif = require('gulp-if');

var production = !!(yargs.argv.production);
var analytics_code = fs.readFileSync('src/js/ga.js');

gulp.task('lint', function() {
	return gulp.src('src/js/main.js')
		.pipe(jshint({ lookup: false }))
		.pipe(jshint.reporter('default'));
});

gulp.task('build', ['build-js', 'build-html', 'build-css', 'build-data']);

gulp.task('build-js', function() {
	return gulp.src('src/js/main.js')
		.pipe(browserify({
			insertGlobals: true,
			debug: !production
		}))
		.pipe(gulpif(production, uglify()))
		.pipe(gulpif(production, insert.append(analytics_code)))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('build-html', function() {
	return gulp.src('src/index.html')
		.pipe(gulp.dest('./build/'));
});

gulp.task('build-css', function() {
	return gulp.src('src/css/style.css')
		.pipe(gulp.dest('./build/css'));
});

gulp.task('build-data', function() {
	return gulp.src('src/data/**/*')
		.pipe(gulp.dest('./build/data'));
});

gulp.task('watch', function() {
	gulp.watch('src/**/*', ['lint', 'build']);
});

gulp.task('default', ['lint', 'build', 'watch']);

