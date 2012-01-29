var test = require('./vows-test.js');

function run(cb) {
  test.koala.run(null, function (results) {
    cb(results.errored || results.broken);
  });
}

module.exports = run;
