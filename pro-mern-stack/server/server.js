// import '@babel/polyfill';
// const express = require('express');
import express from 'express';

// import path from 'path';

// const bodyParser = require('body-parser');	/* 引入中间件，解析请求体中的数据【解析请求正文并将其转换为对象】 */
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import Issue from './issue.js';
// import SourceMapSupport from 'source-map-support';

import RederedPageRouter from './renderedPageRouter.jsx';
import renderedPageRouter from './renderedPageRouter.jsx';

// SourceMapSupport.install();

const app = express();
/* 引入驱动程序  从服务器读取数据 */
// const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'issuetracker';
//引入验证模块
// const Issue = require('./issue');

// const client = new MongoClient(url);

let db;		//保存数据库的连接
/* MongoClient.connect(url + dbName).then(connection => {
	db = connection;

	app.listen(3000, function() {
		console.log('App started on port 3000');
	});
	
}).catch(error =>{
	console.log('ERROR:', error);
}) */

// throw new Error('Test');
// MongoClient.connect(url).then(connection => {
// 	db = connection.db(dbName);

// 	/* console.log(connection);
// 	console.log("check it out:");
// 	console.log(db); */

// 	app.listen(3000, function() {
// 		console.log('App started on port 3000');
// 	});

// }).catch(error => {
// 	console.log('ERROR:', error);
// 	client.close();
// });

function setDb(newDb) {
	db = newDb;
}

app.use(express.static('static'));
/* 使用中间件 */
app.use(bodyParser.json());
const issues = [
	{
		id: 1, status: 'Open', owner: 'Ravan',
		created: new Date('2019-03-30'), effort: 5, completionDate: undefined,
		title: 'Error in console when clicking Add',
	},
	{
		id: 2, status: 'Assigned', owner: 'Eddie',
		created: new Date('2019-04-20'), effort: 14, 
		completionDate: new Date('2019-05-04'),
		title: 'Missing bottom border on panel',
	}
];

if(process.env.NODE_ENV !== 'production') {
	const webpack = require('webpack');
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');

	const config = require('../webpack.config');
	// config.entry.app.push('webpack-hot-middleware/client', 'webpack/hot/only-dev-server');
	// config.plugins.push(new webpack.HotModuleReplacementPlugin());

	const bundle = webpack(config);
	app.use(webpackDevMiddleware(bundle, {noInfo: true, publicPath: config.output.publicPath}));
	app.use(webpackHotMiddleware(bundle));
}

app.get('/api/issues', (req, res) => {
	/* 使用筛选器修改问题的API */
	const filter = {};
	let result;
	console.log('存不存在Query ' + req.query );
	if(req.query.effort_lte || req.query.effort_gte) filter.effort = {};
	if(req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);
	if(req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
	if(req.query.status) filter.status = req.query.status;	
	for(let nullTest in filter) {
		if(!filter.nullTest) delete filter.nullTest;
	}
	/* {
		filter.status = req.query.status;
		result = db.collection('issues').find(filter)
	} else {
		result = db.collection('issues').find();
	} */

	result = db.collection('issues').find(filter);
	// {status: filter.status}
	// console.log(req.query.status);
	result.toArray().then(issues => {
		const metadata = { total_count: issues.length };
		res.json({ _metadata: metadata, records: issues });
	}).catch(error => {
		console.log(error);
		res.status(500).json({message: `Internal Server Error: ${error}` });
	});

	
});
app.get('/api/issues/:id', (req, res) => {
	let issueId;
	// console.log(req.params.id);
	try {
		issueId = new ObjectId(req.params.id);
		// console.log(req.params.id);
	} catch (error) {
		res.status(422).json({ message: `No suan issue:${error}`});
		return;
	}

	db.collection('issues').find({ _id: issueId }).limit(1)
	.next()
	.then(issue => {
		if(!issues) res.status(404).json({ message: `No such issue: ${issueId}`});
		else res.json(issue);
	})
	.catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server Error: ${error}`});
	});
});

app.post('/api/issues', (req, res) => {
	const newIssue = req.body;
	// console.log(newIssue);
	// newIssue.id = issues.length + 1;		//数据库已自动生成，不需要自己设置
	newIssue.created = new Date();
	if( !newIssue.status ) 
		newIssue.status = 'New';
	
	const err =  Issue.validateIssue(newIssue);
	if (err) {
		res.status(402).json({ message:`Invalid request:${err}`});
		return;
	}

	db.collection('issues').insertOne(Issue.cleanupIssue(newIssue)).then(result => 
		db.collection('issues').find({ _id: result.insertedId }).limit(1).next()
	).then(newIssue => {
		res.json(newIssue);		//只返回新插入的数据
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server Error: ${error}` });
	})

	/* issues.push(newIssue);
	res.json(newIssue); */
});

app.put('/api/issues/:id', (req, res) => {
	let issueId;
	try {
		issueId = new ObjectId(req.params.id);
	} catch (error) {
		res.status(422).json({message: `Invalid issue ID format: ${error}`});
		return ;
	}

	const issue = req.body;
	delete issue._id;

	const err = Issue.validateIssue(issue);
	if(err) {
		res.status(422).json({ message: `Invalid request: ${err}`});
		return ;
	}

	db.collection('issues').update({ _id: issueId}, Issue.convertIssue(issue))
	.then( ()  => db.collection('issues').find({ _id: issueId}).limit(1).next())
	.then(savedIsuse => {
		res.json(savedIsuse);
	})
	.catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Servere Error: ${error}`});
	});
	 

});

app.delete('/api/issues/:id', (req, res) => {
	let issueId;
	try {
		issueId = new ObjectId(req.params.id);
	} catch (error) {
		res.status(422).json({ message: `Invalid issue Id format: ${error}`});
		return ;
	}

	db.collection('issues').deleteOne({ _id:issueId }).then((deleteResult) => {
		if(deleteResult.result.n === 1) res.json({ status: 'OK'});
		else res.json({ status: 'Warning: object not found' });
	})
	.catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Servere Error: ${error}`});
	});
});



/* app.listen(3000, function() {
	console.log('App started on port 3000');
}); */

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve('static/index.html'));
// 	/* res.sendFile(path.resolve(__dirname, 'static/app.bundle.js'));
// 	res.sendFile(path.resolve(__dirname, 'static/vendor.bundle.js')); */

// });

app.use( '/', renderedPageRouter);

export { app, setDb};


