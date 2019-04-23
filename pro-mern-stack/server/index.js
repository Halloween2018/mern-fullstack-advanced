import SourceMapSupport  from 'source-map-support';
SourceMapSupport.install();
import '@babel/polyfill';
import http from 'http';

import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'issuetracker';

let appModule = require('./server.js');
let db;
let server;

MongoClient.connect(url).then(connection => {
    db = connection.db(dbName);
    server = http.createServer();
    appModule.setDb(db);
    server.on('request', appModule.app);
    server.listen(3000, () => {
        console.log('App started on port 3000');
    });
}).catch(error => {
    console.log('Error:', error);
});

if(module.hot) {
    module.hot.accept('./server.js', () => {
        server.removeListener('request', appModule.app);
        appModule = require('./server.js');
        appModule.setDb(db);
        server.on('request', appModule.app);
    })
}




