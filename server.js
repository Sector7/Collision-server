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

// Parse incoming CLI arguments.
var argv = require('optimist').argv;

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

server = require('./includes/gameserver.js').construct(argv, log);
commandFactory = require('./includes/command.js').construct(argv, log);
xbeeNodeFactory = require('./includes/xbeenode.js').construct(argv, log);

// Load configuration and start the server.
require('./includes/config.js').construct(argv, log, 'config.json', function() { server.start() });
