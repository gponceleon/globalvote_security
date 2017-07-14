var bodyParser = require('body-parser');
var sha1 = require('sha1');

function isEmpty(obj){
    return !Object.keys(obj).length;
};

module.exports = function(models,app,passport){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    const User = models.users;

    app.get('/', function(req, res) {
        res.render('index.ejs');  
    });

    app.get('/login', function(req, res) {

        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.get('/signup',function(req,res){
        res.render('signup.ejs');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/welcome', function(req, res) {
        res.render('welcome.ejs');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }

    app.post('/login',passport.authenticate('local-login',{
        successRedirect:'/welcome',
        failureRedirect: '/login',
        failureFlash:true
    }));
}