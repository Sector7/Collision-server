exports.argv = {};
exports.log = {};

exports.construct = function (argv, log) {
  this.argv = argv;
  this.log = log;
  return this;
}

exports.create = function (message) {
  var data = JSON.parse(message);
  if (this.argv.v >= this.log.level.DEBUG) {
    console.log(data);
  }
  return data;
}

