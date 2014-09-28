var gulp             = require('gulp');
var mainBowerFiles   = require('main-bower-files');
var rename           = require('gulp-rename');
var gulpFilter       = require('gulp-filter');
var order            = require("gulp-order");
var concat           = require('gulp-concat');
var uncss 			 = require('gulp-uncss');
var cssmin			 = require('gulp-cssmin');
var uglify 			 = require('gulp-uglify');
var prefix    		 = require('gulp-autoprefixer');
var livereload 		 = require('gulp-livereload');
var spritesmith      = require('gulp.spritesmith');
var unhtml           = require('gulp-minify-html');


// мини-сервер для livereload
gulp.task('server', function(next) {
  var connect = require('connect');
  server = connect();
  var serveStatic = require('serve-static');
  server.use(serveStatic('./')).listen(process.env.PORT || 8080, next);
});

// следим и распределяем main файлы Bower
gulp.task('libs', function () {
	var jsFilter = gulpFilter('**/*.js');
	var cssFilter = gulpFilter('**/*.css');
	
	return gulp.src(mainBowerFiles(
	{
		includeDev: true
	}))
	
	// собираем js файлы , склеиваем и отправляем в папку www/js 
	.pipe(jsFilter)
			// .pipe(order([
				// "jquery/*.js",
				// "**/*.js"
			// ]))
	.pipe(concat('libs.js'))
	.pipe(uglify())
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest('www/js'))
	.pipe(jsFilter.restore())
	
	// собраем css файлы, склеиваем и отправляем их под синтаксисом scss
	.pipe(cssFilter)
	.pipe(concat('libs.scss'))
	.pipe(gulp.dest('dev/sass/library/'));
	
});

// css. Автопрефикс, очистка кода от неиспользуемых стилей, минификация.

gulp.task('css', function() {
	return gulp.src('dev/sass/style.css')
	.pipe(prefix(["last 5 version", "ie 8", "ie 7"]))
	/*.pipe(uncss({
		html: ['www/index.html', 'www/contact.html']
	}))*/
	.pipe(cssmin())	
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest('www/style/'));
});


// js. Минифицирует и склеивает

gulp.task('js', function () {
	return gulp.src('dev/javascript/*.js')
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest('www/js/'));
});

// минифицируем html

gulp.task('minifyHtml', function() {
    var opts = {spare:true};

  gulp.src('dev/*.html')
    .pipe(unhtml(opts))
    .pipe(gulp.dest('www/'))
});

//создаем спрайт

gulp.task('sprite', function () {
  var spriteData = gulp.src('dev/sprite/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
	cssFormat: 'sass',
    cssName: 'sprite.sass',
	padding: 10,
	algorithm: 'binary-tree',
	cssVarMap: function(sprite) {
                    sprite.name = 'sprite-' + sprite.name
                }
  }));
  spriteData.img.pipe(gulp.dest('www/image/'));
  spriteData.css.pipe(gulp.dest('dev/sass/library/'));
});

// а теперь наблюдаем за происходящим =)

gulp.task('watch', ['server'], function() {
  var server = livereload();
  
  gulp.watch('bower.json',['libs']);
  
  gulp.watch('dev/sass/style.css',['css']);
  
  gulp.watch('dev/javascript/*.js',['js']);
  
  gulp.watch('dev/*.html',['minifyHtml']);
  
  gulp.watch('dev/sprite/*.png',['sprite']);

  gulp.watch('www/**/*').on('change', function(file) {
      server.changed(file.path);
  });
});



// gulp.task('default', function(){
     // console.log('Hello from Gulp!')
// });





