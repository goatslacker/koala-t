var vm = require('vm');
var fs = require('fs');
var path = require('path');

// Wraps our functions in a function which makes a few variables local
var boxed = [
  '(function (exports, require, module, __filename, __dirname) {\n',
  '\n});'
];

// Encapsulate will wrap our code inside the wrapper function.
function encapsulate(filename) {
  return boxed[0] + fs.readFileSync(filename, 'utf-8') + boxed[1];
}

// Extract gives us the directory and basename of the file passed.
function extract(file) {
  return [path.dirname(file), path.basename(file)];
}

// Box
//
// * __file__ is the file to run in a sandbox
// * __sandbox__ is the optional sandbox to use when running the file
//
// The code from the file will be wrapped in a function.
// Next, we override the `require` method to look in the appropriate
// directory for files.
// Finally we compile the code and return what is exported.
function box(file, sandbox) {
  var args = [];
  var compiled;

  var path = extract(file);
  var dirname = path[0];
  var filename = path[1];

  var wrapped = encapsulate(file);

  var self = {};
  self.exports = {};

  function req(module) {
    var start = module.substring(0, 2);

    if (start === './' || start === '..') {
      return require(dirname + '/' + module);
    } else {
      return require(module);
    }
  }

  compiled = sandbox ?
    vm.runInNewContext(wrapped, sandbox, filename) :
    vm.runInThisContext(wrapped, filename);

  args = [self.exports, req, self, filename, dirname];
  compiled.apply(self.exports, args);

  return self.exports;
}

// export to koala
module.exports = box;
