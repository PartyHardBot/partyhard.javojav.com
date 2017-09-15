firebase.initializeApp({
  authDomain: "infopartyhardbot.firebaseapp.com",
  databaseURL: "https://infopartyhardbot.firebaseio.com",
  projectId: "infopartyhardbot",
  storageBucket: "infopartyhardbot.appspot.com"
});

const songsRef = firebase.database().ref('songs');

const videos = new Vue({
  el: '#videos',
  data: {
    videos: []
  }
})

songsRef.on('value', data => {
  videos.videos = data.val();
}, err => {
  console.log(err);
});

function sendYoutube() {
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
      songsRef.push({
        name,
        id
      });
    }
  }, err => {
    console.log(err);
  })
}
