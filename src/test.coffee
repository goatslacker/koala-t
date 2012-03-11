app = require './app'
util = require 'util'
path = require 'path'
dune = require 'dune'
coverage = require './coverage'
minimatch = require 'minimatch'
{ find, fn } = app

reporter = { reporter: { report: -> 0 } } if app.quiet

# Runs vows tests
#
# * Loops through all keys of the exported module
# * Runs the tests as a task
#
# Returns a function which runs the tasks
runVows = (exported) ->
  tasks = new app.Tasks

  Object.keys(exported).forEach (k) ->
    t = exported[k]
    return unless t.run

    tasks.add (done) ->
      t.run reporter, (results) ->
        done(results.broken or results.errored)

  (done) -> tasks.run done


# Compiles a test
#
# * Wraps the file with `dune`
# * Runs `vows` if it's a vows test
#
# Returns a function which runs the tests
compileTest = (file) ->
  fullPath = path.join process.cwd(), file
  exported = dune.file fullPath, null, coverage.require fullPath

  return runVows exported if app.vows

  if typeof exported isnt 'function'
    throw new TypeError """
      Expected a Function and instead received #{typeof exported}.
    """

  (done) -> exported done


# Main exports
#
# * Sets up Tasks since tests may be asynchronous
# * Uses `find` to find all test files
# * Adds the list of compiled tests to tasks
# * Runs the task
#
# Calls back with a sum of the exit codes from each test and coverage
module.exports = test = (cb, targets) ->
  tasks = new app.Tasks
  files = find targets or app.test
  tasks.add files.map (f) -> compileTest f
  tasks.run (x) -> cb fn.sum [x, coverage.done()]
