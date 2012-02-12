exports.argv = {};
exports.log = {};
exports.client = {};

exports.construct = function (argv, log, client) {
  this.argv = argv;
  this.log = log;
  this.client = client;
  return this;
}

exports.create = function (node) {
  // @TODO Logging?
  node.team = 0;
  return node;
}

