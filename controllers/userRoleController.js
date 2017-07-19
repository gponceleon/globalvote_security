var bodyParser = require('body-parser');
var InsertData = require('../promises/insertData');

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

        insert = new InsertData();
        insert.insertUseRole(models,req.body).then(function(rs){
            if(!isEmpty(rs)){
                res.status(200).send('Success!');
            }else{
                res.status(500).send('Error associating the user with the role');
            }
        }).catch(error=>{
            console.error(error);
            res.status(500).send('Error associating the user with the role');
        });
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
                res.status(500).send('No users granted with roles');
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
                res.status(200).send(result);
            }

        }).catch(function(err){
            console.error('error running query', err);
            res.status(500).send('Error in query')
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
                 res.status(200).send('Success!');
            }).catch(function(err){
                console.error('error running query', err);
                res.status(500).send('Error running query');
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
                res.status(500).send('User with that privilege does not exist');
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
                res.status(200).send(result);
            }
        })
    });

}