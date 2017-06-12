/**
 * npm
    npm install --save-dev react
    npm install --save-dev react-dom
    npm install --save-dev semantic-ui-react
    npm install --save-dev watchify
    npm install --save-dev browserify
    npm install --save-dev gulp
    npm install --save-dev vinyl-source-stream
    npm install --save-dev gulp-uglify
    npm install --save-dev gulp-streamify
    npm install --save-dev reactify
    npm install --save-dev babelify
    npm install --save-dev gulp-html-replace
 */


//kebolcz using browserify

// var gulp = require('gulp');
// var uglify = require('gulp-uglify');
// var htmlreplace = require('gulp-html-replace');;
// var source = require('vinyl-source-stream');
// var browserify = require('browserify');
// var watchify = require('watchify');
// var reactify = require('reactify');
// var babelify = require('babelify');
// var streamify = require('gulp-streamify');

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var reactify = require('reactify');
var babelify = require('babelify');
var htmlreplace = require('gulp-html-replace');


var path = {
    HTML: 'kebolcz/index.html',
    MINIFIED_OUT: 'build.min.js',
    OUT: 'bundle.js',
    DEST: 'kebolcz/dist',
    DEST_SRC: 'kebolcz/dist/src',
    ENTRY_POINT: 'kebolcz/src/index.js'
};

//kebolcz/src/index.html中复制到kebolczkebolcz/dist中
gulp.task('copy', function () {
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'js': 'src/' + path.OUT
        }))
        .pipe(gulp.dest(path.DEST));
});

// 在这里添加自定义 browserify 选项
var customOpts = {
    entries: [path.ENTRY_POINT],
    // debug: true
    debug: false
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));
// 在这里加入变换操作
b.transform(reactify);
b.transform(babelify);

gulp.task('js', bundle); // 这样你就可以运行 `gulp js` 来编译文件了
b.on('update', bundle); // 当任何依赖发生改变的时候，运行打包工具
b.on('log', gutil.log); // 输出编译日志到终端

function bundle() {
    gulp.watch(path.HTML, ['copy']);

    return b.bundle()
        // 如果有错误发生，记录这些错误
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        // 可选项，如果你不需要缓存文件内容，就删除
        // .pipe(buffer())
        // 可选项，如果你不需要 sourcemaps，就删除
        // .pipe(sourcemaps.init({ loadMaps: true })) // 从 browserify 文件载入 map
        // 在这里将变换操作加入管道
        .pipe(sourcemaps.write('./')) // 写入 .map 文件
        .pipe(gulp.dest(path.DEST_SRC));
}

// //kebolcz/src/index.html中复制到kebolczkebolcz/dist中
// gulp.task('copy', function () {
//     gulp.src(path.HTML)
//         .pipe(htmlreplace({
//             'js': 'src/' + path.OUT
//         }))
//         .pipe(gulp.dest(path.DEST));
// });

// //监测
// gulp.task('watch', function () {

//     //监测html文件
//     gulp.watch(path.HTML, ['copy']);


//     //watchify配合browserify使用，因为单独使用browserify会每次遍历每个组件，一旦有变化就会重新生成绑定文件。而有了watchify，会缓存文件，只更新哪些发生改变的文件
//     var watcher = watchify(browserify({
//         entries: [path.ENTRY_POINT], //kebolcz/src/js/App.js, browserify会检测kebolcz/src/js下的所有js文件，以及kebolcz/src/js下所有子文件夹下的js文件
//         transform: [reactify,babelify], //使用reactify把jsx转换成js文件
//         debug: true, //告诉Browersify使用source maps, souce maps帮助我们在出现错误的时候定位到jsx中的错误行
//         cache: {}, //必须的，browserify告诉我们这样使用
//         packageCache: {}, //必须的，browserify告诉我们这样使用
//         fullPath: true //必须的，browserify告诉我们这样使用
//     }));

//     return watcher.on('update', function () {
//         watcher.bundle()
//             .pipe(source(path.OUT))
//             .pipe(gulp.dest(path.DEST_SRC));

//         console.log('【' + (new Date()).toLocaleTimeString() + '】 Updated');
//     }).bundle()
//         .pipe(source(path.OUT))
//         .pipe(gulp.dest(path.DEST_SRC));
// });

// //默认的task
// gulp.task('default', ['watch']);

// //发布到生产环境之前
// gulp.task('build', function () {
//     browserify({
//         entries: [path.ENTRY_POINT]
//         , transform: [reactify]
//     })
//         .bundle()
//         .pipe(source(path.MINIFIED_OUT))
//         .pipe(streamify(uglify(path.MINIFIED_OUT)))
//         .pipe(gulp.dest(path.DEST_BUILD));
// });

// gulp.task('replaceHTML', function () {
//     gulp.src(path.HTML)
//         .pipe(htmlreplace({
//             'js': 'src/' + path.MINIFIED_OUT
//         }))
//         .pipe(gulp.dest(path.DEST));
// });

// gulp.task('production', ['replaceHTML', 'build']);