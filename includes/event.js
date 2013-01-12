exports.argv = {};
exports.log = {};

exports.construct = function (argv, log, config) {
  this.argv = argv;
  this.log = log;
  this.config = config;
  return this;
}

exports.create = function (event) {
  var event = {
    name: this.config.events[event],
    'payload': ''
  }

  return event;
}
