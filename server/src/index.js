const app = require("express")();
const server = require("http").createServer(app);
const static = require("express").static;
const join = require("path").join;
const io = require("socket.io")(server);

let data = { rooms: [] };
io.use(require("./socket.js")(data, io));
app.use("/api", require("./api")(data, io));

app.use(static(join(__dirname, "..", "..", "client", "dist")));
app.get("*", (_, res) => {
  res.sendFile(join(__dirname, "..", "..", "client", "dist", "index.html"));
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);