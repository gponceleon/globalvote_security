var sha1 = require('sha1');
var fs = require('fs');
var fileUpload = require('express-fileupload');

function ProcessFile(action){
    this.action=action;
    this.response =-1;
}

ProcessFile.prototype.users = function(models,res){
    console.log('Processing the file of '+this.action);
    var fileUsers = fs.readFile('/home/gponceleon/Documentos/GlobalVOte/globalVote-security/globalvote_security/files/users.txt','utf8',
        function(err,data){
            const User = models.users;
            var dataArray = data.split('\n');
            for(var i =0;i<dataArray.length-1;i++){
                var line = dataArray[i].split('|');
                User.create({username:line[0], password:sha1(line[1]),locked:line[2]}
                ).then(function(data){
                    res.send('x');
                }).catch(function(e){
                    throw new Error(e);
                });  
            }
        })
}

module.exports = ProcessFile;