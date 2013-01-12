exports.argv = {};
exports.log = {};

exports.construct = function (argv, log, config_file, callback) {

  get_config = function (err, data) {
    if (err) {
      throw new Error("Failed to read config file " + config_file);
    }
    else {
      config = JSON.parse(data);
      callback(config);
    }
  }

  fs = require('fs');
  fs.readFile(config_file, 'utf8', get_config);
}
