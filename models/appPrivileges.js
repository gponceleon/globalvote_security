module.exports = function(sequelize,Sequelize){
    return sequelize.define("appPrivileges",{
          app_privileges_id:{
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        privileges_name:Sequelize.STRING(100)
    },{
        schema: 'globalvote',
        freezeTableName: true,
        tableName: 'app_privileges',
        timestamps: false
    });
}