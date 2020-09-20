const api = require("express").Router();

module.exports = (data, io) => {
  api.get("rooms", (req, res) => {
    res.send(Object.values(data.rooms).map((v) => v.info()));
  });

  api.post("createRoom", (req, res) => {
    
  });

  return api;
};
