var bodyParser = require('body-parser');

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(sequelize,app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.get('/usersRoles/',function(req,res){
        sequelize.query('SELECT U.USERNAME, R.ROLENAME,UR.GRANTED_DATE FROM GLOBALVOTE.USERS U JOIN GLOBALVOTE.USER_ROLE UR ON(UR.USERS_ID=U.USERS_ID) JOIN GLOBALVOTE.ROLES R ON(R.ROLES_ID=UR.ROLES_ID) GROUP BY U.USERNAME,R.ROLENAME,UR.GRANTED_DATE ORDER BY 1 ASC' 
        ,{ type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                res.status(200).send(result);
            }else{
                res.status(500).send('no exists any users with roles assigned');
            }
        });
    });

    app.get('/amountPrivileges',function(req,res){
        sequelize.query('SELECT R.ROLENAME, COUNT(RP.APP_PRIVILEGES_ID) FROM ROLES R JOIN ROLES_PRIVILEGES RP ON(RP.ROLES_ID=R.ROLES_ID) GROUP BY R.ROLENAME'
        ,{ type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                res.status(200).send(result);
            }else{
                res.status(500).send('no exists any roles with privileges assigned');
            }
        });
    });

    app.get('/amountRoles',function(req,res){
        sequelize.query('SELECT  U.USERNAME,COUNT(UR.ROLES_ID)'
                       + ' FROM GLOBALVOTE.USERS U'
                       + ' JOIN GLOBALVOTE.USER_ROLE UR'
                       + ' ON(UR.USERS_ID=U.USERS_ID)'
                       +' GROUP BY U.USERNAME'
        ,{ type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                res.status(200).send(result);
            }else{
                res.status(500).send('no exists any users with roles assigned');
            }
        });
    });

    app.get('/usersRoles/:userId',function(req,res){
        sequelize.query('SELECT U.USERNAME, R.ROLENAME,UR.GRANTED_DATE FROM GLOBALVOTE.USERS U JOIN GLOBALVOTE.USER_ROLE UR ON(UR.USERS_ID=U.USERS_ID) JOIN GLOBALVOTE.ROLES R ON(R.ROLES_ID=UR.ROLES_ID)  WHERE U.USERS_ID=? ORDER BY 3 ASC' 
        ,{replacements: [req.params.userId], type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                res.status(200).send(result);
            }else{
                res.status(500).send('no exists any users with roles assigned');
            }
        });
    });

    app.get('/amountRoles/:userId',function(req,res){
        sequelize.query('SELECT  U.USERNAME,COUNT(UR.ROLES_ID)'
                       + ' FROM GLOBALVOTE.USERS U'
                       + ' JOIN GLOBALVOTE.USER_ROLE UR'
                       + ' ON(UR.USERS_ID=U.USERS_ID)'
                       + ' WHERE U.USERS_ID=?'
                       +' GROUP BY U.USERNAME'
        ,{replacements: [req.params.userId], type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                res.status(200).send(result);
            }else{
                res.status(500).send('no exists any users with roles assigned');
            }
        });
    });

    app.get('/amountPrivileges/:roleId',function(req,res){
        sequelize.query('SELECT R.ROLENAME, COUNT(RP.APP_PRIVILEGES_ID) FROM ROLES R JOIN ROLES_PRIVILEGES RP ON(RP.ROLES_ID=R.ROLES_ID) WHERE R.ROLES_ID=? GROUP BY R.ROLENAME'
        ,{replacements: [req.params.roleId], type: sequelize.QueryTypes.SELECT}
        ).then(result=>{
            if(!isEmpty(result)){
                res.status(200).send(result);
            }else{
                res.status(500).send('no exists any roles with privileges assigned');
            }
        });
    });
}

