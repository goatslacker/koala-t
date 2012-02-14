// Loads up a `koala.json` config file if it exists
var options = require('./lib/utils/config');

var program = require('commander');
var util = require('util');

// Tasks that `koala-t` can perform
var lint = require('./lib/lint');
var test = require('./lib/test');
var cover = require('./lib/coverage');

// Find lets us find files on the filesystem
var Find = require('./lib/find');
// Tasks lets us run tasks in parallel
var Tasks = require('./lib/tasks');
// ErrorManager will keep our code dry
var ErrorManager = require('./lib/error_manager');

// We initialize the program
// and parse all options passed in by the user via CLI
program
  .option('-c, --coverage [file]', 'Instrument a file for coverage')
  .option('-l, --lint [file|dir]', 'Lint specific file or directory')
  .option('-p, --percentage [number]', 'The amount of code coverage required to pass')
  .option('-q, --quiet', 'Keep things quiet.')
  .option('-t, --test [file|dir]', 'Test specific file or directory')
  .parse(process.argv);

// The options are set via CLI, `koala.json` or by default in that order.
// Any conflicting options will be overriden by the parent.

// By default we lint all JavaScript files in `src/` and `lib/`, and
// we test all JavaScript files in `test/`
program.lint = program.lint || options.lint || ['src', 'lib'];
program.test = program.test || options.test || ['test'];
program.coverage = program.coverage || options.coverage || null;
program.percentage = program.percentage || options.percentage || 80;


// Our linting function
// finds all files to be linted and then creates a task for them
// then it carries out the task, linting all the files.
function linter(done) {
  var find = new Find();
  var tasks = new Tasks('lint');
  var fn = new ErrorManager();

  find.on('file', function (file) {
    tasks.add(function (done) {
      lint(file, fn.onComplete(done, 'lint ' + file));
    });
  });

  find.on('done', function () {
    tasks.run(done);
  });

  find.files(program.lint);
}

// Our testing function
// finds all files to be tested and if we're using code coverage
// it will instrument your code using `coveraje` and then run the unit tests.
// Otherwise, it will just run the test runner(s).
function tester(done) {
  var find = new Find();
  var tasks = new Tasks('tests');
  var fn = new ErrorManager();

  find.on('file', function (file) {
    tasks.add(function (done) {
      if (program.coverage) {
        cover(program.coverage, function (sandbox, complete) {
          test(file, sandbox, fn.onComplete(complete, 'test ' + file));
        }, fn.onComplete(done, 'coverage ' + file));
      } else {
        test(file, null, fn.onComplete(done, 'test ' + file));
      }
    });
  });

  find.on('done', function () {
    tasks.run(done);
  });

  find.files(program.test);
}

// Our exit function from the program.
// Once all tasks are complete, we check the status code and exit.
function exit(statusCode) {
  if (!program.quiet) {
    if (statusCode) {
      util.puts('Failed.');
    } else {
      util.puts('Success.');
    }
  }

  process.exit(statusCode);
}

// Create a new Task Object;
// add lint, and test task;
// when finished run our exit function.
function koala_t() {
  var tasks = new Tasks('koala-t');
  tasks.add(linter);
  tasks.add(tester);
  tasks.run(exit);
}

// export
module.exports = koala_t;
