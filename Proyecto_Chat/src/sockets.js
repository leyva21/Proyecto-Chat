module.exports = function (io){
    
    let users = {}; 
    
    io.on('connection', socket => {
        console.log('nuevo usuario conectado');

        socket.on('nuevo usuario', (data, cb) => {
            if (data in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            }
        });
        

        socket.on('enviando mensaje', (data, cb) => {
            const message = data.message.trim();
            const image = data.image;
            var msg = message;
            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if(index !== -1){
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('Error! Por favor ingresa un usuario valido')
                    }
                }else {
                    cb('Error! Por favor ingresa un mensaje')
                }
            }else {
                io.sockets.emit('nuevo mensaje', {
                    msg: message,
                    nick: socket.nickname,
                    image: image
                });
            }   
        });
        

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users))
        }
    });
}

