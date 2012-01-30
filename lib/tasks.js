var parallel = require('./utils/parallel');
var ErrorManager = require('./error_manager');

// Tasks function runs tasks in parallel
function Tasks() {
  this.tasks = [];
  this.fn = new ErrorManager();
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
Tasks.prototype.run = function (cb) {
  parallel(this.tasks, this.fn.onComplete(cb));
};

// export to koala
module.exports = Tasks;
