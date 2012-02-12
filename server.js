#!/usr/bin/node

var command = require('./command.js');

var dgram = require('dgram');


var test_message = new Buffer('{"to":"beckhoff","cmd":"toggle","tag":"Kitchen.Ceiling","from":"0d57068e44d4fb22f7d0831144f51d90"}\n');

var server = dgram.createSocket("udp4");
server.bind(8282);

var client = dgram.createSocket("udp4");
client.bind(8282);
client.setBroadcast(true);

server.on("message", function (msg, rinfo) {
  var newcommand = command.create(msg);
//  console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
});

server.on("listening", function () {
  var address = server.address();
//  console.log("server listening " + address.address + ":" + address.port);
});

client.send(test_message, 0, test_message.length, 8282, "192.168.1.255", function(err, bytes) {

});


