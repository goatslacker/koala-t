app = require 'commander'
util = require 'util'
options = require './utils/config'
fn = require './utils/fn'
find = require './utils/find'
Tasks = require './tasks'
noop = -> 0


# We initialize the app
# and parse all options passed in by the user via CLI
app
  .option('-c, --coverage [file]', 'Instrument a file for coverage')
  .option('-l, --lint [file|dir]', 'Lint specific file or directory')
  .option('-p, --percentage [number]',
    'The amount of code coverage required to pass')
  .option('-q, --quiet', 'Keep things quiet.')
  .option('-s, --coverage-server', 'Start coverage server.')
  .option('-t, --test [file|dir]', 'Test specific file or directory')
  .parse(process.argv)


# The options are set via CLI, `koala.json` or by default in that order.
# Any conflicting options will be overriden by the parent.
#
# By default we lint all JavaScript files in `src/` and `lib/`, and
# we test all JavaScript files in `test/`
app.lint = app.lint or options.lint or ['src', 'lib']
app.test = app.test or options.test or options.vows or ['test']
app.vows = options.vows
app.coverage = app.coverage or options.coverage or { files: [] }
app.coverage.percentage or= 80
app.typed = app.typed or options.typed or []


# Mixes in some utility functions
fn.mixin util, app
fn.mixin { fn, find, Tasks, noop }, app


module.exports = app
