#!/usr/bin/node

// @TODO Make all these un-global?
argv = require('./includes/arguments.js').construct();
log = require('./includes/log.js').construct(argv);
server = require('./includes/gameserver.js').construct(argv, log);
commandFactory = require('./includes/command.js').construct(argv, log);
xbeeNodeFactory = require('./includes/xbeenode.js').construct(argv, log);

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

// Load configuration and start the server.
require('./includes/config.js').construct(argv, log, 'config.json', function() {
  server.start()
});
