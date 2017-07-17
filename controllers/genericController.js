var bodyParser = require('body-parser');
var sha1 = require('sha1');
var fs = require('fs');
const fileUpload = require('express-fileupload');
var ProcessFile = require('../promises/processFile');
function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(models,app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(fileUpload());

        app.post("/uploadFile",function(req,res){
        var serverPath='/home/gponceleon/Documentos/GlobalVOte/globalVote-security/globalvote_security/files/'
        if(!req.files){
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
                                    res.send('Sucess');
                                })
                                .catch(error=>{
                                    console.error(error);
                                    res.send('Something Happend!');
                                });
                            }else if (name[0]==="roles"){
                                pf.writeRolesInDB(models,data).then(rs=>{
                                    console.log("File proccessed");
                                    res.send('Sucess');
                                })
                                .catch(error=>{
                                    console.error(error);
                                    res.send('Something Happend!');
                                });
                            }
                        }
                    }).catch(error=>{
                        console.error(error);
                        res.send('Something Happend!');
                    });

                }
            });
        }
    });

    app.get('/uploadFile',function(req,res){
        res.render('loadFile.ejs');
    });
}