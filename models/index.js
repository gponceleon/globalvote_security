module.exports = function(sequelize){
    var models = {};
    models.users=sequelize.import("./users.js");
    models.roles=sequelize.import("./roles.js");
    models.userRole=sequelize.import("./userRole.js");
    models.appPrivileges=sequelize.import("./appPrivileges.js");
    models.rolesPrivileges=sequelize.import("./rolesPrivileges.js");

    /*User*/
    models.users.hasMany(models.userRole,{foreignKey:'users_id'});
    
    /*Roles*/
    models.roles.hasMany(models.userRole,{foreignKey:'roles_id'});
    models.roles.hasMany(models.rolesPrivileges,{foreignKey:'roles_id'});

    /*App_Privileges*/
    models.appPrivileges.hasMany(models.rolesPrivileges,{foreignKey:'app_privileges_id'});

    /*User_Role*/
    models.userRole.belongsTo(models.users,{foreignKey:'users_id'});
    models.userRole.belongsTo(models.roles,{foreignKey:'roles_id'});

    /*Roles_Privileges*/
    models.rolesPrivileges.belongsTo(models.appPrivileges,{foreignKey:'app_privileges_id'});
    models.rolesPrivileges.belongsTo(models.roles,{foreignKey:'roles_id'});

    return models;
};