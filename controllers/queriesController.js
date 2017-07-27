var bodyParser = require('body-parser');
var ProcessFile = require('../promises/processFile');
var serverPath='/home/gponceleon/Documentos/GlobalVOte/globalVote-security/globalvote_security/files/out';
var pf = new ProcessFile();

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(sequelize,app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.get('/usersRoles/:print',function(req,res){
        sequelize.query('SELECT U.USERNAME, R.ROLENAME,UR.GRANTED_DATE FROM GLOBALVOTE.USERS U JOIN GLOBALVOTE.USER_ROLE UR ON(UR.USERS_ID=U.USERS_ID) JOIN GLOBALVOTE.ROLES R ON(R.ROLES_ID=UR.ROLES_ID) GROUP BY U.USERNAME,R.ROLENAME,UR.GRANTED_DATE ORDER BY 1 ASC' 
        ,{ type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                if(req.params.print=='yes'){
                    var myfields = ['username','rolename','granted_date'];
                    pf.writeResult(serverPath+'/usersRoles.csv',result,myfields).then(data=>{
                    res.status(200).send(result);
                    }).catch(err=>{
                         res.status(500).send('no exists any users with roles assigned');
                    });
                }else{
                   res.status(200).send(result); 
                }
            }else{
                res.status(500).send('no exists any users with roles assigned');
            }
        });
    });

    app.get('/amountPrivileges/:print',function(req,res){
        sequelize.query('SELECT R.ROLENAME, COUNT(RP.APP_PRIVILEGES_ID) AMOUNTPRIVILEGES FROM ROLES R JOIN ROLES_PRIVILEGES RP ON(RP.ROLES_ID=R.ROLES_ID) GROUP BY R.ROLENAME'
        ,{ type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                if(req.params.print=='yes'){
                    var myfields=['rolename','amountprivileges'];
                    pf.writeResult(serverPath+'/amountPrivileges.csv',result,myfields).then(data=>{
                    res.status(200).send(result);
                    }).catch(err=>{
                         res.status(500).send('no exists any roles with privileges assigned');
                    });
                }else{
                     res.status(200).send(result);
                }
            }else{
                res.status(500).send('no exists any roles with privileges assigned');
            }
        });
    });

    app.get('/amountRoles/:print',function(req,res){
        sequelize.query('SELECT  U.USERNAME,COUNT(UR.ROLES_ID) AMOUNTROLES'
                       + ' FROM GLOBALVOTE.USERS U'
                       + ' JOIN GLOBALVOTE.USER_ROLE UR'
                       + ' ON(UR.USERS_ID=U.USERS_ID)'
                       +' GROUP BY U.USERNAME'
        ,{ type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                if(req.params.print=='yes'){
                    var myfields=['username','amountroles'];
                    pf.writeResult(serverPath+'/amountRoles.csv',result,myfields).then(data=>{
                        res.status(200).send(result)
                    }).catch(err=>{
                        res.status(500).send('no exists any users with roles assigned');
                    });
                }else{
                    res.status(200).send(result);
                }
            }else{
                res.status(500).send('no exists any users with roles assigned');
            }
        });
    });

    app.get('/usersRoles/:userId/:print',function(req,res){
        sequelize.query('SELECT U.USERNAME, R.ROLENAME,UR.GRANTED_DATE FROM GLOBALVOTE.USERS U JOIN GLOBALVOTE.USER_ROLE UR ON(UR.USERS_ID=U.USERS_ID) JOIN GLOBALVOTE.ROLES R ON(R.ROLES_ID=UR.ROLES_ID)  WHERE U.USERS_ID=? ORDER BY 3 ASC' 
        ,{replacements: [req.params.userId], type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                if(req.params.print=='yes'){
                    var myfields = ['username','rolename','granted_date'];
                    pf.writeResult(serverPath+'/userRoles.csv',result,myfields).then(data=>{
                        res.status(200).send(result)
                    }).catch(err=>{
                        res.status(500).send('no exists any users with roles assigned');
                    });
                }else{
                    res.status(200).send(result);
                }
            }else{
                res.status(500).send('no exists any users with roles assigned');
            }
        });
    });

    app.get('/amountRoles/:userId/:print',function(req,res){
        sequelize.query('SELECT  U.USERNAME,COUNT(UR.ROLES_ID) AMOUNTROLES'
                       + ' FROM GLOBALVOTE.USERS U'
                       + ' JOIN GLOBALVOTE.USER_ROLE UR'
                       + ' ON(UR.USERS_ID=U.USERS_ID)'
                       + ' WHERE U.USERS_ID=?'
                       +' GROUP BY U.USERNAME'
        ,{replacements: [req.params.userId], type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                if(req.params.print=='yes'){
                    var myfields=['username','amountroles'];
                    pf.writeResult(serverPath+'/userAmountRoles.csv',result,myfields).then(data=>{
                        res.status(200).send(result)
                    }).catch(err=>{
                        res.status(500).send('no exists any users with roles assigned');
                    });
                }else{
                    res.status(200).send(result);
                }
            }else{
                res.status(500).send('no exists any users with roles assigned');
            }
        });
    });

    app.get('/amountPrivileges/:roleId/:print',function(req,res){
        sequelize.query('SELECT R.ROLENAME, COUNT(RP.APP_PRIVILEGES_ID) AMOUNTPRIVILEGES FROM ROLES R JOIN ROLES_PRIVILEGES RP ON(RP.ROLES_ID=R.ROLES_ID) WHERE R.ROLES_ID=? GROUP BY R.ROLENAME'
        ,{replacements: [req.params.roleId], type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                if(req.params.print=='yes'){
                        var myfields=['rolename','amountprivileges'];
                        pf.writeResult(serverPath+'/x.csv',result,myfields).then(data=>{
                        res.status(200).send(result);
                    }).catch(err=>{
                         res.status(500).send('error write file');
                    });
                }else{
                     res.status(200).send(result);
                }
            }else{
                res.status(500).send('no exists any roles with privileges assigned');
            }
        });
    });

    app.get('/compressResult',function(req,res){
        pf.compressFile(serverPath).then(data=>{
            res.status(200).send(data);
        }).catch(err=>{
            res.status(500).send('no exists any roles with privileges assigned');
        })
    });

    app.get('/federalEntityVotes/:print',function(req,res){
        sequelize.query('SELECT FE.ENTITY_NAME, SUM(TOTAL_VOTES) VOTES'
                        +' FROM GLOBALVOTE.FEDERAL_ENTITY FE'
                        +' JOIN GLOBALVOTE.FEDERAL_DISTRICT FD'
                        +' ON(FE.FEDERAL_ENTITY_ID=FD.FEDERAL_ENTITY_ID)'
                        +' JOIN GLOBALVOTE.DISTRICT_MUNICIPALITY DM'
                        +' ON(DM.FEDERAL_DISTRICT_ID=FD.FEDERAL_DISTRICT_ID)'
                        +' JOIN GLOBALVOTE.SECTIONS S'
                        +' ON(S.DISTRICT_MUNICIPALITY_ID=DM.DISTRICT_MUNICIPALITY_ID)'
                        +' JOIN GLOBALVOTE.ELECTORAL_BOX EB'
                        +' ON(EB.SECTIONS_ID=S.SECTIONS_ID)'
                        +' JOIN MINUTES M'
                        +' ON(M.ELECTORAL_BOX_ID=EB.ELECTORAL_BOX_ID)'
                        +' JOIN GLOBALVOTE.PARTY_SCRUTINY PS'
                        +' ON(PS.MINUTES_ID=M.MINUTES_ID)'
                        +' GROUP BY FE.ENTITY_NAME'
        ,{type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                if(req.params.print=='si'){
                    var ps = new ProcessFile();
                    ps.writeFile(path,"consulta1.txt").then(data=>{
                        return res.status(200).send(result);
                    }).catch(err=>{
                        return res.status(500).send('no exists data from elections');
                    });             
                }
                res.status(200).send(result);
            }else{
                res.status(500).send('no exists data from elections');
            }
        });
    });

    app.get('/federalEntityPartyVotes',function(req,res){
        sequelize.query('SELECT FE.ENTITY_NAME,P.PARTY_NAME, SUM(TOTAL_VOTES) VOTES'
                        +' FROM GLOBALVOTE.FEDERAL_ENTITY FE'
                        +' JOIN GLOBALVOTE.FEDERAL_DISTRICT FD'
                        +' ON(FE.FEDERAL_ENTITY_ID=FD.FEDERAL_ENTITY_ID)'
                        +' JOIN GLOBALVOTE.DISTRICT_MUNICIPALITY DM'
                        +' ON(DM.FEDERAL_DISTRICT_ID=FD.FEDERAL_DISTRICT_ID)'
                        +' JOIN GLOBALVOTE.SECTIONS S'
                        +' ON(S.DISTRICT_MUNICIPALITY_ID=DM.DISTRICT_MUNICIPALITY_ID)'
                        +' JOIN GLOBALVOTE.ELECTORAL_BOX EB'
                        +' ON(EB.SECTIONS_ID=S.SECTIONS_ID)'
                        +' JOIN MINUTES M'
                        +' ON(M.ELECTORAL_BOX_ID=EB.ELECTORAL_BOX_ID)'
                        +' JOIN GLOBALVOTE.PARTY_SCRUTINY PS'
                        +' ON(PS.MINUTES_ID=M.MINUTES_ID)'
                        +' JOIN GLOBALVOTE.PARTY P'
                        +' ON(P.PARTY_ID=PS.PARTY_ID)'
                        +' GROUP BY FE.ENTITY_NAME,P.PARTY_NAME'
        ,{type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                res.status(200).send(result);
            }else{
                res.status(500).send('no exists data from elections');
            }
        });
    });

}

