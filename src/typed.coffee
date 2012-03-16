app = require './app'
typedjs = require 'typedjs'
dune = require 'dune'
fs = require 'fs'
path = require 'path'
{ fn } = app

parseSignatures = (file) ->
  types = typedjs.enforce fs.readFileSync file, 'utf-8'
  types.getContext()
  types.signatures


contracts = (file, code, context, signatures) ->
  code or= fs.readFileSync file, 'utf-8'

  typedfn = typedjs.enforce code
  context = typedfn.getContext context, signatures
  typed.instances.push { file, typedfn }
  dune.string typedfn.instrumentedCode, file, context


typed =
  instances: []

  exportCode: (coverage, file) ->
    contracts file, coverage.code, coverage.context, parseSignatures file

  require: (file) ->
    contracts file

  done: (callback) ->
    callback fn.flatten(typed.instances.map (i) ->
      fail = i.typedfn.data.fail
      if not app.quiet
        if fail.length is 0
          app.puts "TypedJS #{i.file}: Success."
        else
          app.puts "TypedJS #{i.file}: Failed."

      fail
    ).length


module.exports = typed
