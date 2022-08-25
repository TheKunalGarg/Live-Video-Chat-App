//status updating of user
const  updatestatus = () => {
  const homestat = document.getElementById("nowstat");
  const updstat = document.getElementById("updstat");
  homestat.style.display = 'none';
  updstat.style.display = 'inline';
}
// working for the display none of all others then the id to work and others will have display none
const  room = () => {
  const bookmarks = document.getElementById("bookmarks");
  const room = document.getElementById("room");
  const invites = document.getElementById("invites");
  const bookmarkss = document.getElementById("bookmarkss");
  const rooms = document.getElementById("rooms");
  const invitess = document.getElementById("invitess");
  room.style.display = 'flex';
  invites.style.display = 'none';//displaying none
  bookmarks.style.display = 'none';//displaying none
  rooms.classList.add('now');
  invitess.classList.remove('now');
  bookmarkss.classList.remove('now');
}
// working for the display none of all others then the id to work invites  and others will have display none
const  invites = () => {
  const bookmarks = document.getElementById("bookmarks");
  const room = document.getElementById("room");
  const invites = document.getElementById("invites");
  const bookmarkss = document.getElementById("bookmarkss");
  const rooms = document.getElementById("rooms");
  const invitess = document.getElementById("invitess");
  invites.style.display = 'block';
  room.style.display = 'none';//displaying none
  bookmarks.style.display = 'none';//displaying none
  rooms.classList.remove('now');
  invitess.classList.add('now');
  bookmarkss.classList.remove('now');
}
// working for the display none of all others then the id to work bookmarks and others will have display none
const  bookmarks = () => {
  const bookmarks = document.getElementById("bookmarks");
  const room = document.getElementById("room");
  const invites = document.getElementById("invites");
  const bookmarkss = document.getElementById("bookmarkss");
  const rooms = document.getElementById("rooms");
  const invitess = document.getElementById("invitess");
  bookmarks.style.display = 'block';
  invites.style.display = 'none';//displaying none
  room.style.display = 'none';//displaying none
  rooms.classList.remove('now');
  invitess.classList.remove('now');
  bookmarkss.classList.add('now');
}
//changing  the style onmouseover to display different css
const mystyle=()=>{
  document.getElementById("createroom").style.fontSize = "65px";
  document.getElementById("createroom").style.marginLeft = "0px";
}
//changing  the style onmouseover to display different css
const mxstyle=()=>{
  document.getElementById("createroom").style.fontSize = "50px";
  document.getElementById("createroom").style.marginLeft = "4.5px";
}
//changing  the style onmouseover to display different css
const mmxstyle=()=>{
  document.getElementById("createroo").style.fontSize = "65px";
  document.getElementById("createroo").style.marginLeft = "0px";
}
//changing  the style onmouseover  displaying different css
const mmystyle=()=>{
  document.getElementById("createroo").style.fontSize = "50px";
  document.getElementById("createroo").style.marginLeft = "4.5px";
}
//changing   style onmouseover to display different css
const join =()=>{
  document.getElementById("join_url").style.display = "flex";
}
