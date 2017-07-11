module.exports = function(sequelize,Sequelize){
    return sequelize.define("roles",{
          roles_id:{
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        rolename:Sequelize.STRING(50),
        active:Sequelize.BOOLEAN
    },{
        schema: 'globalvote',
        freezeTableName: true,
        tableName: 'roles',
        timestamps: false
    });
}
