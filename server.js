var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
// var uuid = require('node-uuid');

app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use("/files", express.static(__dirname + "/public/files"));
app.use("/fonts", express.static(__dirname + "/public/fonts"));
app.use("/emoticons", express.static(__dirname + "/public/emoticons"));

app.get("/", function(req, res) {
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + "/public/index.html");
});

var usernames = {};
var numUsers = 0;

io.on("connection", function(socket) {
  var addedUser = false;

  socket.on("login", function(username) {
    console.log("login with " + numUsers + " number users");
    console.log(usernames);
    socket.emit("list users", {
      usernames: usernames,
      numUsers: numUsers
    });
    socket.username = username;
  });
  // when the client emits 'new message', this listens and executes
  socket.on("new message", function(data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit("new message", {
      username: socket.username,
      message: data
    });
  });

  socket.on("private message", function(data) {
    // socket.broadcast.emit('private message', data);
    // socket.emit('private message', data);
    io.emit("private message", data);
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", function(username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected

    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers
    });
    socket.emit("list users", {
      usernames: usernames,
      numUsers: numUsers
    });
    // io.emit('user joined', {
    //   username: socket.username,
    //   numUsers: numUsers
    // });
    // console.log(username);
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", function() {
    socket.broadcast.emit("typing", {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", function() {
    socket.broadcast.emit("stop typing", {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", function() {
    // remove the username from global usernames list
  });

  socket.on("logout", function(username) {
    // if (addedUser) {
    console.log("Logout with " + numUsers + " number users");
    console.log(usernames);
    delete usernames[username];
    --numUsers;
    console.log(socket.username);
    console.log(username);

    // echo globally that this client has left
    socket.broadcast.emit("user left", {
      username: username,
      numUsers: numUsers
    });
    // }
  });

  socket.on("offline", function(username) {
    // console.log('user offline');
    socket.broadcast.emit("user offline", {
      username: username
    });
  });

  socket.on("online", function(username) {
    // console.log('user online');
    socket.broadcast.emit("user online", {
      username: username
    });
    // console.log({username: username});
  });
});
http.listen(3000, function() {
  console.log("listening on *:3000");
});
