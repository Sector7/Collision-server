exports.argv = {};
exports.log = {};
exports.client = {};

exports.construct = function (argv, log, client) {
  this.argv = argv;
  this.log = log;
  this.client = client;
  return this;
}

exports.create = function (message) {
  var data = JSON.parse(message);
  if (this.argv.v >= this.log.level.DEBUG) {
    console.log("<<<< " + message.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
  }
  return data;
}

exports.send = function (message) {
  message.from = "collision-master";
  message.to = "xbee";
  
  var buffer = new Buffer(JSON.stringify(message) + "\n");

  this.client.send(buffer, 0, buffer.length, 8282, "192.168.1.255", function(err, bytes) {
    //@TODO Error handling.
  });

  if (this.argv.v >= this.log.level.DEBUG) {
    console.log(">>>> " + buffer.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
  }
}
