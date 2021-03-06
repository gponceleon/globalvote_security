var bodyParser = require('body-parser');

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(models,app,Sequelize){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    const appPrivileges = models.appPrivileges;

    app.route('/privileges')
    .post(function(req,res){
        appPrivileges.create({privileges_name:req.body.privileges_name})
        .then(function(result){
            res.status(200).send('Success');
        })
        .catch(function(err){
            console.error('error running query', err);
            res.status(500).send('Error creating Privilege');
        });
    })
    .get(function(req,res){
        appPrivileges.findAll()
        .then(function(result){
            if(isEmpty(result)){
                res.status(500).send('No exists any Privileges');
            }else{
                res.status(200).send(result);
            }
        })
        .catch(function(err){
            console.error('error running query', err);
            res.status(200).send('Error listing Privileges');
        });
    });

    app.route('/privileges/:privilege_id')
    .get(function(req,res){
        appPrivileges.findAll({where:{app_privileges_id:req.params.privilege_id}})
        .then(function(result){
            if(isEmpty(result)){
                res.status(500).send('The privileges does not exists');
            }else{
                res.status(200).send(result);
            }
        })
    })
    .delete(function(req,res){
        appPrivileges.destroy({
            where:{
                app_privileges_id:req.params.privilege_id
            }
        }).then(function(result){
            res.status(200).send('Success!');
        }).catch(function(err){
            console.error('error running query', err);
            res.status(500).send('Error deleting Privilege');
        });
    })
    .patch(function(req,res){
        appPrivileges.update({
            privileges_name:req.body.privileges_name
        },{where:{
            app_privileges_id:req.params.privilege_id}
        }).then(function(result){
            res.status(200).send('Success!');
        })
        .catch(function(err){
            console.error('error running query', err);
            res.status(500).send('Error updating Privilege');
        });
    });
    
}