/* 
 * mongodb安装在C:\Program Files\MongoDB\Server\3.6\bin
 * 启动powershell，执行.\mongod --dbpath=G:\data\db
 * 如果mongodb已启动，则在任务管理器中结束mongodb进程
*/
const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/imooc-chat';
mongoose.connect(DB_URL);

const models = {
	user: {
		user: { type: String, require: true },
		pwd: { type: String, require: true },
		type: { type: String, require: true },
		avator: { type: String },
		desc: { type: String },
		title: { type: String },
		company: { type: String },
		money: { type: String }
	},
	chat: {}
};

for (let m in models) {
	mongoose.model(m, new mongoose.Schema(models[m]));
}

module.exports = {
	getModel: (name) => {
		return mongoose.model(name);
	}
};
