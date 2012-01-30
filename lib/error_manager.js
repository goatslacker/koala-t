// Internal ErrorManager
function ErrorManager() {
  this.errs = 0;
}

// onComplete handles all the callbacks in koala to keep
// the code dry.
//
// All arguments are analyzed, and if any is > 0 then the build
// will fail.
ErrorManager.prototype.onComplete = function (cb) {
  var self = this;

  return function () {
    var args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function (arg) {
      self.errs = self.errs || arg > 0 ? 1 : 0;
    });
    cb(self.errs);
  };
};

// export to koala
module.exports = ErrorManager;
