#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var PhoneManager = require("./phonemanager").PhoneManager;
var ClientManager = require("./clientmanager").ClientManager;
var http = require('http');

var server = http.createServer(function(request, response) {
	console.log((new Date()) + ' received request for ' + request.url);
	response.writeHead(404);
	response.end();
});

var phone_manager = new PhoneManager();
var client_manager = new ClientManager();
phone_manager.client_manager = client_manager;
client_manager.phone_manager = phone_manager;

server.listen(8080, function() {
	console.log("[http] Server is listening on port 8080");
});

wsServer = new WebSocketServer({
	httpServer: server, 
	autoAcceptConnections:false
});

function handleRequest(protocol, manager) {
    return function(request) {
        try {
            if(request.requestedProtocols.indexOf(protocol) == -1) {
                return;
            }
            var conn = request.accept(protocol, request.origin);
        } catch(e) {
            return;
        }
        console.log("[ws] Connection accepted.");

        conn.sendEvent = function(event, data) {
            if(!data) {
                data = {};
            }

            data['e'] = event;
            conn.send(JSON.stringify(data));
        }

        conn.on('message', function(data) {
            try {
                var msg = JSON.parse(data.utf8Data);
            } catch(e) {
                console.log("Invalid JSON from client");
                return;
            }
            console.log("msg:" + msg.e);
            manager.emit(msg.e, conn, msg);
        });

        conn.on('close', function(reasonCode, description) {
            manager.emit("close", conn);
        });
    };
}

wsServer.on('request', handleRequest("client", client_manager));
wsServer.on('request', handleRequest("phone", phone_manager));
