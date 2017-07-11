var config = require('./DBConfig.json');
var Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database,config.username,config.password,{
    host:config.host, dialect:'postgres',
    pool:{
        max:5,
        min:0,
        idle:10000
    }
});


module.exports=sequelize;
