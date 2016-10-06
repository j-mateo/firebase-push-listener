var firebase = require('firebase');
var request = require('request');

var API_KEY = process.env.API_KEY; // Your Firebase Cloud Server API key

firebase.initializeApp({
  apiKey: API_KEY,
  authDomain: "instantchat-b085a.firebaseapp.com",
  databaseURL: "https://instantchat-b085a.firebaseio.com",
  storageBucket: "instantchat-b085a.appspot.com",
  messagingSenderId: "904499472626"
});
ref = firebase.database().ref();

function listenForNotificationRequests() {
  var requests = ref.child('chat');
  requests.on('child_added', function(requestSnapshot) {
    console.log("child_added");
    var request = requestSnapshot.val();
    sendNotificationToUser(
      request.author,
      request.content,
      function() {
       
      }
    );
  }, function(error) {
    console.error(error);
  });
};

function sendNotificationToUser(username, message, onSuccess) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key='+API_KEY
    },
    body: JSON.stringify({
      notification: {
        title: username,
        body: message
      },
      to : '/topics/chat'
    })
  }, function(error, response, body) {
    if (error) { console.error(error); }
    else if (response.statusCode >= 400) {
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage);
    }
    else {
        console.log("Success");
	onSuccess();
    }
  });
}

// start listening
listenForNotificationRequests();
