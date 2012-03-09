fs = require 'fs'
file = 'koala.json'

# Loads options from `koala.json` if that file exists
# in the project's root directory.
try
  options = JSON.parse fs.readFileSync file, 'utf-8'
catch err
  throw err if err.code isnt 'ENOENT'
  options = {}

# export to koala
module.exports = options
