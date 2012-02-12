#!/usr/bin/node

log = {
  level : {
    DEBUG : 7,
    INFORMATIONAL : 6,
    NOTICE : 5,
    WARNING : 4,
    ERROR : 3,
    ALERT : 2,
    CRITICAL : 1,
    EMERGENCY : 0,
  }
}

// Node.js includes
var dgram = require('dgram');

// Server specific includes
var argv = require('./node-optimist').argv;
commandFactory = require('./command.js').construct(argv, log);

var test_message = new Buffer('{"to":"beckhoff____","cmd":"toggle","tag":"Kitchen.Ceiling","from":"0d57068e44d4fb22f7d0831144f51d90"}\n');

// Setup the send and recieve sockets
var server = dgram.createSocket("udp4");
server.bind(8282);

var client = dgram.createSocket("udp4");
client.bind(8282);
client.setBroadcast(true);

server.on("message", function (msg, rinfo) {
  var command = commandFactory.create(msg);
  if (command == undefined) {
    return;
  } 

 // console.log(command);
//  console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
});

server.on("listening", function () {
  var address = server.address();
//  console.log("server listening " + address.address + ":" + address.port);
});

client.send(test_message, 0, test_message.length, 8282, "192.168.1.255", function(err, bytes) {

});

