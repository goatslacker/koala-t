app = require './app'
path = require 'path'

coverage = require './coverage'
typedjs = require './typed'

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

    filename = file

    if start is './' or start is '..'
      file = path.join dirname, file
      filename = "#{file}.js" unless path.extname file

    cover = app.coverage.files.filter(eq filename).pop()
    typed = app.typed.filter(eq filename).pop()

    if cover or typed
      if cover and typed
        typedjs.exportCode coverage.asCode(filename), filename
      else if cover
        coverage.require filename
      else if typed
        typedjs.require filename
    else
      require file
