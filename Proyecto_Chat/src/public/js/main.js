$(function () {

    const socket = io();

    const $messageForm = $('#mensaje-chat');
    const $mensaje = $('#mensaje');
    const $chat = $('#chat');

    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');
    
    const $users = $('#usernames');



    $nickForm.submit( e => {
        e.preventDefault();
        socket.emit('nuevo usuario', $nickname.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                <div  class="alert alert-danger">Ese usuario ya existe<div/> 
                `);
            }
            $nickname.val('');
        });
    });

    $messageForm.submit(e => {
        e.preventDefault();
        const $input = $('#imagen');
        const inputFiles = $input.prop('files');
      
        if (inputFiles && inputFiles[0]) {
          const reader = new FileReader();
          reader.onload = e => {
            const data = e.target.result;
            const message = $mensaje.val();
            socket.emit('enviando mensaje', { message, image: data }, data => {
              $chat.append(`<p class="error">${data}</p>`);
            });
            $mensaje.val('');
            $input.val('');
          };
          reader.readAsDataURL(inputFiles[0]);
        } else {
          const message = $mensaje.val();
          socket.emit('enviando mensaje', { message }, data => {
            $chat.append(`<p class="error">${data}</p>`);
          });
          $mensaje.val('');
        }
      });
     
    /*$messageForm.submit( e => {
        e.preventDefault();
        socket.emit('enviando mensaje' , $mensaje.val(), data =>{
            $chat.append(`<p class="error">${data}</p>`)
        });
        $mensaje.val('');
    });


    socket.on('nuevo mensaje', function (data) {
        $chat.append(`<p><i class="fas fa-user"></i> ${data.nick}: ${data.msg}</p>`);
    });*/
    socket.on('nuevo mensaje', function (data) {
        const $chatLine = $('<p>');
        $chatLine.append($('<i>').addClass('fas fa-user'));
        $chatLine.append(` ${data.nick}: `);
        $chatLine.append($('<span>').text(data.msg));
      
        if (data.image) {
          const $img = $('<img>').attr('src', data.image);
          $chatLine.append($('<br>'));
          $chatLine.append($img);
        }
      
        $chat.append($chatLine);
    });
      

    socket.on('usernames', data =>{
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]} </p>`;
        }
        $users.html(html);
    });
    socket.on('whisper', data =>{
        $chat.append(`<p class="whisper"><b>${data.nick}:</b>${data.msg}</p>`);
    })

    
})
