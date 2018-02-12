const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }

    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);

const io = socketio(app);

app.listen(PORT);

io.on('connection', (socket) => {
  //socket.join('room1');
    
  socket.on('join', (data) => {
     console.log("Socket: " + data.user + " has joined.");
     socket.join('room1');
  });

  socket.on('draw', (data) => {
      io.sockets.in('room1').emit('draw', { user: data.user, circle: data.circle });
      ///socket.to('room1').emit('draw', {user: data.user, circle: data.circle});
  });
  
  socket.on('leaving', (data) => {
      console.log("Socket: " + data.user + " left.");
      socket.leave('room1');
      
      io.sockets.in('room1').emit('leave', data.user); 
  });
    
  socket.on('disconnect', (data) => {
      //socket.leave('room1');
      
      console.log("User Disconnected...");
  });
});

console.log(`Listening on port ${PORT}`);
