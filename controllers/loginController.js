var bodyParser = require('body-parser');
var sha1 = require('sha1');

function isEmpty(obj){
    return !Object.keys(obj).length;
};



module.exports = function(models,app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    const User = models.users;

    app.post('/login',function(req,res){
        if(isEmpty(req.body)){
            res.send('Give username and password');
        }else{  
            User.findOne({
                where:{
                    username:req.body.username,
                },
                attributes: ['password']
            }).then(function(user){
                user.toJSON();
                console.log(user.dataValues.password);
                if(isEmpty(user)){
                    res.send('User does not exists');
                }else{
                    if(user.dataValues.password===sha1(req.body.password)){
                        res.send('Login Success'); 
                    }else{
                        res.send('Password invalid');
                    }
                }

            })
        }
    });
}