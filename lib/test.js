var blackbox = require('./utils/blackbox');
var path = require('path');
var program = require('commander');
var typedjs = require('typedjs');
var fs = require('fs');

function runInVm(file, context, cb) {
  var exported = blackbox(file, context);

  if (typeof exported !== 'function') {
    throw new TypeError('Expected a function and instead received ' + typeof exported);
  } else {
    return exported(cb);
  }
}

// The test function will run your unit tests in a sandboxed
// environment. It takes 3 parameters.
//
// * __fileName__ is the file name of the runner
// * __sandbox__ is an optional sandbox to use to run the tests in
// * __cb__ is what's called after tests are completed
function test(fileName, sandbox, cb) {
  var file = path.join(process.cwd(), fileName);
  var exported;
  var test;

  if (program.typed && !program.coverage) {
    test = typedjs.enforce(fs.readFileSync(program.typed).toString());
    test.run(function (context) {
      runInVm(file, context, cb);
    }, sandbox);
  } else {
    runInVm(file, sandbox, cb);
  }

}

// export to koala
module.exports = test;
