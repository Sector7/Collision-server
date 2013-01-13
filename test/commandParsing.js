var assert = require('assert');

// Initialize test environment
var argv = {};
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

server = require('../includes/gameserver.js').construct(argv, log);
commandFactory = require('../includes/command.js').construct(argv, log);
xbeeNodeFactory = require('../includes/xbeenode.js').construct(argv, log);

sendCommand = function (command, client) {
  // Stub, we don't actually send anything from the command parser.
 /* if (argv.v >= log.level.INFORMATIONAL) {
    console.log("Sending command:");
    console.log(command);
    if (argv.v >= log.level.DEBUG) {
      console.log("to");
      console.log(client);
    }
  }

  var command_message = commandFactory.createFromObject(command);
  command_buffer = new Buffer(command_message);
  //client.send(command_buffer, 0, command_buffer.length, 8282, "192.168.0.255", function(err, bytes) {});*/
}

// Perform actual testing.
describe('Client list', function() {
  it('should be initialized to an empty object', function () {
    assert.equal(server.clients.length, undefined, 'Servers client list is not an empty list');
  })
})

// Test that Xbee clients are correctly added to the servers list correctly.
// Specifically check that one gets the same results if we receive the node either before or after the nodeType.
var node1_addr = "0013A2004069839A"
var node2_addr = "0013A200407C4352"
var node1_model = 2;
var node2_model = 3;
var node1_message = '{"cmd":"node","node":{"addr64":"' + node1_addr + '"}}';
var node2_message = '{"cmd":"node","node":{"addr64":"' + node2_addr + '"}}';
var node1_type_message = '{"cmd":"nodeType","addr64":"' + node1_addr + '","model":' + node1_model + ',"from":"xbee"}';
var node2_type_message = '{"cmd":"nodeType","addr64":"' + node2_addr + '","model":' + node2_model + ',"from":"xbee"}';

var test_target_label = "The server client list";

server.handle_incoming_command(node1_message, '');

var num_clients = Object.keys(server.clients).length;
describe(test_target_label, function() {
  it('should contain a single entry with address ' + node1_addr, function() {
    assert.equal(num_clients, 1, 'Servers client list does not contain exactly one entry');
    assert.equal(server.clients[node1_addr].addr64, node1_addr, 'Servers client list does not contain the expected address ' + node1_addr);
  })
});

server.handle_incoming_command(node2_type_message, '');
describe(test_target_label, function() {
  it('should contain two entries with address\' ' + node1_addr + ' and ' + node2_addr, function() {
    assert.equal(Object.keys(server.clients).length, 2, 'Servers client list does not contain exactly two entries');
    assert.equal(server.clients[node1_addr].addr64, node1_addr, 'Servers client list does not contain the expected address ' + node1_addr);
    assert.equal(server.clients[node2_addr].addr64, node2_addr, 'Servers client list does not contain the expected address ' + node2_addr);
  })
});

server.handle_incoming_command(node1_type_message, '');
describe(test_target_label, function() {
  it('should contain one entry with model ' + node1_model, function() {
    assert.equal(server.clients[node1_addr].model, node1_model, 'Servers client list does not contain the expected model ' + node1_model);
  })
});

server.handle_incoming_command(node2_message, '');
describe(test_target_label, function() {
  it('should contain two entries with models ' + node1_model + ' and ' + node2_model, function() {
    assert.equal(server.clients[node1_addr].model, node1_model, 'Servers client list does not contain the expected model ' + node1_model);
    assert.equal(server.clients[node2_addr].model, node2_model, 'Servers client list does not contain the expected model ' + node2_model);
  })
});
