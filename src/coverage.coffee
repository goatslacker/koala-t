app = require './app'
fs = require 'fs'
path = require 'path'
coveraje = require 'coveraje'
{ fn } = app

# Instruments a file
#
# * Uses `coveraje` to cover the unit test
#
# Returns the instrumented exported Object, and the instance
instrument = (file) ->
  instance = {}
  exported = {}

  coveraje.cover(
    fs.readFileSync(file, 'utf-8'),
    (context, inst) =>
      instance = inst
      exported = context.module.exports
    { globals: 'node', quiet: true }
    app.noop
  )

  { instance, exported }


coverage =
  instances: []

# Takes a file, instruments it, and adds it
# to our coverage object so we can use it in `coverage.done` later.
# Returns the exported, instrumented code.
  require: (file) ->
    { instance, exported } = instrument file
    coverage.instances.push { file, instance }
    exported

# Done is called when the tests are finished running.
# If files are being covered the results are returned as
# an exit code. Otherwise it returns 0.
  done: ->
    return 0 if coverage.instances.length is 0

    fn.sum coverage.instances.map (i) ->
      results = i.instance.runtime.getResults()
      total = results.total.coverage

      app.puts('Coverage details', i.file, app.inspect results) unless app.quiet

      if parseInt(total, 10) > app.coverage.percentage then 0 else 1


module.exports = coverage
