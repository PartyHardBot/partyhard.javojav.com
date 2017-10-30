firebase.initializeApp({
  authDomain: "infopartyhardbot.firebaseapp.com",
  databaseURL: "https://infopartyhardbot.firebaseio.com",
  projectId: "infopartyhardbot",
  storageBucket: "infopartyhardbot.appspot.com"
});

const songsRef = firebase.database().ref('songs');
const storageRef = firebase.storage().ref();

let page = 0;
let Names = [];
let Ids = [];

songsRef.on('value', data => {
  Names = [];
  Ids = [];
  let songs = data.val();
  let keys = Object.keys(songs);
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    Names.push(songs[k].name);
    Ids.push(songs[k].id);
  }
  displayvideo();
  console.log(Object.keys(data.val()).length);
}, err => {
  console.log(err);
});

function displayvideo() {
  document.getElementById("videos").innerHTML = "";
  let iframe = document.createElement('iframe');
  let name = document.createElement('p');
  iframe.width = 560;
  iframe.height = 315;
  iframe.src = 'https://www.youtube.com/embed/' + Ids[page];
  iframe.frameborder = 0;
  iframe.allowfullscreen;
  let t = document.createTextNode(Names[page]);
  name.appendChild(t);
  document.getElementById("videos").appendChild(name);
  document.getElementById("videos").appendChild(iframe);
}

function hideorshowbutton() {
  if (page == Ids.length-1) document.getElementById("next").style.display = "none";
  if (page == 0) document.getElementById("last").style.display = "none";
  if (page < Ids.length-1) document.getElementById("next").style.display = "block";
  if (page > 0) document.getElementById("last").style.display = "block";
}

function nextpage() {
  page++;
  hideorshowbutton()
  displayvideo();
}

function randompage() {
  page = Math.floor((Math.random() * Ids.length));
  hideorshowbutton()
  displayvideo();
}

function lastpage() {
  page--;
  hideorshowbutton()
  displayvideo();
}

$("body").keydown(function(key) {
  if(key.keyCode == 37 && page > 0) {
    page--;
    hideorshowbutton()
    displayvideo();
  }
  else if(key.keyCode == 39 && page < Ids.length-1) {
    page++;
    hideorshowbutton()
    displayvideo();
  }
});

function sendYoutube() {
  if (document.getElementById('link').value.substring(0,29) == "https://www.youtube.com/watch" || document.getElementById('link').value.substring(0,16) == "https://youtu.be" && document.getElementById('name').value != "") {
    const name = document.getElementById('name').value;
    const id = document.getElementById('link').value.slice(-11);

    songsRef.once('value', data => {
      let alreadyExists = false;

      for (var i in data.val()) {
        if (name === data.val()[i].name || id === data.val()[i].id) {
          alreadyExists = true;
          break;
        }
      }

      if (!alreadyExists) {
        document.getElementById('name').value = "";
        document.getElementById('link').value = "";
        songsRef.push({
          name,
          id
        });
      }
    }, err => {
      console.log(err);
    })
  }
}

$(document).ready(function(){
  $("#file").change(function(){
    document.getElementById("uploadfile").style.display = "none";
    document.getElementById("sendvideo").style.display = "block";
  });
});

function sendFile() {
  const file = document.getElementById('file').files[0];

  document.getElementById("uploadfile").style.display = "inline";
  document.getElementById("sendvideo").style.display = "none";

  storageRef.child(file.name).put(file).then(snapshot => {
    storageRef.child(file.name).getDownloadURL().then(url => {
      songsRef.push({
        name: file.name.replace(/\..*/, ''),
        id: url
      });
    });
  });
}
