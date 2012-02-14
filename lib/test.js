var blackbox = require('./utils/blackbox');
var path = require('path');

// The test function will run your unit tests in a sandboxed
// environment. It takes 3 parameters.
//
// * __fileName__ is the file name of the runner
// * __sandbox__ is an optional sandbox to use to run the tests in
// * __cb__ is what's called after tests are completed
function test(fileName, sandbox, cb) {
  var file = path.join(process.cwd(), fileName);
  var exported = blackbox(file, sandbox);
  if (typeof exported !== 'function') {
    throw new TypeError('Expected a function and instead received ' + typeof exported);
  } else {
    return exported(cb);
  }
}

// export to koala
module.exports = test;
