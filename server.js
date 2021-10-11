const express = require("express");
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const { v4: uuidv4 } = require("uuid");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
    return res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    return res.render("room", { roomId: req.params.room });
});

const server = app.listen('3030', () => {
    console.log("Listening on port: " + '3030');
});

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
});

/*app.prepare().then(() => {

    const server = express();

    server.set("view engine", "ejs");


const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

server.use("/peerjs", peerServer);
server.use(express.static("public"));

server.get("/", (req, res) => {
  return res.redirect(`/${uuidv4()}`);
});

server.get("/:room", (req, res) => {
  return res.render("room", { roomId: req.params.room });
});

const run = server.listen('3030', (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${'3030'}`);
    });


});*/
