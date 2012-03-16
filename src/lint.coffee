app = require './app'
fs = require 'fs'
path = require 'path'
{ fn, find } = app
{ JSHINT } = require '../packages/jshint'
{ lint: CSLINT } = require 'coffeelint'


# Boolean. Answers if a file is a CoffeeScript file.
###
//+ isCoffeeScript :: String -> String
###
isCoffeeScript = (file) ->
  file.match /.coffee$/


# Loads the `.jshintrc` config file from the project's root
# and from the user's home directory.
loadConfig = (file) ->
  if path.existsSync file
    JSON.parse fs.readFileSync file, 'utf-8'
  else {}


# Merges both .jshintrc config files and returns
# the unified Object.
getConfig = ->
  return getConfig.options if getConfig.options

  confiles = [
    loadConfig path.join app.process.env.HOME, '.jshintrc'
    loadConfig path.join app.process.cwd(), '.jshintrc'
  ]

  config = {}

  confiles.forEach (conf) ->
    config = fn.mixin conf, config

  getConfig.options = config


# Reads a file and runs JSHint on it
# the callback is called with 1 if the test failed,
# and 0 if it passed.
lintFile = (file) ->
  data = fs.readFileSync file, 'utf-8'


  if isCoffeeScript file
    { length: errors } = CSLINT data, getConfig()
    app.puts "#{file} #{errors} errors" if not app.quiet
  else
    JSHINT data, getConfig()
    errors = JSHINT.errors.length
    if not app.quiet
      app.puts "#{file} #{errors} errors"
      JSHINT.errors.forEach (e) -> app.puts e.reason

  if errors > 0 then 1 else 0


# Main export.
#
# * Uses `find` to find all files
# * Lints all the files
# * Sums up the exit codes
#
# Calls back with the sum of all exit codes.
module.exports = lint = (cb, targets) ->
  files = find targets or app.lint
  cb fn.sum files.map lintFile
