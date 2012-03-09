app = require './app'

# Tasks that `koala-t` can perform
lint = require './lint'
test = require './test'

# Exit function.
# Will quit with the exit code it's given and report it.
exit = (code) ->
  code = if code isnt 0 then 1 else 0

  if not app.quiet
    app.puts if code then 'Failed.' else 'Success.'

  process.exit code unless app.coverageServer

# Main export.
#
# Sets up tasks for linting and testing
# and runs them.
#
# Calls `exit()` when finished.
module.exports = koala_t = ->
  tasks = new app.Tasks 'koala-t'

  tasks.add (done) -> lint done
  tasks.add (done) -> test done
  tasks.run exit
