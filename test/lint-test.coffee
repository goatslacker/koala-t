vow = require './lib/vow'
assert = require 'assert'

lint = require '../lib/lint'

vow 'lint', module, {
  'lint':
    topic: -> lint
    'is a function': (r) -> assert.isFunction r

  'when linting a file':
    'with errors':
      topic: ->
        lint ((r) =>
          @callback null, r
        ), 'test/mock/lintme.js'

      'status should be fail': (r) -> assert.equal r, 1

    'with no errors':
      topic: ->
        lint ((r) =>
          @callback null, r
        ), 'test/mock/lint2.js'

      'status should be success': (r) -> assert.equal r, 0

    'when linting a coffeescript file':
      topic: ->
        lint ((r) => @callback null, r), 'test/mock/lint3.coffee'

      'status should be success': (r) -> assert.equal r, 0
}
