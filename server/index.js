const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uniqid = require('uniqid');

const host = 'localhost';
const port = 8080;

server.listen(port);

io.on('connection', function(socket){
    let id = uniqid();
    socket.on('get_user_id', function(){
        console.log('cmd: get_user_id');
        console.log('id: ' + id);
        io.emit('set_user_id', id);
    });
    socket.on('register_new_page', function(url){
        console.log('cmd: register_new_page');
        console.log('url: ');
        console.log(url);
        io.emit('register_page_complete', url);
    })
    socket.on('unregister_page', function(url){
        console.log('cmd: unregister_page');
        console.log('url: ');
        console.log(url);
        io.emit('unregister_page_complete');
    })
    socket.on('change_name', function(data){
        console.log('cmd: change_name');
        console.log('name: ' + data.name);
        io.emit('change_name_complete', {
            'status': true,
            'name': data.name
        });
    })
});
