exports.argv = {};
exports.log = {};

exports.construct = function (argv, log) {
  this.argv = argv;
  this.log = log;
  return this;
}

exports.create = function (newNode) {
  node = newNode;
  log.log(node, this.log.level.INFORMATIONAL);
  return node;
}
