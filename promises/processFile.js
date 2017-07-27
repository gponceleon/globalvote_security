'use strict';

var fs = require('fs');
var util = require('util');
var sha1 = require('sha1');
var json2csv = require('json2csv');
var path = require('path');
var zipFolder = require('zip-folder');


class ProcessFile{
    
    readFilePromise(path,filename){
            return new Promise(function(resolve,reject){
            fs.readFile(path,{encoding:'utf8'},
                (error,data)=>{
                    if(error){
                        reject(error)
                    }else{
                        var result=[];
                        var dataInFile = data.split('\n');
                        for(var i=0;i<dataInFile.length-1;i++){
                            var line = dataInFile[i].split('|');
                            var size=line.length;
                            var aux={};
                            for(var j=0;j<size;j++){
                                var name ='data'+j;
                                if(j==1 && filename=="users"){
                                     aux[name]=sha1(line[j]);
                                }else{
                                    
                                    aux[name]=line[j];
                                }
                                   
                            }

                            result[i]=aux;                        
                        }
                        resolve(result);
                    }
                }
            );
        });
    }

    isEmpty(obj){
        return !Object.keys(obj).length;
    }

    writeUsersInDB(models,data){
        return new Promise(function(resolve,reject){
            const User = models.users;
            for(var i=0;i<data.length;i++){
                User.create({
                    username:data[i].data0,
                    password:data[i].data1,
                    locked:data[i].data2
                }).then(function(res){
                    console.log('User Saved');
                    resolve(res);
                }).catch(function(error){
                    console.log('User has not been saved');
                    reject(error);
                });
            }           
        });
    } 

    writeRolesInDB(models,data){
        return new Promise(function(resolve,reject){
            const Role = models.roles;
            for(var i=0;i<data.length;i++){
                Role.create({
                    rolename:data[i].data0,
                    active:data[i].data1
                }).then(function(res){
                    console.log('Role Saved');
                    resolve(res);
                }).catch(function(error){
                    console.log('Role has not been saved');
                    reject(error);
                });
            }           
        });
    }

    writePrivileges(models,data){
        return new Promise(function(resolve,reject){
            const Privileges = models.appPrivileges;
            for(var i=0;i<data.length;i++){
                Privileges.create({
                    privileges_name:data[i].data0
                }).then(function(res){
                    console.log('Privilege Saved');
                    resolve(res);
                }).catch(function(error){
                    console.log('Privilege has not been saved');
                    reject(error);
                });
            }
        });
    }

    moveFile(file,filePath){
        return new Promise(function(resolve,reject){
             file.mv(filePath,function(err){
                if(err){
                    reject(error);
                }else{
                    resolve(1);
                }
            });
        });
    }

    writeResult(filePath,dat,myfields){
        return new Promise(function(resolve,reject){
            try{
                var result=json2csv({data:dat,fields:myfields});
                fs.writeFile(filePath,result,function(err){
                    if(err){
                        reject(err);
                    }else{
                        resolve(1);
                    }
                })

            }catch(err){
                reject(err);
            }
        })
    }
  
    compressFile(dirPath){
        var zipFolder = require('zip-folder');
        var folderOut='/home/gponceleon/Documentos/GlobalVOte/globalVote-security/globalvote_security/files';
        return new Promise(function(resolve,reject){
            zipFolder(dirPath,folderOut+'/queriesOut.zip',function(err){
                if(err){
                    console.log('Something happended');
                    reject(err);
                }else{
                    var data ="Folder compressed";
                    resolve(data);
                }
            });
        });
    }
}

module.exports = ProcessFile;
