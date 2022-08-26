const socket = io("/"); // calling io function
const chatInputBox = document.getElementById("chat_message");//storing id of ejs template inside variable
const all_messages = document.getElementById("all_messages");//storing id of ejs template inside variable
const main__chat__window = document.getElementById("main__chat__window");//storing id of ejs template inside variable
const participants = document.getElementById("participants");//storing id of ejs template inside variable
const videotable = document.getElementById("video-table");//storing id of ejs template inside variable
const myVideo = document.createElement("video");//storing id of ejs template inside variable
const room_participants = document.getElementById("room_participants");//storing id of ejs template inside variable

myVideo.muted = true;//for not recieving own voice
// connecting to peer via peerjs arrangements
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

let myVideoStream;
let id;
const peers = {};//storing peers on their ids
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

//setting initial controls of video and passing them as constraints
const constraints = {//initial conditions given to webrtc
      'video': true,
      'audio': true
};
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo,myVideoStream);//call to function addVideoStream
    //answering to calls
    peer.on("call", (call) => {
      call.answer(myVideoStream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);// Show stream in some video/canvas element.
      });
    });

    socket.on("user_connected", (userId,name,clients,old_messages) => {//recieving info
      id = userId;
      connectToNewUser(userId, stream,name);//call function with id and stream
      addParticipant(clients);
      if(all_messages.getElementsByTagName("li").length!==old_messages.length){
        addchat(old_messages);
      }
    });
    //adding event for messages of chat
    document.addEventListener("keydown", (e) => {
      if (e.which === 13 && chatInputBox.value != "") {
        let date_ob = new Date();//getting date and time
        let hours = `${date_ob.getHours()}`.padStart(2, '0');//parsing string accordingly
        let minutes = `${date_ob.getMinutes()}`.padStart(2, '0');//parsing string accordingly
        let date = `${date_ob.getDate()}`.padStart(2, '0');//parsing string accordingly
        let month = `${date_ob.getMonth()}`.padStart(2, '0');//parsing string accordingly
        let year = date_ob.getFullYear();//parsing string accordingly
        socket.emit("message", chatInputBox.value,username,hours,minutes,date,month,year);
        chatInputBox.value = "";
      }
    });
    //adding text to chat window
    socket.on("createMessage", (msg,name,hours,minutes,date,month,year) => {
      //console.log(msg);
      let li = document.createElement("li");
      let avatar = '<i  class="fa fa-user-tie"></i>';
      let bookmark= '<i class="bookmarks far fa-bookmark" style="padding-left:13px;margin-top:1px;font-size:17px;"></i>';
      li.innerHTML = avatar +'&nbsp;'+'&nbsp;'+ '<strong>'+ name + '</strong>'+'<div style="float:right;display:inline;margin-right:15px;">'+ hours + ":" + minutes+ bookmark+'</div>'+'<br>'+ msg;
      all_messages.append(li);
      main__chat__window.scrollTop = main__chat__window.scrollHeight;//scrolled to latest message
      li.querySelector('.bookmarks').addEventListener('click', () =>{//used to bookmark messages
        li.innerHTML="";
        let avatar = '<i class="fa fa-user-tie"></i>';
        let bookmark= '<i class="bookmarks fa fa-bookmark" style="padding-left:13px;margin-top:1px;font-size:17px;"></i>';
        li.innerHTML = avatar +'&nbsp;'+'&nbsp;'+ '<strong>'+ name + '</strong>'+'<div style="float:right;display:inline;margin-right:15px;">'+ hours + ":" + minutes+ bookmark+'</div>'+ '<br>'+ msg ;
      socket.emit("bookmark_msg",msg,name,date+"-"+month+"-"+year,username);//storing messages
    });
    });
  });
  //For disconnecting user
  socket.on("user_disconnected", (id,name,clients) => {
    document.getElementById(name).remove();//removing participant on disconnecting
    addParticipant(clients);
    if (peers[id]) {peers[id].close()};//closng peer
    let totalUsers = document.getElementsByTagName("video").length;//gettting all the videos
      let width = 200/totalUsers;
      if(totalUsers%2===1){
        width = 200/(totalUsers+1);
      }
      //aliging videos accordingly
      //spiliting videos in top and bottom rows
      for (let index = 0; index < totalUsers; index++) {
        document.getElementsByTagName("video")[index].style.width =
          width + "%";
        document.getElementsByTagName("video")[index].style.height ='240px';
        if(index>=6){
          document.getElementsByTagName("video")[index].style.display ='none;';
        }
      }
      if(totalUsers===1){
        document.getElementsByTagName("video")[0].style.width ='240px';
      }
  });
  //calling peer on joining
peer.on("call", function (call) {
  getUserMedia(constraints,
    function (stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      const video = document.createElement("video");
      call.on("stream", function (remoteStream) {
        addVideoStream(video, remoteStream); // Show stream in some video/canvas element.
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});

peer.on("open", (id) => {//send with an id for user
  // on open will be launch when you successfully connect to peerServer
  socket.emit("join_room", ROOM_ID, id,username);//emiting event
});

// Fetch an array of devices of a certain type
async function getConnectedDevices(type) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
}

// Open camera with echoCancellation for better audio
async function openCamera(cameraId) {
    const constraints = {
        'audio': {'echoCancellation': true}
        }
    return await navigator.mediaDevices.getUserMedia(constraints);
}

const cameras = getConnectedDevices('videoinput');
if (cameras && cameras.length > 0) {
    const stream = openCamera(cameras[0].deviceId);
}

function connectToNewUser (userId, streams,name) {
  const call = peer.call(userId, streams);
  //console.log(call);
  const video = document.createElement("video");
  video.setAttribute("id", username);
  call.on("stream", (userVideoStream) => {
    //console.log(userVideoStream);
    addVideoStream(video, userVideoStream,name);
  });
  call.on('close', () => {
   video.remove()//for removing video elemnt on closing call
 });
 peers[userId] = call;
};
// addparticipants in participants section
const addParticipant = (clients) => {
    while (room_participants.lastElementChild) {
    room_participants.removeChild(room_participants.lastElementChild);
  }
    for(let i=0;i<clients.length;i++){
       let li = document.createElement("li");
       let avatar = '<i class="fa fa-user-tie"></i>';
       let star = '<i class="far fa-star stars"></i>';
       let flag='';
       if(i==0){
          flag = '<i class="fas fa-flag"></i>';
       }
       li.innerHTML = avatar +'&nbsp;'+'&nbsp;'+ '<strong style="padding-right:10px;">'+ clients[i].name + '</strong>' +flag+'<div style="float:right;display:inline;margin-right:15px;">' + star + '</div>';
       room_participants.append(li);
       li.querySelector('.stars').addEventListener('click', () =>{//star all the attendeeed in the room
         li.innerHTML="";
         let avatar = '<i class="fa fa-user-tie"></i>';
         let star = '<i class="fa fa-star stars"></i>';
         li.innerHTML = avatar +'&nbsp;'+'&nbsp;'+ '<strong style="padding-right:10px;">'+ clients[i].name +  '</strong>' +flag+'<div style="float:right;display:inline;margin-right:15px;">' + star + '</div>';
       socket.emit("star_name",clients[i].name,username);
     });
     }
}
// adding videostream in this section
const addVideoStream = (videoEl, stream,name) => {
  videoEl.srcObject = stream;
  videoEl.addEventListener("loadedmetadata", () => {
    videoEl.play();
  });

  videotable.append(videoEl);//adding video to front-end
  //videotable.append(videoEl);//adding username to front-end participants lists
  let totalUsers = document.getElementsByTagName("video").length;
    let width = 200/totalUsers;
    if(totalUsers%2===1){
      width = 200/(totalUsers+1);
    }
    // again aliging videos as did before
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName("video")[index].style.width =
        width + "%";
      document.getElementsByTagName("video")[index].style.height ='240px';
      if(index>=6){
        document.getElementsByTagName("video")[index].style.display ='none;';
      }
    }
    if(totalUsers===1){
      document.getElementsByTagName("video")[0].style.width ='240px';
    }
    // getting initial conditions to work with
  if(initial_video==false){
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  }
  if(initial_audio==false){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  }
  ShowCAndHideP();//showing chat initially
};
//js for pause and play of video
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    setStopVideo();
  }
};

//js of pause and play of audio
const muteUnmute = () => {
  let enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    setMuteButton();
  }
};
//setting icon for representing current state of video
const setPlayVideo = () => {
  const html = `<i class="unmute fas fa-video-slash"></i>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};
//setting icon for representing current state of video
const setStopVideo = () => {
  const html = `<i class="greenicon fa fa-video"></i>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

//setting icon for representing current state of audio
const setUnmuteButton = () => {
  const html = `<i class="unmute fa fa-microphone-slash"></i>`;
  document.getElementById("muteButton").innerHTML = html;
};
//setting icon for representing current state of audio
const setMuteButton = () => {
  const html = `<i class="greenicon fa fa-microphone"></i>`;
  document.getElementById("muteButton").innerHTML = html;
};
// show chat and hide  participants
const ShowCAndHideP=()=> {
    var part = document.getElementById('participants');
    var chat = document.getElementById('main__chat__window');
    var inp = document.getElementById('chat_message');
    part.style.display = 'none';
    chat.style.display = 'block';
    inp.style.display = 'block';
};
//show participants hide chat
const ShowPAndHideC=()=> {
    var part = document.getElementById('participants');
    var chat = document.getElementById('main__chat__window');
    var inp = document.getElementById('chat_message');
    part.style.display = 'block';
    chat.style.display = 'none';
    inp.style.display = 'none';
};
//Sharing the meet url details
const copy_url=()=>{
  const el = document.createElement('textarea');
  el.value = "http://localhost:3000/room/initial/" + ROOM_ID +"/false/";
  document.body.appendChild(el);
  el.select();
  document.getElementById("popop").style.display = "inline";
  document.execCommand('copy');	// Copy command
  document.body.removeChild(el);
  setTimeout( function() {
        document.getElementById("popop").style.display = "none";
    }, 2500);
};
// end the call
const endcall=()=>{
    myVideoStream.getAudioTracks()[0].enabled = false;
    myVideoStream.getVideoTracks()[0].enabled = false;
    socket.emit("disconnect_user",id,ROOM_ID,username);
    socket.disconnect();
    window.location.href = "http://localhost:3000/";
};
// adding old chats 
const addchat=(old_messages)=>{
  while (all_messages.lastElementChild) {
  all_messages.removeChild(all_messages.lastElementChild);
}
    for(let i=0;i<old_messages.length;i++){
      let li = document.createElement("li");
      let avatar = '<i  class="fa fa-user-tie"></i>';
      let bookmark= '<i class="bookmarks far fa-bookmark" style="padding-left:13px;margin-top:1px;font-size:17px;"></i>';
      li.innerHTML = avatar +'&nbsp;'+'&nbsp;'+ '<strong>'+ old_messages[i].name + '</strong>'+'<div style="float:right;display:inline;margin-right:15px;">'+old_messages[i].date+ bookmark+'</div>'+'<br>'+ old_messages[i].message;
      all_messages.append(li);
      main__chat__window.scrollTop = main__chat__window.scrollHeight;//scrolled to latest message
      li.querySelector('.bookmarks').addEventListener('click', () =>{
        li.innerHTML="";
        let avatar = '<i class="fa fa-user-tie"></i>';
        let bookmark= '<i class="bookmarks fa fa-bookmark" style="padding-left:13px;margin-top:1px;font-size:17px;"></i>';
        li.innerHTML = avatar +'&nbsp;'+'&nbsp;'+ '<strong>'+ old_messages[i].name + '</strong>'+'<div style="float:right;display:inline;margin-right:15px;">'+ old_messages[i].date+ bookmark+'</div>'+ '<br>'+ old_messages[i].message ;
      socket.emit("bookmark_msg",old_messages[i].message,old_messages[i].name,old_messages[i].date,username);
    });
  }
};
