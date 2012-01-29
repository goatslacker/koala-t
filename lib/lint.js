var fs = require('fs');
var util = require('util');
var program = require('commander');
var path = require('path');
var jshint = require('../packages/jshint').JSHINT;

// Loads the `.jshintrc` config file from the project's root
// and from the user's home directory.
function loadConfig(file) {
  return path.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : {};
}

// Merges both .jshintrc config files and returns
// the unified Object.
var options = (function () {
  var confiles = [
    loadConfig(process.env.HOME + '/' + '.jshintrc'),
    loadConfig(process.cwd() + '/' + '.jshintrc')
  ];

  var config = {};

  confiles.forEach(function (conf) {
    Object.keys(conf).forEach(function (key) {
      config[key] = conf[key];
    });
  });

  return config;
}());

// Reads a file and runs JSHint on it
// the callback is called with 1 if the test failed,
// and 0 if it passed.
function lint(file, cb) {
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      throw err;
    }

    jshint(data, options);

    program.quiet || (util.puts(file + ' ' + jshint.errors.length + ' errors'));

    cb(jshint.errors.length > 0 ? 1 : 0);
  });
}

// export to koala
module.exports = lint;
