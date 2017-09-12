var Names = [];
var Links = [];
var update = true;
function hola() {
  var config = {
    apiKey: "process.env.FIREBASE_API_KEY",
    authDomain: "infopartyhardbot.firebaseapp.com",
    databaseURL: "https://infopartyhardbot.firebaseio.com",
    projectId: "infopartyhardbot",
    storageBucket: "infopartyhardbot.appspot.com",
    messagingSenderId: "process.env.MESSAGING_SENDER_ID"
  };
  firebase.initializeApp(config);
   var database = firebase.database();
   var ref = database.ref('songs');
   ref.on('value', gotData, function(err) {});
}

function gotData(data) {
  Names = [];
  Links = [];
  var songs = data.val();
  var keys = Object.keys(songs);
  console.log(keys);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    Names.push(songs[k].name);
    Links.push(songs[k].link);
    console.log(songs[k].name,songs[k].link);
  }
  if (update = true) {
    ponlosvideos();
  }
}

function ponlosvideos() {
  document.getElementById("videos").innerHTML = "";
  for (var i = 0; i < Links.length; i++) {
    var iframe = document.createElement('iframe');
    var name = document.createElement('p');
    iframe.width = 560;
    iframe.height = 315;
    iframe.src = 'https://www.youtube.com/embed/' + Links[i].substring(32,Links[i].length);
    iframe.frameborder = 0;
    iframe.allowfullscreen;
    var t = document.createTextNode(Names[i]);
    name.appendChild(t);
    document.getElementById("videos").appendChild(name);
    document.getElementById("videos").appendChild(iframe);
  }
}

function send() {
  var database = firebase.database();
  var shit = true;
  var ref = database.ref('songs');
  var data = {
       name: document.getElementById("name").value,
       link: document.getElementById("link").value
     }
     if (data.link.substring(0,29) == "https://www.youtube.com/watch") shit = false;
     for (var i = 0; i < Links.length; i++) {
       if (data.link == Links[i]) shit = true;
       if (data.name == Names[i]) shit = true;
     }
     if (shit === false) {
      ref.push(data);
      name: document.getElementById("name").value = "";
      link: document.getElementById("link").value = "";
      update = true;
    }
}
