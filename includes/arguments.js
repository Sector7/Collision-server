exports.argv = {};
exports.log = {};

exports.construct = function (argv, log) {
  var argv = require('optimist')
    .usage('Starts the Collision game server')
    .options('verbose', {
      alias: 'v',
      default: 5
    })
    .argv;

  return argv;
};
