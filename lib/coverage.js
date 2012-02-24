var fs = require('fs');
var util = require('util');
var program = require('commander');
var path = require('path');
var coveraje = require('../packages/coveraje/').coveraje;

var typedjs = require('typedjs');

// returns a function that coveraje can use which will
// create a coveraje emitter so the tests can run asynchronously.
// once we callback, call the test runner with the context and coveraje's done function
function useTests(runner, typedFile) {
  return function (context, instance) {
    var test;
    var signatures;

    if (typedFile) {
      // this is an ugly hack
      // because uglify strips comments and thus no signatures :(
      test = typedjs.enforce(fs.readFileSync(typedFile, 'utf-8'));
      test.getContext();
      signatures = test.signatures;
      //

      test = typedjs.enforce(instance.getCodes()['initial code'].codeToRun);
      context = test.getContext(context);

      context._$TypedJS.signatures = signatures; // figure out a nicer way of loading signatures
    }

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

  var useTyped = false;

  if (program.typed) {
    // TODO need to make sure that coverage file exists in program.typed
    // tmp check for that. could be an array! need a lib/util to do this
    if (program.typed === fileName) {
      useTyped = file;
    }
  }

  coveraje.cover(fs.readFileSync(file, 'utf-8'), useTests(runner, useTyped), options, function (instance) {
    var results = instance.runtime.getResults();
    var total = results.total.coverage;

    cb(parseInt(total, 10) > program.percentage ? 0 : 1);
  });
}

// export to koala
module.exports = codeCoverage;
