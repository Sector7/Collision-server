exports.argv = {};
exports.log = {};

exports.construct = function (argv, log) {
  this.argv = argv;
  this.log = log;
  return this;
}

exports.create = function (newNode) {
  node = newNode;

  if (this.argv.v >= this.log.level.INFORMATIONAL) {
    console.log(node);
  }

  return node;
}
