﻿var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

var serve = http.createServer(app);
var io = require('socket.io')(serve);

serve.listen(app.get('port'), function () {});

io.on('connection', function (socket) {

    mongo.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI, function (err, db) {
        if (err) {
            console.warn(err.message);
        } else {
            var collection = db.collection('chat messages')
            var stream = collection.find().sort().limit(10).stream();
            stream.on('data', function (chat) { console.log('emitting chat'); socket.emit('chat', chat.content); });
        }
    });
    
});
