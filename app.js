var express = require('express');
var app = express();


var usersController = require('./controllers/usersController');
var rolesController = require('./controllers/rolesController');
var userRoleController = require('./controllers/userRoleController');
var privilegesController = require('./controllers/privilegesController');
var privilegesRolesController = require('./controllers/privilegesRolesController');
var loginController = require('./controllers/loginController');
var genericController = require('./controllers/genericController');
var queriesController= require('./controllers/queriesController');

var Sequelize = require('sequelize');
var config = require('./config/DBConfig.json');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');

//connect to sequelize 
var sequelize=new Sequelize('globalvote', 'globalvote', 'gl0b4lv0t3',{
    port:5432,
    schema:'globalvote',
    dialect:'postgres'
});

var models= require('./models/index.js')(sequelize);

var auth = require('./config/passport')(passport,models.users);

var port = process.env.PORT || 3000;

app.use('/assets',express.static(__dirname+'/public'));
app.use(session({ secret: 'globalvote',resave: true, saveUninitialized:true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'ejs');

loginController(models,app,passport);
genericController(models,app)
usersController(models,app);
rolesController(models,app);
userRoleController(models,app,Sequelize);
privilegesController(models,app,Sequelize);
privilegesRolesController(models,app,Sequelize);
queriesController(sequelize,app);

app.listen(port,function(err){
    if(err){
        console.log('Something happend with the server');
        throw err;
    }
    console.log('Server is alive');
});