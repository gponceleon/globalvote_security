module.exports = function(sequelize,Sequelize){
    return sequelize.define("users",{
          users_id:{
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        username:Sequelize.STRING(50),
        password:Sequelize.STRING(50),
        locked:Sequelize.BOOLEAN,
        creation_date:Sequelize.DATE
    },{
        schema: 'globalvote',
        freezeTableName: true,
        tableName: 'users',
        timestamps: false
    });
}



  
    