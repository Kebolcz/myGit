/* 用户校验 */
const express = require('express');
const Router = express.Router();
const utils = require('utility');

const model = require('./model');
const User = model.getModel('user');

const _filter = {'pwd': 0, '__v': 0};

Router.get('/list', (req, res) => {
	// User.remove({}, function(e, d){});
	User.find({}, (err, doc) => {
		return res.json(doc);
	});
});

Router.post('/login', (req, res) => {
	const { user, pwd } = req.body;
	User.findOne({ user, pwd: md5Pwd(pwd) }, _filter, (err, doc) => {
		if (doc) {
			res.cookie('userid', doc._id);
			return res.json({ code: 0, data: doc });
		} else {
			return res.json({ code: 1, msg: '用户名或密码错误!' });
		}
	});
});

Router.post('/register', (req, res) => {
	const { user, repeatpwd, pwd, type } = req.body;
	User.findOne({ user: user }, (err, doc) => {
		if (doc) {
			return res.json({ code: 1, msg: 'user has existed!' });
		} else {
			User.create({ user, pwd: md5Pwd(pwd), type }, (err, doc) => {
				if (err) {
					return res.json({ code: 1, msg: 'something is wrong!' });
				}
				return res.json({ code: 0 });
			});
		}
	});
});

Router.get('/info', (req, res) => {
	// 校验cookie，0成功，else失败
	const { userid } = req.cookies;
	if(!userid) {
		return res.json({ code: 1 });
	}
	User.findOne({ _id: userid }, _filter, function(err, doc){
		if(err) {
			return res.json({ code: 1, msg: '查询用户ID失败!' });
		}
		if(doc) {
			return res.json({ code: 0, data: doc});
		}
	});
});

function md5Pwd(pwd){
	const salt = "imooc_kebo_combat_for_vue@12QWeqwe!qda";
	return utils.md5(utils.md5(pwd + salt));
}

module.exports = Router;
