var util = require('util');

// Internal ErrorManager
function ErrorManager() {
  this.errs = 0;
}

// onComplete handles all the callbacks in koala to keep
// the code dry.
//
// All arguments are analyzed, and if any is > 0 then the build
// will fail.
ErrorManager.prototype.onComplete = function (cb, label) {
  var self = this;

  return function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var exitCode = 0;
    args.forEach(function (arg) {
      exitCode = exitCode || arg > 0 ? 1 : 0;
      if (arg > 0 && label) {
        util.puts(label + ' Failed.');
      }
    });

    self.errs = self.errs || exitCode;
    cb(self.errs);
  };
};

// export to koala
module.exports = ErrorManager;
