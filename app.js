var express = require('express');
var app = express();


var usersController = require('./controllers/usersController');
var rolesController = require('./controllers/rolesController');
var userRoleController = require('./controllers/userRoleController');
var privilegesController = require('./controllers/privilegesController');
var privilegesRolesController = require('./controllers/privilegesRolesController');
var loginController = require('./controllers/loginController');

var Sequelize = require('sequelize');
var config = require('./config/DBConfig.json');
var session = require('express-session');


//connect to sequelize 
var sequelize=new Sequelize('globalvote', 'globalvote', 'gl0b4lv0t3',{
    port:5432,
    schema:'globalvote',
    dialect:'postgres'
});

var models= require('./models/index.js')(sequelize);


var port = process.env.PORT || 3000;
app.use('/assets',express.static(__dirname+'/public'));
app.use(session({ 
        secret: 'gl0b4lv0t34pp',
        saveUninitialized: false,
        resave: true
    }));

app.use(function(req,res,next){
    var err=req.session.error;
    var msg=req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    next();
})

loginController(models,app);
usersController(models,app);
rolesController(models,app);
userRoleController(models,app,Sequelize);
privilegesController(models,app,Sequelize);
privilegesRolesController(models,app,Sequelize);

app.listen(port);