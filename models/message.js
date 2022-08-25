var mongoose = require('mongoose');
// creating collection of to keep data of the active room

var MessageSchema = mongoose.Schema({
  id:{
    type:String,
    required:true
  },//id of room
  new_message:[{
        message: { type: String },
        name: { type: String },
        date: {type:String}
    }],//message
  participants:[{
          name: { type: String }
      }]//all participants
});

var Message = mongoose.model('Message', MessageSchema);
 module.exports = Message;
