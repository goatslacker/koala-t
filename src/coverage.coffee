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
  context = {}

  coveraje.cover(
    fs.readFileSync(file, 'utf-8'),
    (ctx, inst) =>
      instance = inst
      context = ctx
    { globals: 'node', quiet: true }
    app.noop
  )

  coverage.instances.push { file, instance }

  { instance, context }


coverage =
  instances: []


  asCode: (file) ->
    { instance, context } = instrument file
    {
      code: instance.getCodes()['initial code'].codeToRun
      context: context
    }


# Takes a file, instruments it, and adds it
# to our coverage object so we can use it in `coverage.done` later.
# Returns the exported, instrumented code.
  require: (file) ->
    { instance, context } = instrument file
    context.module.exports

# Done is called when the tests are finished running.
# If files are being covered the results are returned as
# an exit code. Otherwise it returns 0.
  done: (callback) ->
    return callback 0 if coverage.instances.length is 0

    callback fn.sum coverage.instances.map (i) ->
      results = i.instance.runtime.getResults()
      total = results.total.coverage

      app.puts('Coverage details', i.file, app.inspect results) unless app.quiet

      if parseInt(total, 10) > app.coverage.percentage then 0 else 1


module.exports = coverage
