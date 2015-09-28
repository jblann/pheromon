"use strict";

require('es6-shim');
require('better-log').install();

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var zlib = require('zlib');

var express = require('express');
var app = express();
var http = require('http');
var compression = require('compression');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');

var debug = require('../tools/debug');
var routes = require('./routes.js');

var PRIVATE = require('../PRIVATE.json');
var maestro = require('./maestro')(PRIVATE.token); // API-side mqtt client

var server = new http.Server(app);
var io = require('socket.io')(server);


var PORT = 4000;


io.set('origins', '*:*');

io.on('connection', function(socket) {
    socket.on('cmd', function(cmd) {
        console.log('admin client data received');
        maestro.distribute(cmd);
    })
    maestro.sockets.push(socket)
});




// Backup database everyday at 3AM
schedule.scheduleJob('0 3 * * *', function(){
    console.log("Backup database");
    var gzip = zlib.createGzip();
    var today = new Date();
    var wstream = fs.createWriteStream('/pheromon/data/backups/' + today.getDay() + '.txt.gz');
    var proc = spawn('pg_dump', ['-p', process.env.DB_PORT_5432_TCP_PORT, '-h', process.env.DB_PORT_5432_TCP_ADDR, '-U', process.env.POSTGRES_USER, '-d', process.env.POSTGRES_USER, '-w']);
    proc.stdout
        .pipe(gzip)
        .pipe(wstream);
    proc.stderr.on('data', function(buffer) {
        console.log(buffer.toString().replace('\n', ''));
    })
});



app.use(compression());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/leaflet.css", express.static(path.join(__dirname, '../node_modules/leaflet/dist/leaflet.css')));

app.use("/dygraph-combined.js", express.static(path.join(__dirname, '../node_modules/dygraphs/dygraph-combined.js')));

app.use("/Admin", express.static(path.join(__dirname, './clients/Admin')));
app.use("/Dashboard", express.static(path.join(__dirname, './clients/Dashboard')));
app.use("/_common", express.static(path.join(__dirname, './clients/_common')));


app.get('/', function(req, res){
    res.redirect('/Dashboard');
});

app.get('/Admin', function(req, res){ // maybe not necessary
    res.sendFile(path.join(__dirname, './clients/Admin/index.html'));
});

app.get('/Admin-browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, './clients/Admin-browserify-bundle.js'));
});

app.get('/Dashboard-browserify-bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, './clients/Dashboard-browserify-bundle.js'));
});


routes(app, debug);

server.listen(PORT, function () {
    console.log('Server running on', [
        'http://localhost:',
        PORT
    ].join(''));
});


process.on('uncaughtException', function(e){
    console.error('uncaught', e, e.stack);
    process.kill();
});