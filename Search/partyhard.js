firebase.initializeApp({
  authDomain: "infopartyhardbot.firebaseapp.com",
  databaseURL: "https://infopartyhardbot.firebaseio.com",
  projectId: "infopartyhardbot",
  storageBucket: "infopartyhardbot.appspot.com"
});

const songsRef = firebase.database().ref('songs');
const storageRef = firebase.storage().ref();

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
  console.log(Object.keys(data.val()).length);
}, err => {
  console.log(err);
});

function search() {
  document.getElementById("videos").innerHTML = "";
  for (let i = 0; i < Names.length; i++) {
    for (let j = 0; j < Names[i].length; j++) {
      const searchfor = document.getElementById('search').value.toLowerCase();
      if (Names[i].substring(j, searchfor.length+j).toLowerCase() == searchfor) {
        let iframe = document.createElement('iframe');
        let name = document.createElement('p');
        iframe.width = 560;
        iframe.height = 315;
        iframe.src = 'https://www.youtube.com/embed/' + Ids[i];
        iframe.frameborder = 0;
        iframe.allowfullscreen;
        let t = document.createTextNode(Names[i]);
        name.appendChild(t);
        document.getElementById("videos").appendChild(name);
        document.getElementById("videos").appendChild(iframe);
        break;
      }
    }
  }
}

$("body").keydown(function(key) {
  if(key.keyCode == 13) {
    search();
  }
});
