var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var opn = require("opn");
var port = process.env.PORT || 3003;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  console.log("a user connected");
  io.emit("chat message", "a user connected");
  socket.on("chat message", function(msg) {
    io.emit("chat message", msg);
    console.log("message: " + msg);
  });
  socket.on("disconnect", function() {
    io.emit("disconnect", "someone disconnect chatRome!");
    console.log("user disconnected");
  });
});

http.listen(port, function() {
  console.log("server started at port: %s", port);
  // 自动打开浏览器，开发使用
  opn("http://127.0.0.1:" + port);
});
