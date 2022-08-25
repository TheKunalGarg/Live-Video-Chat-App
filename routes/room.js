var express = require('express');
var router = express.Router();
var url = require('url');
const { v4: uuidV4 } = require('uuid');//to generate unique id everytime for every room
var User = require('../models/user');
//calling upon a random unique id in params
router.get('/', function(req, res){
  res.redirect(`/room/initial/${uuidV4()}/true`);
});
//rendering to initial page where client-settings are done

router.get('/initial/:room/:host',function(req, res,next){
  //req.app.locals.clients = [];
  // page for setting initial conditions before redirecting to the room
    User.findOne({name:req.user.displayName},function(err,n){
     if(err){
       return console.log(err);
     }
     res.render('initial',{ room_id: req.params.room,host:req.params.host,friend:n.friend,username:req.user.displayName});
});
});
//fetching initial details
router.post('/initial/form/:room/:host', function(req, res){
  // fetching form details
   var audio = req.body.audio;
   var video = req.body.video;
   var username = req.body.username;
   var room_id = req.params.room;
   var host = req.params.host;
   // getting time
   let date_ob = new Date();
   date_ob.setMinutes(date_ob.getMinutes()+date_ob.getTimezoneOffset());
   // converting the time to indian standards
   let hours = `${date_ob.getHours()}`.padStart(2, '0');
   let minutes = `${date_ob.getMinutes()}`.padStart(2, '0');
   let date = `${date_ob.getDate()}`.padStart(2, '0');
   let month = `${date_ob.getMonth()}`.padStart(2, '0');
   let year = date_ob.getFullYear();
   //adding participants for host only proprety
   if(host==="true"){
     User.findOne({name:req.user.displayName},function(err,n){
       if(err){
         return console.log(err);
       }
       if(n){
        const keys = Object.keys(req.body);
       for(let i=0;i<keys.length;i++){
         const NEW_INVITE = {
       link: room_id,
       name: req.user.displayName,
       date: hours+":" + minutes+ "( " + date+"-"+month+"-"+year +" )"
     }
         User.findOneAndUpdate({name: keys[i]}, { $push: { invite: NEW_INVITE }}, function(err,doc) {
             if (err) { throw err; }
           });
          }
        }
     });}//redirecting to the room
   res.redirect(url.format({
       pathname:`/room/${room_id}/`,
       query: {
          "audio": audio,
          "video": video,
          "username":username,
          "host":host
        }
     }));
});
//rendering to room.ejs
router.get('/:room', function(req, res){
  var username = req.query.username;
  var audio = false;
  var video = false;
  var host =  req.query.host;
  if(req.query.audio==="on"){
    audio = true;
  }
  if(req.query.video==="on"){
    video = true;
  }
  res.render('room', { room_id: req.params.room,video:video,audio:audio,username:username,host:host});
});

// export
module.exports = router;
