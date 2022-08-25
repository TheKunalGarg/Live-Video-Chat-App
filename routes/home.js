var express = require('express');
var router = express.Router();
var User = require('../models/user');//using user model
//calling upon a random unique id in params
router.get('/', function(req, res){
  req.app.locals.clients=[];
  //console.log(clients);
  // redirectng the user on home page at login
  User.findOne({name:req.user.displayName},function(err,name){
     if(err){
       return console.log(err);
     }
     if(name){
       res.render('home',{user:req.user,status:name.status,bookmark:name.bookmark,invite:name.invite});
     }
     else{
       var user = new User({
          name:req.user.displayName,
          status: "Free",
          friend:[],
          bookmark:[],
          invite:[]
        });
        user.save();//saving the details after login
        res.render('home',{user:req.user,status:user.status,bookmark:user.bookmark,invite:user.invite});
     }
   });
});
// post request to change status right now
router.post('/', function(req, res){
   var status = req.body.status;
   // returning the user onto the same page
   User.findOneAndUpdate({name: req.user.displayName}, {$set: {status: status}}, function(err,doc) {
       if (err) { throw err; }
       res.render('home',{user:req.user,status:status,bookmark:doc.bookmark,invite:doc.invite});
     });
});
// for joining the meet via url pasting
router.post('/join', function(req, res){
   var url = req.body.join_url;
   res.redirect(url);
});
// export
module.exports = router;
