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

    if start is './' or start is '..'
      file = path.join dirname, file
      file = "#{file}.js" unless path.extname file

    cover = app.coverage.files.filter(eq file).pop()
    typed = app.typed.filter(eq file).pop()

    if cover or typed
      if cover and typed
        typedjs.exportCode coverage.asCode(file), file
      else if cover
        coverage.require file
      else if typed
        typedjs.require file
    else
      require file
