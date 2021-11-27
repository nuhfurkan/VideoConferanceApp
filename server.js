const express = require("express")
const app = express()
const http = require("http")
const server = require("http").createServer(app)
const io = require("socket.io")(server)
app.use("/", express.static("public"))

io.on("connection", (server)=> {
    console.log("client connected")
    server.on("join_room", (roomid)=> {
        console.log("In room " + roomid);
        server.join([roomid]);
    })
})
server.listen(3000, ()=> {
    console.log("server is listening")
})
