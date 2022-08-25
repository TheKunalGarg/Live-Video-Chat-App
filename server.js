var express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

var path = require('path');
var config = require('./config/database');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');// required to extract data from form
// Initialising the app
var app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.redirect(`https://arrogant-mountie-58191.herokuapp.com/auth/google`);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//Initialising socket.io
const server = require("http").Server(app);
const io = require("socket.io")(server);

//Peer settings
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
//Connect to Database
mongoose.connect(config.database,);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!'");
});

// Views engine setup
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/peerjs', peerServer);//call for peerjs

// Using body-parser to get value of forms
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//google auth after getting entry into
app.get('/', (req, res) => {
  res.redirect(`https://arrogant-mountie-58191.herokuapp.com/auth/google`);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/home',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/logout', (req, res) => {
  req.session.destroy(function(e){
        req.logout();
        res.redirect('/');
    });
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});
var User = require('./models/user');
var Message = require('./models/message');
// Set routes
app.locals.clients=[];

app.use(function (req, res, next) {
    res.app.locals.clients= req.app.locals.clients;
    app.locals.user = req.user;
    next();
});
var home = require('./routes/home');// directing to the suitable route
var room = require('./routes/room');
app.use('/home',isLoggedIn,home);// checking if the user is loggedin or not
app.use('/room',isLoggedIn,room);

// using socket.io to emit and listen events between clients and server
io.on("connection", (socket) => {
  // listen to the event
  //emiting to the broadcast is sending to the whole roomId
  //on is to listen to the event which has been emiited by client
  socket.on("join_room", (roomId, userId,name) => {
    socket.join(roomId);//join room for the server
    Message.findOne({id:roomId},function(err,m){
       if(err){
         return console.log(err);
       }
       if(m){
         m.participants.push({name:name});
         m.save();
         socket.to(roomId).broadcast.emit("user_connected", userId,name,m.participants,m.new_message);//broadcasting to the room
       }
       else{
         var message = new Message({
            id:roomId,
            participants:[{name:name}],
            new_message:[]
          });
          message.save();
          socket.to(roomId).broadcast.emit("user_connected", userId,name,message.participants,message.new_message);//broadcasting to the room
       }
     });
    socket.on("message", (message,name,hours,minutes,time,month,year) => {
      let date =  hours + ":" + minutes;
      const NEW_COMMENT = {
    message: message,
    name: name,
    date: date
  }
   Message.findOneAndUpdate({id: roomId}, { $push: { new_message: NEW_COMMENT }}, function(err,doc) {
       if (err) { throw err; }
     });
      io.to(roomId).emit("createMessage", message,name,hours,minutes,time,month,year);
    });
    // disconnecting the user and deleting all its detals
    socket.on("disconnect_user", (userId,roomId,name) => {
      Message.update(
       { id: roomId },
       { $pull: { participants: {name:name } } }
       );
      Message.findOne({id:roomId},function(err,m){
        if(err){
          return console.log(err);
        }
        io.to(roomId).emit("user_disconnected",userId,name,m.participants);
        });
       });
     });
     // adding bookmark to databse
  socket.on("bookmark_msg",(msg,name,date,username)=>{
    const NEW_COMMENT = {
  message: msg,
  name: name,
  date: date
}
    User.findOneAndUpdate({name: username}, { $push: { bookmark: NEW_COMMENT }}, function(err,doc) {
        if (err) { throw err; }
      });
  });
  // adding stared friend to database
  socket.on("star_name",(name,username)=>{
    const NEW_FRIEND = {
  name: name
}
    User.findOneAndUpdate({name: username}, { $push: { friend: NEW_FRIEND }}, function(err,doc) {
        if (err) { throw err; }
      });
  });
});

server.listen(process.env.PORT || 3000);
