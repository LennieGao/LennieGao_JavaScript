//导入
const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');//压缩
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');



//任务
//压缩sass
gulp.task('sass',()=>{
	gulp.src('./src/sass/*.scss')
	.pipe(sass())
	//.pipe(cssnano())
	.pipe(rename({"suffix" : ".min"}))
	.pipe(gulp.dest('./dist/css'));
})
//压缩js
gulp.task('js', function() {
  gulp.src('./src/gulpJs/*.js')//入口
  .pipe(rename({"suffix" : ".min"}))
  .pipe(uglify())//压缩
  .pipe(gulp.dest('./dist/js'))
});

gulp.task('default',()=>{
	gulp.watch('./src/sass/*.scss',['sass']);
	
})