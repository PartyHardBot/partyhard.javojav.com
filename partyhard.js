firebase.initializeApp({
  authDomain: "infopartyhardbot.firebaseapp.com",
  databaseURL: "https://infopartyhardbot.firebaseio.com",
  projectId: "infopartyhardbot",
  storageBucket: "infopartyhardbot.appspot.com"
});

const songsRef = firebase.database().ref('songs');
const storageRef = firebase.storage().ref();

const videos = new Vue({
  el: '#videos',
  data: {
    videos: []
  }
})

songsRef.on('value', data => {
  videos.videos = data.val();
  console.log(Object.keys(data.val()).length);
}, err => {
  console.log(err);
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
