const ClieIO = io();

const myVideo = document.getElementById("my-video");
const remoteVideo = document.getElementById("remote-video");
const inputId = document.getElementById("room-id");
var remoteStream;
var localStream;
var myrtcpeer;

const constraints = {
    audio: true,
    video: {height: 300, width:300}
}

ClieIO.on("joined_room", (roomid)=> {
    //stream("remote-video");
    
    ClieIO.emit("start_call", roomid);
})

ClieIO.on("start_call", (roomid)=> {
  console.log("all is well");
  myrtcpeer = new RTCPeerConnection();
  addLocalTrack(myrtcpeer);
  myrtcpeer.ontrack = setRemoteStream;
  myrtcpeer.onicecandidate = sendIceCandidate;
  createOffer(myrtcpeer);
})

ClieIO.on("web_rtc_icecandidate", event => {
  console.log("remote connection");
})

ClieIO.on("webrtc_offer", event => {
  console.log("webrtc_oofer");
  myrtcpeer = new RTCPeerConnection();
  addLocalTrack(myrtcpeer);
  myrtcpeer.ontrack = setRemoteStream;
  myrtcpeer.onicecandidate = sendIceCandidate;
  createOffer(myrtcpeer);
})

ClieIO.on("webrtc_answer", event => {
  myrtcpeer.setRemoteDesc(new RTCSessionDescription(event));
})

function addLocalTrack() {
  localStream.getTracks().forEach(track => {
    myrtcpeer.addTrack(track);
  });
}

async function createAnswer(rtypeercon) {
  let sesDesc;
  try {
    sesDesc = await rtypeercon.createAnswer();
    // no local desc
    //rtypeercon.setLocalDesc(sesDesc);
  } catch (error) {
    console.error(error);
  }
  ClieIO.emit("webrtc_answer", {
    type: "webrtc_answer",
    sdp: sesDesc,
    roomid: inputId.value 
  })

}

async function createOffer(rtypeercon) {
  let sesDesc;
  try {
    sesDesc = await rtypeercon.createOffer();
    // no local desc
    //rtypeercon.setLocalDesc(sesDesc);
  } catch (error) {
    console.error(error);
  }
  ClieIO.emit("webrtc_offer", {
    type: "webrtc_offer",
    sdp: sesDesc,
    roomid: inputId.value 
  })

}

function setRemoteStream(event) {
  remoteVideo.srcObject = event.streams[0];
  remoteStream = event.stream;
  remoteVideo.play();
}

function sendIceCandidate(event) {
  if (event.candidate) {
    ClieIO.emit("web_rtc_icecandidate", {
      roomid: inputId.value,
      lanel: event.candidate.sdpMLineIndex,
      candidate: event.candidate.candidate
    });

  }
}

function joinRoom() {
    console.log(inputId.value);
    if (inputId.value != "") {
        ClieIO.emit("join_room", inputId.value);  
        stream("my-video");
    } else {
        alert("Room can not be empty");
    }
}

async function stream(myid) {
    const video = document.getElementById(myid);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      video.srcObject = mediaStream;
      localStream = mediaStream;
    } catch (e) {
      console.error(e)
    }
    video.onloadedmetadata = async function(event) {
      try {
        await video.play();
      } catch (e) {
        console.error(e)
      }
    }
  }