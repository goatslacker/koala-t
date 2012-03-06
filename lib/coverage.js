var fs = require('fs');
var util = require('util');
var program = require('commander');
var path = require('path');
var coveraje = require('coveraje').coveraje;

// returns a function that coveraje can use which will
// create a coveraje emitter so the tests can run asynchronously.
// once we callback, call the test runner with the context and coveraje's done function
function useTests(runner) {
  return function (context) {
    return coveraje.runHelper.createEmitter(function (event) {
      runner(context, event.complete);
    });
  };
}

// code coverage function takes three parameters
//
// * __fileName__ is the file which coveraje will instrument
// * __runner__ is the test runner function that will be called
// * __cb__ is called when the test coverage is complete
function codeCoverage(fileName, runner, cb) {
  var options = {
    globals: 'node',
    useServer: program.coverageServer,
    quiet: program.quiet
  };

  var file = path.join(process.cwd(), fileName);

  coveraje.cover(fs.readFileSync(file, 'utf-8'), useTests(runner), options, function (instance) {
    var results = instance.runtime.getResults();
    var total = results.total.coverage;

    program.quiet || util.puts('Coverage details', util.inspect(results));

    cb(parseInt(total, 10) > program.percentage ? 0 : 1);
  });
}

// export to koala
module.exports = codeCoverage;
