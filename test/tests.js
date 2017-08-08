var chai = require('chai');
var expect = chai.expect;
var ProcessFile = require('../promises/processFile');
var pf=new ProcessFile();

describe('ProcessFile',function(){
    it('read file for load in BD',function(){
    var result = pf.readFilePromise('/home/gponceleon/Documentos/GlobalVOte/globalVote-security/globalvote_security/files/users.txt');
    return result.then(function(data){
        expect(data).to.not.equal(undefined);
        });
    });
});

describe('WriteResult',function(){
    it('write result of query in file',function(){
        var path = '/home/gponceleon/Documentos/GlobalVOte/globalVote-security/globalvote_security/files/out/test.csv'
        var data = {'username':'admin','rolename':'DBA','granted_date':new Date()};
        var myfields=['username','rolename','granted_date'];
        var result = pf.writeResult(path,data,myfields);

        return result.then(function(data){
            expect(data).to.equal(1);
        });
    });
});

describe('CompressFile',function(){
    it('compress all query files',function(){
        var serverPath='/home/gponceleon/Documentos/GlobalVOte/globalVote-security/globalvote_security/files/out';
        var result = pf.compressFile(serverPath);
        return result.then(function(data){
            expect(data).to.not.equal(undefined);
        });
    });
});