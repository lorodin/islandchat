// const express = require('express');
// const app = express();
// const http = require('http');//.Server(app);
require('node-json-color-stringify');

const io = require('socket.io');//(server);
const ClientModel = require('./models/client.model');
const uniqid = require('uniqid');
const Responce = require('./models/responce.model');
const PageContainer = require('./models/page.container');

function logJson(data){
    console.log(JSON.colorStringify(data));
}

class Server{
    constructor(){
        this.clients = [];
        this.sockets = {};
        this.client_pages = {};
        this.pageContainer = new PageContainer();
    }

    removeClient(client){
        let index = this.clients.indexOf(client);
        
        if(index == -1) {
            console.log("Error removed client");
            return;
        }

        this.clients.splice(index, 1);

        console.log('Client was deleted [' + this.clients.length + ']');
    }

    start(server){
        let _this = this;

        this.io = io(server);   
        
        this.io.on('connection', (socket)=>{
            console.log('new connection');

            let client = new ClientModel();

            socket.on('disconnect', () => {
                if(_this.client_pages[client.id]){
                    _this.client_pages[client.id].forEach(url => {
                        _this.pageContainer.unregisterPage(url, client, 
                            (c) =>{
                                if(_this.sockets[c.id])
                                    _this.sockets[c.id].emit('unregister_client_on_page', 
                                                     new Responce('OK', {
                                                         'url': url,
                                                         'client': {
                                                             'name': client.name,
                                                             'id': client.id
                                                         }
                                                     }, 'ok'));
                        })
                    });
                }
                
                _this.removeClient(client);
                
                delete _this.sockets[client.id];

                delete _this.client_pages[client.id];

                socket.disconnect();
            });

            socket.on('register_user', function(data){
                if(data == undefined || data.name === undefined) data = JSON.parse(data);

                console.log('register new user');
                console.log(data);
                console.log(data.time);

                client.setId(uniqid());
                client.setName(data.name);
                client.time = data.time;
                console.log(Date.now() / 1000);

                client.time_z = Math.ceil((client.time - (Date.now() / 1000)) / (3600));

                _this.clients.push(client);

                logJson({
                    'client_length': _this.clients.length,
                    'new_client': client
                });

                _this.sockets[client.id] = socket;
                _this.client_pages[client.id] = [];

                socket.emit('register_user_complete', new Responce('OK', client, ''));
            });

            socket.on('register_page', function(url){
                console.log(JSON.colorStringify({
                    'cmd': 'register_new_page',
                    'url': url,
                    'client': client
                }));
                
                _this.pageContainer
                     .registerNewPage(url, client, 
                        (c)=>{
                            if(!_this.sockets[c.id]) return;
                            _this.sockets[c.id].emit('set_new_client', new Responce('OK', {
                                'url': url,
                                'client': {
                                    'name': client.name,
                                    'id': client.id
                                }
                            }));
                        },
                        (page)=>{
                            if(!_this.sockets[client.id]) return;
                            console.log('Register page complete');
                            
                            logJson(page);
                            
                            _this.client_pages[client.id].push(page.url);

                            _this.sockets[client.id].emit('register_page_complete', new Responce('OK', page, 'ok'));
                        },
                        (msg)=>{
                            if(!_this.sockets[client.id]) return;
                            _this.sockets[client.id].emit('register_page_complete', new Responce('ERROR', null, msg));
                        }
                    );
            });

            socket.on('unregister_page', function(url){
                logJson({
                    'cmd': 'unregister_page',
                    'url': url
                });

                _this.pageContainer.unregisterPage(url, client, 
                    (c) => {
                        if(_this.sockets[c.id])
                            _this.sockets[c.id].emit('unregister_client_on_page', 
                                                     new Responce('OK', {
                                                         'url': url,
                                                         'client': {
                                                             'name': client.name,
                                                             'id': client.id
                                                         }
                                                     }, 'ok'));
                    },
                    (data) => {
                        if(!_this.sockets[client.id]) return;
                        
                        let index = _this.client_pages[client.id].indexOf(url);

                        if(index != -1) _this.client_pages[client.id].splice(index, 1);

                        _this.sockets[client.id].emit('unregister_page_complete', 
                                                      new Responce('OK', url, 'ok'));
                    },
                    (msg) => {
                        if(!_this.sockets[client.id]) return;
                        _this.sockets[client.id].emit('unregister_page_complete',
                                                      new Responce('ERROR', url, msg));
                    }
                )
            });

            socket.on('change_name', function(data){
                logJson({
                    'cmd': 'change_name',
                    'data': data
                });

                if(!_this.client_pages[client.id]) return;

                _this.client_pages[client.id].forEach((url) => {
                    _this.pageContainer.getClientsFromURL(url, (c) => {
                        if(!_this.sockets[c.id]) return;
                        _this.sockets[c.id].emit('change_client_name', new Responce('OK',{
                            'url': url,
                            'client': {
                                'name': data,
                                'id': client.id
                            }
                        }, 'ok'));
                    });
                });

                client.setName(data);

                if(_this.sockets[client.id]) 
                    _this.sockets[client.id].emit('change_name_complete', new Responce('OK', data, 'ok'));
            });

        });
    }
}

module.exports = Server;