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
    
    npm install --save-dev vinyl-buffer
    npm install --save-dev gulp-util
    npm install --save-dev gulp-sourcemaps

    
    npm install --save-dev babel-preset-es2015

    npm install --save-dev amazeui-touch
    npm install --save-dev redux
    npm install --save-dev react-redux
    npm install --save-dev redux-thunk
    
 */

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash').assign;
var reactify = require('reactify');
var babelify = require('babelify');
var htmlreplace = require('gulp-html-replace');


var path = {
    HTML: 'kebolcz/index.html',
    OUT: 'bundle.js',
    DEST: 'C:/AppCan/AppCanStudioPersonalV4.0/widgetapp/casco_wgt_newbp/travelConfirm/kebolcz/dist',
    DEST_SRC: 'C:/AppCan/AppCanStudioPersonalV4.0/widgetapp/casco_wgt_newbp/travelConfirm/kebolcz/dist/src',
    ENTRY_POINT: 'kebolcz/src/index.js'
};

//kebolcz/src/index.html中复制到kebolcz中
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
    debug: true
    // debug: false
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
        // .pipe(streamify(uglify()))
        // 可选项，如果你不需要缓存文件内容，就删除
        .pipe(buffer())
        // 可选项，如果你不需要 sourcemaps，就删除
        .pipe(sourcemaps.init({ loadMaps: true })) // 从 browserify 文件载入 map
        // 在这里将变换操作加入管道
        .pipe(sourcemaps.write('./')) // 写入 .map 文件
        .pipe(gulp.dest(path.DEST_SRC));
}