var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');

// Find lets us find files in the file system.
function Find() {
  EventEmitter.call(this);
}

// Inherits from EventEmitter
Find.prototype = Object.create(EventEmitter.prototype);

// prototype.files is the only function for Find.
// it takes 2 parameters.
//
// * __targets__ is a String || Array of places to look for matches
// * __matches__ is an optional RegExp used to test the files in targets.
// By default it looks for files that end in `.js`
Find.prototype.files = function findFiles(targets, match) {
  var dirs = [];
  var count = 0;

  var event = this;

  if (!Array.isArray(targets)) {
    targets = [targets];
  }

  match = match || /\.js$/;

// The collect function is recursively called whenever a file is found.
// If the item is a directory we read the directory and loop
// through all the files, calling collect on every one.
// If it's a file, we check to see if it matches our RegExp and emit an event
// if there's a match.
  function collect(filePath) {

    fs.stat(filePath, function (err, stat) {
// Decrement the count every time this function is ran
      count -= 1;

      if (err === null) {
// If a directory is found, push the
// directory onto the queue.
        if (stat.isDirectory()) {
          dirs.push(filePath);

          fs.readdir(filePath, function (err, files) {
            if (err) {
              return event.emit('error', err);
            }

// Iterates through all files found.
// Increment the count for every file and call collect again
            files.forEach(function (file) {
              count += 1;
              collect(path.join(filePath, file));
            });

// Remove the directory from the queue when this async
// function completes
            dirs.shift();
          });
        } else if (filePath.match(match)) {
          event.emit('file', filePath);
        }

// If the error code is ENOENT then that means the file/directory
// does not exist. Find emits the event.
// If it's another error, emit that.
      } else if (err.code === 'ENOENT') {
        event.emit('error:enoent', filePath);
      } else {
        return event.emit('error', err);
      }

// Once the count drops to zero and there are no more directories
// we're done.
      if (dirs.length === 0 && count === 0) {
        event.emit('done');
      }
    });
  }

  targets.forEach(function (target) {
    count += 1;
    collect(target);
  });
};

// export to koala
module.exports = Find;
