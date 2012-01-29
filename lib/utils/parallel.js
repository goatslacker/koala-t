// Parallel runs functions in parallel
// and calls the callback once all functions are complete
//
// * __tasks__ is an Array of functions to run
// * __cb__ is the callback
function parallel(tasks, cb) {
  var args = [];
  var counter = 0;
  var replies = [];

  if (!Array.isArray(tasks)) {
    if (arguments.length > 2) {
      args = Array.prototype.slice.call(arguments, 0);
      cb = args.pop();
      tasks = args;
    } else {
      tasks = [tasks];
    }
  }

  counter = tasks.length;

// The done function is passed to every task we call, this function needs
// to be called in order for the function to be marked as 'complete'.
// Once all functions are complete, we apply the callback with all the arguments
// we have collected.
  function done() {
    counter -= 1;
    replies = replies.concat(Array.prototype.slice.call(arguments, 0));

    if (counter === 0) {
      cb.apply(cb, replies);
    }
  }

  tasks.forEach(function (task) {
    task(done);
  });
}

// export to koala
module.exports = parallel;
