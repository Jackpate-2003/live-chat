const express = require("express");
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { v4: uuidv4 } = require("uuid");

app.prepare().then(() => {

    const server = express();

    server.set("view engine", "ejs");


const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

server.use("/peerjs", peerServer);
server.use(express.static("public"));

server.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

server.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

server.all('*', (req, res) => {
        return handle(req, res);
    })

const run = server.listen('3030', (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${'3030'}`);
    });
const io = require("socket.io")(run, {
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

});
