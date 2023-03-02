const http = require('http');
const path = require('path')

const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require('./sockets')(io);

// settings
app.set("port", process.env.PORT || 3000);


app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), '192.168.89.127', () =>{
    console.log('Server en el puerto', app.get('port'));

})