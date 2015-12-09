// Include gulp
var gulp = require("gulp");

// Include Our Plugins
var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var clean = require("gulp-clean");
var sourcemaps = require("gulp-sourcemaps");

var jsFiles = [
	"src/gorilla.angular.js",
	"src/boostrap/gorilla.angular.bootstrap.js",
	"src/*/**.js",
	"src/*/*/**.js",
];

gulp.task("default", ["minify"], function() {
	return gulp.src(jsFiles)
		.pipe(concat("gorilla.angular.js"))
		.pipe(gulp.dest("dist"));
});

gulp.task("watch", ['default'], function() {
	gulp.watch(jsFiles, ["default"]);
});

gulp.task("lint", function() {
	return gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter("default"));
});

gulp.task("minify", ["lint"], function() {
	return gulp.src(jsFiles)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat("gorilla.angular.min.js"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("dist"));
});