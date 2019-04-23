'use strict';

require('@babel/polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const bodyParser = require('body-parser');	/* 引入中间件，解析请求体中的数据【解析请求正文并将其转换为对象】 */
_sourceMapSupport2.default.install();
// const express = require('express');


var app = (0, _express2.default)();
/* 引入驱动程序  从服务器读取数据 */
// const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var dbName = 'issuetracker';
//引入验证模块
// const Issue = require('./issue');

// const client = new MongoClient(url);

var db = void 0; //保存数据库的连接
/* MongoClient.connect(url + dbName).then(connection => {
	db = connection;

	app.listen(3000, function() {
		console.log('App started on port 3000');
	});
	
}).catch(error =>{
	console.log('ERROR:', error);
}) */

// throw new Error('Test');
_mongodb.MongoClient.connect(url).then(function (connection) {
	db = connection.db(dbName);

	/* console.log(connection);
 console.log("check it out:");
 console.log(db); */

	app.listen(3000, function () {
		console.log('App started on port 3000');
	});
}).catch(function (error) {
	console.log('ERROR:', error);
	client.close();
});

app.use(_express2.default.static('static'));
/* 使用中间件 */
app.use(_bodyParser2.default.json());
var issues = [{
	id: 1, status: 'Open', owner: 'Ravan',
	created: new Date('2019-03-30'), effort: 5, completionDate: undefined,
	title: 'Error in console when clicking Add'
}, {
	id: 2, status: 'Assigned', owner: 'Eddie',
	created: new Date('2019-04-20'), effort: 14,
	completionDate: new Date('2019-05-04'),
	title: 'Missing bottom border on panel'
}];

if (process.env.NODE_ENV !== 'production') {
	var webpack = require('webpack');
	var webpackDevMiddleware = require('webpack-dev-middleware');
	var webpackHotMiddleware = require('webpack-hot-middleware');

	var config = require('../webpack.config');
	// config.entry.app.push('webpack-hot-middleware/client', 'webpack/hot/only-dev-server');
	// config.plugins.push(new webpack.HotModuleReplacementPlugin());

	var bundle = webpack(config);
	app.use(webpackDevMiddleware(bundle, { noInfo: true, publicPath: config.output.publicPath }));
	app.use(webpackHotMiddleware(bundle));
}

app.get('/api/issues', function (req, res) {

	db.collection('issues').find().toArray().then(function (issues) {
		var metadata = { total_count: issues.length };
		res.json({ _metadata: metadata, records: issues });
	}).catch(function (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error: ' + error });
	});
});

app.post('/api/issues', function (req, res) {
	var newIssue = req.body;
	// console.log(newIssue);
	// newIssue.id = issues.length + 1;		//数据库已自动生成，不需要自己设置
	newIssue.created = new Date();
	if (!newIssue.status) newIssue.status = 'New';

	var err = _issue2.default.validateIssue(newIssue);
	if (err) {
		res.status(402).json({ message: 'Invalid request:' + err });
		return;
	}

	db.collection('issues').insertOne(newIssue).then(function (result) {
		return db.collection('issues').find({ _id: result.insertedId }).limit(1).next();
	}).then(function (newIssue) {
		res.json(newIssue); //只返回新插入的数据
	}).catch(function (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error: ' + error });
	});

	/* issues.push(newIssue);
 res.json(newIssue); */
});

/* app.listen(3000, function() {
	console.log('App started on port 3000');
}); */
//# sourceMappingURL=server.js.map