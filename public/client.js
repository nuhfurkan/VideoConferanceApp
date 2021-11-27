const ClieIO = io();

const myVideo = document.getElementById("my-video");
const remoteVideo = document.getElementById("remote-video");
const inputId = document.getElementById("room-id");

const constraints = {
    audio: true,
    video: {height: 300, width:300}
}

function joinRoom() {
    console.log(inputId.value);
    if (inputId.value != "") {
        ClieIO.emit("join_room", inputId.value)    
        stream()
    } else {
        alert("Room can not be empty");
    }
}

async function stream() {
    const video = document.getElementById("my-video");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      video.srcObject = mediaStream;
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