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
  if (this.argv.v >= this.log.level.DEBUG) {
    console.log(data);
  }
  return data;
}

exports.createFromObject = function (object) {
  object.from = "gameServer";
  var data = JSON.stringify(object);
  if (this.argv.v >= this.log.level.DEBUG) {
    console.log(data);
  }
  return data + "\n";
}
