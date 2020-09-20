const uniqid = require("uniqid");

let history = [];
module.exports = (data, io) => (sock, next) => {
  sock.on("disconnect", () => io.emit("player disconnected", sock.id));

  // sock.on("create room", () => {
  //   let { rooms } = data;
  //   let id = uniqid.time("Room#");
  //   rooms[id] = new Room(id);
  // });

  sock.on("join room", ({ id, name }) => {
    let { rooms } = data;
    if (rooms.hasOwnProperty(id)) {
      let room = rooms[id];
      room.addPlayer(sock, name);
      io.to(sock.id).emit("joined room", room.info());
    } else io.to(sock.id).emit("room doesnt exist", id);
  });

  // sock.on("drawing", (data) => {
  //   console.log(data);
  //   sock.broadcast.emit("drawing", data);
  // });

  // sock.on("message", (msg) => {
  //   history.push(msg);
  //   io.emit("message", msg);
  // });

  next();
};
