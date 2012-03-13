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

  coveraje.coverNode(
    path.join process.cwd(), file
    (context, inst) =>
      instance = inst
      exported = context
    { globals: 'node', quiet: true }
    app.noop
  )

  { instance, exported }


# doRequire takes a file, instruments it, and adds it
# to our coverage object so we can use it in `coverage.done` later.
# Returns the exported, instrumented code.
doRequire = (file) ->
  { instance, exported } = instrument file
  coverage.instances.push { file, instance }
  exported


coverage =
  instances: []

# The alternative require we use in coveraje.
# This determines if the file needs to be covered
# and calls the appropriate require.
  require: (fullPath) ->
    dirname = path.dirname fullPath
    (file) ->
      start = file.substring 0, 2
      file = path.join(dirname, file)  if start is './' or start is '..'

      compare = "#{file}.js" unless path.extname file

      res = app.coverage.files.filter (f) ->
        f = path.join process.cwd(), f
        f is compare

      if res.length > 0
        doRequire res.pop()
      else
        require file

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
