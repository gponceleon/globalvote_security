var express = require('express');
var app = express();
var usersController = require('./controllers/usersController');
var rolesController = require('./controllers/rolesController');
var userRoleController = require('./controllers/userRoleController');
var Sequelize = require('sequelize');
var config = require('./config/DBConfig.json');


//connect to sequelize 
var sequelize=new Sequelize('globalvote', 'globalvote', 'gl0b4lv0t3',{
    port:5432,
    schema:'globalvote',
    dialect:'postgres'
});

var models= require('./models/index.js')(sequelize);


var port = process.env.PORT || 3000;
app.use('/assets',express.static(__dirname+'/public'));
usersController(models,app);
rolesController(models,app);
userRoleController(models,app,Sequelize);
app.listen(port);