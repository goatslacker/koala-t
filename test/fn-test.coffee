vow = require './lib/vow'
assert = require 'assert'

fn = require '../lib/utils/fn'

vow 'fn', module, {
  'when using sum':

    topic: ->
      fn.sum [1, 2, 3, 4, 5]

    'result should be 15': (r) ->
      assert.equal r, 15


  'when using mixin':

    'on an empty object':
      topic: ->
        fn.mixin { foo: 123 }, {}

      'new object should contain foo': (r) ->
        assert.equal r.foo, 123

    'and overriding values':
      topic: ->
        fn.mixin { bar: false }, { bar: true }

      'bar should be false': (r) ->
        assert.isFalse r.bar

    'on an object with keys':
      topic: ->
        fn.mixin { one: 1, two: 2 }, { three: 3, four: 4 }

      'new object should have 4 keys': (r) ->
        assert.equal Object.keys(r).length, 4

  'when flattening a list':

    topic: -> fn.flatten [ [1], [2], [3] ]
    'should be merged into one single list': (r) -> assert.deepEqual r, [1, 2, 3]
}
