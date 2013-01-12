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

sendCommand = function (command, client) {
  if (argv.v >= log.level.INFORMATIONAL) {
    console.log("Sending command:");
    console.log(command);
    if (argv.v >= log.level.DEBUG) {
      console.log("to");
      console.log(client);
    }
  }

  var command_message = commandFactory.createFromObject(command);
  command_buffer = new Buffer(command_message);
  client.send(command_buffer, 0, command_buffer.length, 8282, "192.168.0.255", function(err, bytes) {});
}

// Server specific includes
var argv = require('optimist').argv;
commandFactory = require('./includes/command.js').construct(argv, log);
xbeeNodeFactory = require('./includes/xbeenode.js').construct(argv, log);

var startServer = function (config) {

  this.config = config;
  this.clients = {};

  var open_sockets = function() {
    // Setup the send and recieve sockets
    var server = dgram.createSocket("udp4");
    server.on("listening", function () {
      if (argv.v >= log.level.NOTICE) {
        var address = server.address();
        console.log("Server listening on " + address.address + ":" + address.port);
      }
    });
    server.bind(8282);

    this.client = dgram.createSocket("udp4");
    client.bind(8282);
    client.setBroadcast(true);
    var self = this;

    server.on("message", function (msg, rinfo) {
      var commandPacket = commandFactory.createFromText(msg);

      if (commandPacket == undefined) {
        return;
      }

      if (argv.v >= log.level.INFORMATIONAL) {
        console.log("Got command of type: " + commandPacket.cmd);
      }

      switch (commandPacket.cmd) {
        case 'node':
          var newNode = xbeeNodeFactory.create(commandPacket.node);
          self.clients[newNode.addr64] = newNode;

          if (argv.v >= log.level.NOTICE) {
            console.log("Found new node: " + newNode.addr64);
          }
          if (argv.v >= log.level.DEBUG) {
            console.log("List of clients:");
            console.log(self.clients);

            console.log("Ask node to identify itself:");
          }

          var remote_message = {
            "to": "xbee",
            "cmd": "identify",
            "addr": newNode.addr64
          };
          sendCommand(remote_message, self.client);

          if (argv.v >= log.level.DEBUG) {
            console.log(remote_message);
          }
        break;
        case 'nodeType':
          self.clients[commandPacket.addr64].model = commandPacket.model;
          console.log("Got nodetype for " + commandPacket.addr64 + "\nList of clients:");
          console.log(self.clients);
        break;
        case 'event':
          var event = eventFactory.create(commandPacket.event);
          //console.log("Event:");
          //console.log(event);
        break;
      }

      if (argv.v >= log.level.DEBUG) {
        console.log(commandPacket);
        console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
      }

      /*var command = commandFactory.createFromText(msg);
      if (command == undefined) {
        return;
      }

      console.log("Server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);*/
    });
  };

  var discover_sockets = function() {
    var discover_message = {
      "to": "xbee",
      "cmd": "discover"
    };
    sendCommand(discover_message, this.client);
  }

  eventFactory = require('./includes/event.js').construct(argv, log, config);
  open_sockets();
  discover_sockets();
}

// Load configuration
require('./includes/config.js').construct(argv, log, 'config.json', startServer);
