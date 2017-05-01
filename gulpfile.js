var gulp = require('gulp');

gulp.task('copy', function() {
  gulp.src('providers.json').pipe(gulp.dest('dist'));
  gulp.src(['common/**/*.json']).pipe(gulp.dest('dist/common'));
  gulp.src(['server/**/*.json']).pipe(gulp.dest('dist/server'));
  gulp.src(['client/**/*.json']).pipe(gulp.dest('dist/client'));
  gulp.src(['public/**/*']).pipe(gulp.dest('dist/public'));
});