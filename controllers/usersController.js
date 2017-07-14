var bodyParser = require('body-parser');
var sha1 = require('sha1');
var fs = require('fs');
var path = require('path');
const fileUpload = require('express-fileupload');
var ProcessFile = require('../config/processFile');

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(models,app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(fileUpload());
    const users = models.users;

    app.route("/users")
        .post(function(req,res){
           users.create({username:req.body.username,
               password:sha1(req.body.password),
               locked:req.body.locked
            }).then(
            function(result){
                res.send(success);
            }
            ).catch(function(err){
                console.error('error running query', err);
                res.send('500, Error creating usere');
            });
        
        })
        .get(function(req,res){
            users.findAll()
            .then(function(users){
                 if(isEmpty(users)){
                    res.send('500,users do not exists');
                }else{
                    res.send(users);
                }
            })
            .catch(function(err){
                console.error('error running query', err);
                res.send('500, error running query');
            });
        });

    app.route("/users/:username")
        .get(function(req,res){
            users.findAll({
                where:{
                    username:req.params.username
                }
            }).then(function(user){
                if(isEmpty(user)){
                    res.send('500,User does not exists');
                }else{
                    res.send(user);
                }
            }).catch(function(err){
                console.error('error running query', err);
                res.send('500,error running query');
            });

        })
        .delete(function(req,res){
            users.destroy({
                where:{
                    username:req.params.username
                }
            }).then(function(result){
                 res.send('Success');
            }).catch(function(err){
                console.error('error running query', err);
                res.send('500,error running query');
            });
        })
        .patch(function(req,res){
            users.update({
                password:sha1(req.body.password)
            },{
                where:{
                    username:req.params.username
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

    app.post('/uploadUsers',function(req,res){
        
        if(!req.files){
            res.status(400).send('No files were upload');
        }else{
            let file = req.files.sampleFile;
            file.mv('/home/gponceleon/Documentos/GlobalVOte/globalVote-security/globalvote_security/files/'+req.files.sampleFile.name,function(err){
                if(err){
                    res.status(500).send(err);
                }else{

                    var pf = new ProcessFile('users');
                    var response= pf.users(models,res);
                    console.log(pf.response);
                    if(response==0){
                        res.status(500).send('Something happend');
                    }/*else{
                        res.status(500).send('Something happend');
                    }*/
                    
                }
            });
        }
    });

    app.get('/uploadUsers',function(req,res){
        res.render('loadUser.ejs');
    });
}