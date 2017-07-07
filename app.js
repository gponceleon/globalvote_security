var express = require('express');
var app = express();
var postgres=require('./config/config.js');

//Configuracion 
var port = process.env.PORT || 3000;
app.use('/assets',express.static(__dirname+'/public'));

var db= postgres.connectPostgres();

app.listen(port);