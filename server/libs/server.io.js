// const express = require('express');
// const app = express();
// const http = require('http');//.Server(app);
require('node-json-color-stringify');

const io = require('socket.io');//(server);
const ClientModel = require('./models/client.model');
const uniqid = require('uniqid');

function logJson(data){
    console.log(JSON.colorStringify(data));
}

class Server{
    constructor(){
        this.clients = [];
        this.pages = [];
        this.domains = [];
    }

    removeClient(client){
        let index = this.clients.indexOf(client);
        
        if(index == -1) {
            console.log("Error removed client");4
            return;
        }

        // Сообщить всем об удаление пользователя

        this.clients.splice(index, 1);

        console.log('Client was deleted [' + this.clients.length + ']');
    }

    start(server){
        let _this = this;

        this.io = io(server);   
        
        this.io.on('connection', (socket)=>{
            console.log('new connection');

            let client = new ClientModel(uniqid());

            socket.on('disconnect', () => {
                _this.removeClient(client);
            });

            socket.on('register_user', function(data){
                _this.clients.push(client);

                console.log('register new user');
                
                logJson({
                    'client_length': _this.clients.length,
                    'new_client': client
                });

                client.setName(data.name);
                
                _this.io.emit('register_user_complete', {
                        'name': data.name,
                        'user_id': client.id
                    }
                );
            });

            socket.on('register_new_page', function(url){
                console.log(JSON.colorStringify({
                    'cmd': 'register_new_page',
                    'url': url
                }));

                _this.io.emit('register_page_complete', url);
            });

            socket.on('unregister_page', function(url){
                console.log(JSON.colorStringify({
                    'cmd': 'unregister_page',
                    'url': url
                }));

                _this.io.emit('unregister_page_complete');
            });

            socket.on('change_name', function(data){
                console.log(JSON.colorStringify({
                    'cmd': 'change_name',
                    'data': data
                }));

                _this.io.emit('change_name_complete', {
                    'status': true,
                    'name': data.name
                });
            });

        });
    }

}

module.exports = Server;