const uniqid = require("uniqid")

module.exports = (data, io) => (socket, next) => {
  socket.on("create room", ()=>{
    let { rooms } = data
    let id = uniqid.time("Room#")
    rooms[id] = new Room(id)
  })
};
