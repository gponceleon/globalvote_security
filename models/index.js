module.exports = function(sequelize){
    var models = {};
    models.users=sequelize.import("./users.js");
    models.roles=sequelize.import("./roles.js");
    models.userRole=sequelize.import("./userRole.js");

    /*User*/
    models.users.hasMany(models.userRole,{foreignKey:'users_id'});
    
    /*Roles*/
    models.roles.hasMany(models.userRole,{foreignKey:'roles_id'});

    /*User_Role*/
    models.userRole.belongsTo(models.users,{foreignKey:'users_id'});
    models.userRole.belongsTo(models.roles,{foreignKey:'roles_id'});

    return models;
};