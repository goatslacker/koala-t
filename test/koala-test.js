var vows = require('vows');
var assert = require('assert');

// items we're testing
var lint = require('../lib/lint');
var tasks = (function () {
  var Tasks = require('../lib/tasks');
  return new Tasks();
}());
var find = (function () {
  var Find = require('../lib/find');
  return new Find();
}());
var options = require('../lib/utils/config');

function testComplete(event) {
  return function () {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(null);
    event.callback.apply(null, args);
  };
}

vows.describe('koala').addBatch({
  'when linting a file': {
    topic: function () {
      lint(__dirname + '/mock/lintme.js', testComplete(this));
    },

    'we receive a status of 1 since there is an error': function (topic) {
      assert.equal(topic, 1);
    }
  },

  'when adding many tasks': {
    topic: function () {
      function a(cb) {
        setTimeout(function () {
          cb(0);
        }, 1);0
      }

      function b(cb) {
        setTimeout(function () {
          cb(2);
        }, 100);
      }

      function c(cb) {
        setTimeout(function () {
          cb(0);
        }, 1);
      }

      // can add multiple tasks
      tasks.add(a, b);
      // or single tasks
      tasks.add(c);

      tasks.run(testComplete(this));
    },

    'tasks will run in parallel and callback when all are done': function (code) {
      // exit code is 1 because one of the tasks called back with 'failed'
      // so they are all marked as failed.
      assert.equal(code, 1);
    }
  },

  'when finding files': {
    topic: function () {
      find.on('file', testComplete(this));
      find.files(__dirname, /-test.js/);
    },

    'should find this test file': function (file) {
      assert.equal(file, __dirname + '/koala-test.js');
    }
  },

  'when loading this project\'s koala.json config file': {
    topic: function () {
      return options;
    },

    'we should have items to lint and test': function (topic) {
      assert.equal(topic.lint.length, 1);
      assert.equal(topic.vows.length, 1);
    }
  }
}).export(module);
