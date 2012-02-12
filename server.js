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

// Setup the send and recieve sockets
var server = dgram.createSocket("udp4");
server.bind(8282);

var client = dgram.createSocket("udp4");
client.bind(8282);
client.setBroadcast(true);

commandFactory = require('./command.js').construct(argv, log, client);
xbeenodeFactory = require('./xbeenode.js').construct(argv, log, client);

var players = {};

server.on("message", function (msg, rinfo) {
  var command = commandFactory.create(msg);
  if (command == undefined) {
    return;
  } 
  else {
    switch (command.cmd) {
      case "node":
        players[command.node.addr64] = xbeenodeFactory.create(command.node);
      break;
      case "nodeType":
        players[command.addr64].type = command.nodeType;
      break;
    }
  }

  //console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
});

server.on("listening", function () {
  var address = server.address();
//  console.log("server listening " + address.address + ":" + address.port);
});

commandFactory.send( { cmd: "discover", } );

