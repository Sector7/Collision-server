exports.argv = {};

exports.construct = function(argv) {
  this.argv = argv;
  return this;
}

exports.level = {
  DEBUG : 7,
  INFORMATIONAL : 6,
  NOTICE : 5,
  WARNING : 4,
  ERROR : 3,
  ALERT : 2,
  CRITICAL : 1,
  EMERGENCY : 0,
}

exports.log = function(message, level) {
  if (this.argv.v >= level) {
    console.log(message);
  }
}
