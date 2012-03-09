vow = require './lib/vow'
assert = require 'assert'

find = require '../lib/utils/find'

vow 'find', module, {
  'when finding':
    'all files within the testing directory':
      topic: -> find 'test'

      'the result is an Array': (r) -> assert.isArray r
      'this test should be in the results': (r) ->
        assert.equal r.filter((v) -> v.match /find-test.coffee$/).length, 1

    'specific files using a glob':
      topic: -> find 'test/lib/v*'

      'the result is an Array': (r) -> assert.isArray r
      'there should be 1 file test/lib/vow.js': (r) ->
        assert.equal r.length, 1
}
