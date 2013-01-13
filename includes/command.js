exports.argv = {};
exports.log = {};

exports.construct = function (argv, log, client) {
  this.argv = argv;
  this.log = log;
  this.client = client;
  return this;
}

exports.createFromText = function (message) {
  var data = JSON.parse(message);
  log.log(data, this.log.level.DEBUG);
  return data;
}

exports.createFromObject = function (object) {
  object.from = "gameServer";
  var data = JSON.stringify(object);
  log.log(data, this.log.level.DEBUG);
  return data + "\n";
}
