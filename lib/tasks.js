var parallel = require('./utils/parallel');
var callback = require('./utils/callback');

// Tasks function runs tasks in parallel
function Tasks() {
  this.tasks = [];
}

// Adds a function, or multiple functions, to our tasks Array for
// running later
Tasks.prototype.add = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  this.tasks = this.tasks.concat(args);
};

// Run will start running the tasks in parallel
// when it's complete it'll call the callback function
// with the arguments returned from each function that was ran.
Tasks.prototype.run = function (fn) {
  parallel(this.tasks, callback(fn));
};

// export to koala
module.exports = Tasks;
