var peer = new Peer("zhangxuPc"+Math.round(Math.random()*100), {
    debug: 3
  }); 
var startConn = null;
var recvConn = null;
var localId = null;

var mediaStream = null;

navigator.getUserMedia({ audio: true, video: { width: 720, height: 360 } },
    function(stream) {
        mediaStream = stream
        var video = document.querySelector('video.local');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    },
    function(err) {
        console.log("The following error occurred: " + err.name);
    }
);
                         
function connect() {
    const remoteId = document.getElementById("remoteId")
    startConn = peer.connect(remoteId.value);
    startConn.on('open', function() {
        document.getElementById("contList").innerHTML += `<li>Connected!</li>`
    })
    startConn.on('data', function(data) {
        document.getElementById("contList").innerHTML += `<li>${data}</li>`
    })
    const call = peer.call(remoteId.value, mediaStream);
    call.on('stream', function(stream) {
        var video = document.querySelector('video.remote');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
}

function sendMsg() {
    const sendText = document.getElementById("sendText")
    if (recvConn != null)
        recvConn.send(localId+":"+sendText.value)
    if (startConn != null)
        startConn.send(localId+":"+sendText.value)
    document.getElementById("contList").innerHTML += `<li>${localId+":"+sendText.value}</li>`
    sendText.value = ""
}

peer.on('open', function(id) {
    document.getElementById("peerId").innerHTML = 'My peer ID is: ' + id;
    localId = id
    console.log('My peer ID is: ' + id);
});

peer.on('connection', function(connection) {
    recvConn = connection
    recvConn.on('open', function() {
        document.getElementById("contList").innerHTML += `<li>Connected!</li>`
    })
    recvConn.on('data', function(data) {
        document.getElementById("contList").innerHTML += `<li>${data}</li>`
    })
    
});

peer.on('call', function(call) {
    // Answer the call, providing our mediaStream
    console.log("被叫");
    call.answer(mediaStream);
    call.on('stream', function(stream) {
        var video = document.querySelector('video.remote');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
});


