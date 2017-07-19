'use strict';

class InsertData{
    insertUseRole(models,data){
        return new Promise(function(resolve,reject){
            const UserRole = models.userRole;
            for(var i in data){
                UserRole.create({
                    users_id:data[i].users_id,
                    roles_id:data[i].roles_id,
                    granted_date: Date.now()
                }).then(function(res){
                    console.log('User with Role Saved');
                    resolve(res);
                }).catch(function(error){
                    console.log('User with Role has not been saved');
                    reject(error);
                });
            }
        });
    }

    insertPrivilegeRole(models,data){
        return new Promise(function(resolve,reject){
            const RolesPrivileges = models.rolesPrivileges;
            for(var i in data){
                RolesPrivileges.create({
                    roles_id:data[i].roles_id,
                    app_privileges_id:data[i].app_privileges_id
                }).then(function(result){
                    if(!isEmpty(result)){
                        console.log('Privilege with Role Saved');
                        resolve(result);
                    }
                }).catch(function(err){
                    console.log('Privilege with Role has not been saved');
                    reject(err);
                });
            }

        });
    }
}

module.exports = InsertData;