app = require './app'
path = require 'path'

coverage = require './coverage'

eq = (o) -> (f) ->
  f = path.join process.cwd(), f
  o is f

# The alternative require we use for coveraje and typedjs
# This determines if the file needs to be covered or typed
# and calls the appropriate require.
module.exports = imports = (fullPath) ->
  dirname = path.dirname fullPath
  (file) ->
    start = file.substring 0, 2
    file = path.join(dirname, file)  if start is './' or start is '..'

#    compare = path.resolve file
    compare = "#{file}.js" unless path.extname file

    cover = app.coverage.files.filter(eq compare).pop()

    if cover
      coverage.require cover
    else
      require file
