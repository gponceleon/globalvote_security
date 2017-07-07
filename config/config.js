var postgres = require('pg');
var config = require('./DBConfig.json');


module.exports= { connectPostgres: function(){
        const pool = new postgres.Pool(config);
        return pool.connect();
    }
}





