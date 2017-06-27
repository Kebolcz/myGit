/**
 * Created by minooo on 2016/7/15.
 */
var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack-dev-config');

var express = require('express');
var app = new (require('express'))();
var port = 3000;
// 监听的端口是3000，届时可以在在浏览器输入 localhost:3000 直接访问

//利用 Express 托管静态文件
//将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了。
app.use(express.static('public'));

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  // 如果false，将会给你列出一大堆无聊的信息。
  
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));
app.use(webpackHotMiddleware(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
});