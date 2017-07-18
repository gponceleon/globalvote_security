var bodyParser = require('body-parser');
var sha1 = require('sha1');
var fs = require('fs');
const fileUpload = require('express-fileupload');
var ProcessFile = require('../promises/processFile');
var multer = require('multer');
var wait=require('wait.for');
var serverPath='/home/gponceleon/Documentos/GlobalVOte/globalVote-security/globalvote_security/files/';

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../files/');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage });

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(models,app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(fileUpload());

        app.post("/uploadFile",function(req,res){
        if(isEmpty(req.files)){
            res.status(400).send('No files were upload');
        }else{
            let file = req.files.sampleFile; 
            filename=req.files.sampleFile.name;
            file.mv(serverPath+req.files.sampleFile.name,function(err){
                if(err){
                    res.status(500).send(err);
                }else{
                    var path=serverPath+filename;
                    var pf = new ProcessFile();
                    var name = filename.split('.');
                    pf.readFilePromise(path,name[0]).then(data=>{
                        if(!isEmpty(data)){
                            if(name[0]==="users"){
                                pf.writeUsersInDB(models,data).then(rs=>{
                                    console.log("File proccessed");
                                    return res.status(200).send('Success!');
                                })
                                .catch(error=>{
                                    console.error(error);
                                    return res.status(500).send('Something Happend!');
                                });
                            }else if (name[0]==="roles"){
                                pf.writeRolesInDB(models,data).then(rs=>{
                                    console.log("File proccessed");
                                    return res.status(200).send('Success!');
                                })
                                .catch(error=>{
                                    console.error(error);
                                    return res.status(500).send('Something Happend!');
                                });
                            }else{
                                pf.writePrivileges(models,data).then(rs=>{
                                    console.log("File proccessed");
                                    return res.status(200).send('Success!');
                                })
                                .catch(error=>{
                                    console.error(error);
                                    return res.status(500).send('Something Happend!');
                                });
                            }
                        }
                    }).catch(error=>{
                        console.error(error);
                        return res.status(500).send('Something Happend!');
                    });

                }
            });
        }
    });


app.post('/bulkLoad',upload.single('file1'), function(req, res, next){
    
    if(isEmpty(req.files)){
            return res.status(400).send('No files were upload');
    }else{

        var pf=new ProcessFile();

        for(var i=0;i<2;i++){
            var nf='file'+(i+1);
            var file=req.files[nf];
            var filename=file.name;
            var path = serverPath+filename;
            file.mv(path,function(err){
                if(err){
                    console.error(error);
                    return res.status(500).send('Something Happend!');
                }
            });

        }

        //load the users.txt
        var usersfile=serverPath+'users.txt';
        pf.readFilePromise(usersfile,'users').then(data=>{
            if(!isEmpty(data)){
                pf.writeUsersInDB(models,data).then(rs=>{
                    console.log("File proccessed");
                    res.status(200);
                }).catch(error=>{
                    console.error(error);
                    res.setHeader(usersFail,true);
                    res.status(500);
                });
            }
        }).catch(err=>{
            console.error(error);
            res.status(500).send('Something Happend and no file has been loaded!');
        });

        //load the roles.txt
        var rolefile=serverPath+'roles.txt';
        pf.readFilePromise(rolefile,'roles').then(data=>{
            if(!isEmpty(data)){
                pf.writeRolesInDB(models,data).then(rs=>{
                    console.log("File proccessed");
                    res.status(200);
                }).catch(error=>{
                    console.error(error);
                    res.setHeader(rolesFail,true);
                    res.status(500);
                });
            }
        }).catch(err=>{
            console.error(error);
            res.status(500).send('Something Happend and roles.txt has not been loaded!');
        });

        //load the priivilege.txt
        var privilegefile=serverPath+'privileges.txt';
        pf.readFilePromise(privilegefile,'roles').then(data=>{
            if(!isEmpty(data)){
                pf.writePrivileges(models,data).then(rs=>{
                    console.log("File proccessed");
                    res.status(200);
                }).catch(error=>{
                    console.error(error);
                    res.setHeader(privilegeFail,true);
                    res.status(500);
                });
            }
        }).catch(err=>{
            console.error(error);
            res.status(500).send('Something Happend and roles.txt has not been loaded!');
        });
        if(res.status==200){
            res.send('Success!');   
        }else{
            res.status(500).send('Something Happend and some file has not been load loaded!');
        }
    }
});


app.get('/uploadFile',function(req,res){
    res.render('loadFile.ejs');
});

app.get('/bulkLoad',function(req,res){
     res.render('bulkLoad.ejs');
});

}