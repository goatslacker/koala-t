fn = require './utils/fn'

# Parallel runs functions in parallel
# and calls the callback once all functions are complete
#
# * __tasks__ is an Array of functions to run
# * __cb__ is the callback
parallel = (tasks, cb) ->
  replies = []
  counter = tasks.length

# The done function is passed to every task we call, this function needs
# to be called in order for the function to be marked as 'complete'.
# Once all functions are complete, we apply the callback with all the arguments
# we have collected.
  done = (args...) ->
    counter -= 1
    replies = replies.concat args
    cb.apply cb, replies if counter is 0

  tasks.forEach (task) -> task done


class Tasks
  constructor: (@name) ->
    @tasks = []

  add: (tasks...) ->
    @tasks = @tasks.concat fn.flatten tasks

  run: (cb) ->
    parallel @tasks, (res...) -> cb fn.sum res


module.exports = Tasks
