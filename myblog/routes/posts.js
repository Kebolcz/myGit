var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');

var checkLogin = require('../middlewares/check').checkLogin;

//this router don`t use checklogin middleware.Because this router is used for visitor to browse blogs,don`t check login
/*router.get('/',checkLogin,function(req,res,next){*/
router.get('/',function(req,res,next){
	var author = req.query.author;

	PostModel.getPosts(author)
	.then(function (posts) {
	  res.render('posts', {
	    posts: posts
	  });
	})
	.catch(next);
});
//router to publish a article
router.post('/', checkLogin, function(req,res,next){
	var author = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;

	// 校验参数
	try {
		if (!title.length) {
		  throw new Error('请填写标题');
		}
		if (!content.length) {
		  throw new Error('请填写内容');
		}
	} catch (e) {
		req.flash('error', e.message);
		return res.redirect('back');
	}

	var post = {
		author: author,
		title: title,
		content: content,
		pv: 0
	};

	PostModel.create(post)
	    .then(function (result) {
	      // 此 post 是插入 mongodb 后的值，包含 _id
	      post = result.ops[0];
	      req.flash('success', '发表成功');
	      // 发表成功后跳转到该文章页
	      res.redirect(`/posts/${post._id}`);
	    })
	    .catch(next);
});
//the view of publish articles
router.get('/create', checkLogin, function(req, res, next) {
	res.render('create');
});
//Get /posts/:postId  the view of a publish article[noncheck]
router.get('/:postId', function(req, res, next) {
  var postId = req.params.postId;
  console.log("postId: " , postId);
  Promise.all([
    PostModel.getPostById(postId),// 获取文章信息
    PostModel.incPv(postId)// pv 加 1
  ])
  .then(function (result) {
    var post = result[0];
    if (!post) {
      throw new Error('该文章不存在');
    }

    res.render('post', {
      post: post
    });
  })
  .catch(next);
});
//POST /posts/:postId/edit edit a article
router.post('/:postId/edit',checkLogin,function(req,res,next){
	res.send(req.flash('info'));
});
//Get /posts/:postId/remove
router.get('/:postId/remove',checkLogin,function(req,res,next){
	res.send(req.falsh('info'));
});
//POST /posts/:postId/comment
router.post('/:postId/comment',checkLogin,function(req,res,next){
	res.send(req.flash('info'));
});
//Get /posts/:postId/comment/:commentId/remove
router.get('/:postId/comment/:commentId/remove',checkLogin,function(req,res,next){
	res.send(req.flash('info'));
});

module.exports = router;