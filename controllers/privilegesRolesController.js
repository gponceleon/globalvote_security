var bodyParser = require('body-parser');

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(models,app,Sequelize){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    const rolesPrivileges = models.rolesPrivileges;
    const roles = models.roles;
    const privileges = models.appPrivileges;

    app.route('/rolesPrivileges')
    .post(function(req,res){
     try { 
        for(var i in req.body){
            rolesPrivileges.create({
                roles_id:req.body[i].roles_id,
                app_privileges_id:req.body[i].app_privileges_id
                })
                .then(function(result){
                    if(isEmpty(result)){
                        res.send('Error with the associating the provilege with the role');
                    }else{
                        res.send('Success');
                    }
                })
                .catch(Sequelize.ValidationError,function(err){
                     console.error('error running query', err);
                    res.send('500, Error associating the privilege with the role');
                });
            } 
        } catch (error) {
          res.send('500, Error associating the privilege with the role');
          console.error('error running query', error);
        }

    })
    .get(function(req,res){
        try{
            rolesPrivileges.findAll({
                include:[{
                model:roles
            },
            {
                model:privileges
            }]})
            .then(function(rs){
                if(isEmpty(rs)){
                    res.send('No exists any Privileges');
                }else{
                    var result=[];
                    for(var i in rs){
                        var aux={};
                        aux.roles_privileges_id=rs[i].roles_privileges_id;
                        aux.roles_id=rs[i].roles_id;
                        aux.rolename=rs[i].role.rolename;
                        aux.app_privileges_id=rs[i].app_privileges_id;
                        aux.privileges_name=rs[i].appPrivilege.privileges_name;
                        result[i]=aux;   
                    }
                     res.send(result);
                }
            })
            .catch(Sequelize.ValidationError,function(err){
                console.error('error running query', err);
                res.send('500, Error listing the privilege with the role');
            });
        
        }catch(error){
            res.send('500, Error listing the privileges with the roles');
        }
    });
    app.route('/rolesPrivileges/:rolename')
    .get(function(req,res){
        try{
            rolesPrivileges.findAll({
                include:[{
                    model:roles,
                    where: { 
                        rolename:req.params.rolename
                    }
                },
                {
                    model:privileges

                }]
            })
            .then(function(rs){
                if(isEmpty(rs)){
                    rs.send('Role did not have privileges');
                }else{
                    var result=[];
                    for(var i in rs){
                        var aux={};
                        aux.app_privileges_id=rs[i].app_privileges_id;
                        aux.privilges_name=rs[i].appPrivilege.privileges_name;
                        result[i]=aux;
                    }
                }
                res.send(result);
            })
            .catch(Sequelize.ValidationError,function(err){
                console.error('error running query', err);
                res.send('500, Error listing the privilege with the role');
            });
        }catch(error){
            console.error('error running query', error);
            res.send('500, Error listing the privilege with the role');
        }
    });
    app.route('/rolesPrivileges/:roles_id/:privilege_id')
    .delete(function(req,res){
        try{
            rolesPrivileges.destroy({
                where:{
                    app_privileges_id:req.params.privilege_id,
                    roles_id:req.params.roles_id
                }
            })
            .then(function(result){
                res.send('Success');
            })
            .catch(Sequelize.ValidationError,function(err){
                console.error('error running query', err);
                res.send('500, Error deleting the privilege with the role');
            });
        }catch(error){
            console.error('error running query', error);
            res.send('500, Error deleting the privilege with the role');
        }
    });
}