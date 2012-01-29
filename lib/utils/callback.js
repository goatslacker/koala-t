var errs = 0;

// Callback handles all the callbacks in koala to keep
// the code dry.
//
// All arguments are analyzed, and if any is > 0 then the build
// will fail.
function callback(cb) {
  return function () {
    var args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function (arg) {
      errs = errs || arg > 0 ? 1 : 0;
    });
    cb(errs);
  };
}

// export to koala
module.exports = callback;
