fs = require 'fs'
path = require 'path'
minimatch = require 'minimatch'
fn = require './fn'

isGlob = (file) -> file.indexOf('*') isnt -1

doMatch = (file, match) ->
  if minimatch file, match, { matchBase: true }
    [file]
  else []

split = (file) ->
  b = path.basename file
  d = path.dirname file
  { b, d }

findit = (file, match) ->
  if isGlob file
    { b: match, d: file } = split file

  try
    stat = fs.statSync file
  catch err
    throw err

  if stat.isDirectory()
    fn.flatten fs.readdirSync(file).map (v) -> findit path.join(file, v), match
  else
    if typeof match is 'string'
      doMatch file, match
    else
      [file]

module.exports = find = (targets) ->
  targets = [targets] unless Array.isArray targets
  fn.flatten targets.map findit
