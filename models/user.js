var mongoose = require('mongoose');

// collection of users entered in the app
var UserSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },// name
    status: {
        type: String,
        required: true
    },//status
    friend:[{
        name: { type: String }
    }],// friends or starred participants
    bookmark:[{
        message: { type: String },
        name: { type: String },
        date: {type:String}
    }],//book marks of the user
    invite:[{
        link: { type: String },
        name: { type: String },
        date: {type:String}
    }]//invites offered to the participant
});

var User = mongoose.model('User', UserSchema);
 module.exports = User;
