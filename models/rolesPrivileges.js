module.exports = function(sequelize,Sequelize){
    return sequelize.define("rolesPrivileges",{
          roles_privileges_id:{
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    },{
        schema: 'globalvote',
        freezeTableName: true,
        tableName: 'roles_privileges',
        timestamps: false
    });
}