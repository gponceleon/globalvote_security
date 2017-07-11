module.exports = function(sequelize,Sequelize){
    return sequelize.define("userRole",{
          user_role_id:{
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        granted_date: Sequelize.DATE(6)
    },{
        schema: 'globalvote',
        freezeTableName: true,
        tableName: 'user_role',
        timestamps: false
    });
}