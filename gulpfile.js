var gulp          = require('gulp'),
	gutil         = require('gulp-util'),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	// rsync         = require('gulp-rsync')
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require("gulp-notify");

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', basename : 'app', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('js', function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'app/js/common.js',
		])
	.pipe(concat('app.min.js'))
	// .pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

// gulp.task('rsync', function() {
	// return gulp.src('app/**')
	// .pipe(rsync({
		// root: 'app/',
		// hostname: 'username@yousite.com',
		// destination: 'yousite/public_html/',
		//include: ['*.htaccess'], // Includes files to deploy
		// exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		// recursive: true,
		// archive: true,
		// silent: false,
		// compress: true
	// }))
// });

gulp.task('watch', ['styles', 'js', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['styles']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload)
});

gulp.task('default', ['watch']);
