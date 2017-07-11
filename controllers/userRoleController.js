var bodyParser = require('body-parser');

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(models,app,Sequelize){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    const UserRole = models.userRole;
    const Users=models.users;
    const Roles=models.roles;

    app.route('/userRole')
    .post(function(req,res){
        UserRole.create({
            users_id:req.body.users_id,
            roles_id: req.body.roles_id,
            granted_date: Date.now()
        })
        .then(function(result){
            res.send('Success');
        })
        .catch(function(err){
            console.error('error running query', err);
            res.send('500, Error granting rol to user');
        })
    })
    .get(function(req,res){
        UserRole.findAll({
            include:[{
                model:Users
            },
            {
                model:Roles
            }]
        }).then(function(rs){
            if(isEmpty(rs)){
                res.send('No users granted with roles');
            }else{
                
                var result=[];
                for(var i in rs){
                    var aux ={};
                    aux.username=rs[i].user.username;
                    aux.users_id=rs[i].user.users_id;
                    aux.rolname=rs[i].role.rolename;
                    aux.roles_id=rs[i].role.roles_id;
                    aux.granted_date=rs[i].granted_date;
                    result[i]=aux;
                }
                res.send(result);
            }

        }).catch(function(err){
            console.error('error running query', err);
            res.send('500, Error in query')
        });
    });

    app.route("/userRole/:users_id/:roles_id")
    .delete(function(req,res){
            UserRole.destroy({
                where:{
                    users_id:req.params.users_id,
                    roles_id:req.params.roles_id
                }
            }).then(function(result){
                 res.send('Success');
            }).catch(function(err){
                console.error('error running query', err);
                res.send('500,error running query');
            });
    })
    .get(function(req,res){
          UserRole.findAll({
            where:{
                users_id:req.params.users_id,
                roles_id:req.params.roles_id
            },
            include:[{
                model:Users
            },
            {
                model:Roles
            }]
        }).then(function(rs){
            if(isEmpty(rs)){
                res.send('User with that privilege does not exist');
            }else{
                var result=[];
                for(var i in rs){
                    var aux ={};
                    aux.username=rs[i].user.username;
                    aux.users_id=rs[i].user.users_id;
                    aux.rolname=rs[i].role.rolename;
                    aux.roles_id=rs[i].role.roles_id;
                    aux.granted_date=rs[i].granted_date;
                    result[i]=aux;
                }
                res.send(result);
            }
        })
    });

}