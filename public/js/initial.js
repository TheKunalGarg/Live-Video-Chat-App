var video = document.querySelector("#videoElement");//selecting videoelemnt on id
// initial conditons
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
    // changing icons over the toggle buttons
    var nov = document.getElementById('nov');
    nov.style.display = 'none';
    var noa = document.getElementById('noa');
    noa.style.display = 'none';
};
// using webrtc to display preview page

//changing stop sign
const stop=()=>{
  var nov = document.getElementById('nov');
  var yesv = document.getElementById('yesv');
  if(nov.style.display=='none'){
    nov.style.display = 'inline';
    yesv.style.display = 'none';
  }
  else{
    yesv.style.display = 'inline';
    nov.style.display = 'none';
  }
};
// changing mute sign
const mute=()=>{
  var noa = document.getElementById('noa');
  var yesa = document.getElementById('yesa');
  if(noa.style.display=='none'){
    noa.style.display = 'inline';
    yesa.style.display = 'none';
  }
  else{
    yesa.style.display = 'inline';
    noa.style.display = 'none';
  }
};
const hide =()=>{
  var tab = document.getElementById('customers');
  tab.style.display='none';
};
const show =()=>{
  var tab = document.getElementById('customers');
  if(tab.style.display==='none'){
    tab.style.display='block';
  }
  else{
    tab.style.display='none';
  }
};
