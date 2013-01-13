exports.argv = {};
exports.log = {};

exports.construct = function (argv, log) {
  this.argv = argv;
  this.log = log;
  this.clients = {};
  this.eventFactory = require('./event.js').construct(this.argv, this.log, this.config);
  return this;
}

exports.handle_incoming_command = function (msg, rinfo) {
  var commandPacket = commandFactory.createFromText(msg);

  if (commandPacket == undefined) {
    return;
  }

  if (this.argv.v >= this.log.level.INFORMATIONAL) {
    console.log("Got command of type: " + commandPacket.cmd);
  }

  switch (commandPacket.cmd) {
    case 'node':
      var newNode = xbeeNodeFactory.create(commandPacket.node);
      // If we already have a model, make sure it survives new assignment.
      if (this.clients[newNode.addr64] && this.clients[newNode.addr64].model) {
        newNode.model = this.clients[newNode.addr64].model;
      }
      this.clients[newNode.addr64] = newNode;

      if (server.argv.v >= this.log.level.NOTICE) {
        console.log("Found new node: " + newNode.addr64);
      }
      if (server.argv.v >= this.log.level.DEBUG) {
        console.log("List of clients:");
        console.log(this.clients);
        console.log("Ask node to identify itself:");
      }

      var remote_message = {
        "to": "xbee",
        "cmd": "identify",
        "addr": newNode.addr64
      };
      sendCommand(remote_message, this.client);

      if (this.argv.v >= log.level.DEBUG) {
        console.log(remote_message);
      }
    break;
    case 'nodeType':
      if (this.clients[commandPacket.addr64] != undefined ) {
        this.clients[commandPacket.addr64].model = commandPacket.model;
      } else {
        this.clients[commandPacket.addr64] = { model:commandPacket.model };
      }

      if (server.argv.v >= this.log.level.DEBUG) {
        console.log("Got nodetype for " + commandPacket.addr64 + "\nList of clients:");
        console.log(this.clients);
      }
    break;
    case 'event':
      var event = eventFactory.create(commandPacket.event);
    break;
  }

    if (server.argv.v >= log.level.DEBUG) {
      console.log(commandPacket);
      console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
  }
}

exports.start = function (config) {
  this.config = config;

  this.server_is_listening = function(server) {
    if (this.argv.v >= log.level.NOTICE) {
      var address = server.address();
      console.log("Server listening on " + address.address + ":" + address.port);
    }
  }

  this.open_sockets = function() {
    // Setup the send and recieve sockets
    var dgram = require('dgram');
    var server = dgram.createSocket("udp4");
    var self = this;
    server.on("listening", function () { self.server_is_listening(server) });
    server.bind(8282);

    this.client = dgram.createSocket("udp4");
    this.client.bind(8282);
    this.client.setBroadcast(true);

    server.on("message", function (msg, rinfo) { self.handle_incoming_command(msg, rinfo) });
  };

  this.discover_sockets = function() {
    var discover_message = {
      "to": "xbee",
      "cmd": "discover"
    };
    sendCommand(discover_message, this.client);
  }

  this.open_sockets();
  this.discover_sockets();
}
