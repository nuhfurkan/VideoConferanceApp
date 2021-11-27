const express = require("express")
const app = express()
const http = require("http")
const { Socket } = require("socket.io")
const server = require("http").createServer(app)
const io = require("socket.io")(server)
app.use("/", express.static("public"))

io.on("connection", (server)=> {
    console.log("client connected")
    server.on("join_room", (roomid)=> {
        console.log("In room " + roomid);
        server.join([roomid]);
        server.emit("joined_room", roomid);
    })
    
    server.on("start_call", (roomid)=> {
        server.broadcast.to(roomid).emit("start_call");
    })

    server.on("webrtc_offer", event => {
        server.broadcast.to(event.roomid).emit("webrtc_offer", event);
    })

    server.on("webrtc_answer", event => {
        server.broadcast.to(event.roomid).emit("webrtc_answer", event.sdp);
    })

    server.on("web_rtc_icecandidate", event => {
        server.broadcast.to(event.roomid).emit("web_rtc_icecandidate", event);
    })
})
server.listen(3000, ()=> {
    console.log("server is listening")
})
