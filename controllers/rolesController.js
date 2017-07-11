var bodyParser = require('body-parser');

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(models,app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    const Roles = models.roles;

    app.route("/roles")
        .post(function(req,res){
           Roles.create({rolename:req.body.rolename,active:req.body.active}).then(
            function(result){
                res.send('Success')}
            ).catch(function(err){
                console.error('error running query', err);
                res.send('500, Error creating Role');
            });
        
        })
        .get(function(req,res){
            Roles.findAll()
            .then(function(roles){
                 if(isEmpty(roles)){
                    res.send('500,Roles do not exists');
                }else{
                    res.send(roles);
                }
            })
            .catch(function(err){
                console.error('error running query', err);
                res.send('500, error running query');
            });
        });

    app.route("/roles/:rolename")
        .get(function(req,res){
            Roles.findAll({
                where:{
                    rolename:req.params.rolename
                }
            }).then(function(rol){
                if(isEmpty(rol)){
                    res.send('500,Rol does not exists');
                }else{
                    res.send(rol);
                }
            }).catch(function(err){
                console.error('error running query', err);
                res.send('500,error running query');
            });

        })
        .delete(function(req,res){
            Roles.destroy({
                where:{
                    rolename:req.params.rolename
                }
            }).then(function(result){
                 res.send('Success');
            }).catch(function(err){
                console.error('error running query', err);
                res.send('500,error running query');
            });
        })
        .patch(function(req,res){
            Roles.update({
                active:req.body.active
            },{
                where:{
                    rolename:req.params.rolename
                }
            })
            .then(function(result){
                res.send('Success');
            })
            .catch(function(err){
                console.error('error running query', err);
                res.send('500,error running query');
            });
        });
}