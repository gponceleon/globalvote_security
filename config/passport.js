var LocalStrategy = require('passport-local').Strategy;
var sha1 = require('sha1');

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports= function(passport,User){

    passport.serializeUser(function(user,done){
        done(null,user.users_id);
    });

    passport.deserializeUser(function(id,done){
        User.findOne({
            where:{
                users_id:id
            }
        }).then(function(user){
            done(null,user);
        }).catch(function(err){
            done(err,null);
        });
    });

    passport.use('local-login',new LocalStrategy({
        usernameField:'username',
        passwordField:'password',
        passReqToCallback:true
    },
    
    function(req,username,password,done){
        process.nextTick(function(){
            User.findOne({
                where:{
                    username:username
                }
            }).then(function(user){
                user.toJSON();
                if(isEmpty(user)){
                    done(null,false,{message:'Unknown user'});
                }else if (sha1(password)!=user.dataValues.password){
                    done(null,false,{message:'Invalid password'});
                }else{
                    done(null,user);
                }
            }).catch(function(err){
                done(err);
            });
        });
    }
    
    ));
}
