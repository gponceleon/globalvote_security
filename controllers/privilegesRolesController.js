var bodyParser = require('body-parser');
var InsertData = require('../promises/insertData');

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

        insert = new InsertData();
        insert.insertPrivilegeRole(models,req.body).then(function(rs){
            if(!isEmpty(rs)){
                res.status(200).send('Success!');
            }else{
                res.status(500).send('Error associating the privilege with the role');
            }
        }).catch(error=>{
            console.error(error);
            res.status(500).send('Error associating the privilege with the role');
        });

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
                     res.status(200).send(result);
                }
            })
            .catch(Sequelize.ValidationError,function(err){
                console.error('error running query', err);
                res.status(500).send('Error listing the privilege with the role');
            });
        
        }catch(error){
            res.status(500).send('Error listing the privileges with the roles');
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
                    rs.status(500).send('Role did not have privileges');
                }else{
                    var result=[];
                    for(var i in rs){
                        var aux={};
                        aux.app_privileges_id=rs[i].app_privileges_id;
                        aux.privilges_name=rs[i].appPrivilege.privileges_name;
                        result[i]=aux;
                    }
                }
                res.status(200).send(result);
            })
            .catch(Sequelize.ValidationError,function(err){
                console.error('error running query', err);
                res.status(500).send('Error listing the privilege with the role');
            });
        }catch(error){
            console.error('error running query', error);
            res.status(500).send('Error listing the privilege with the role');
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
                res.status(200).send('Success!');
            })
            .catch(Sequelize.ValidationError,function(err){
                console.error('error running query', err);
                res.status(500).send('Error deleting the privilege with the role');
            });
        }catch(error){
            console.error('error running query', error);
            res.status(500).send('Error deleting the privilege with the role');
        }
    });
}