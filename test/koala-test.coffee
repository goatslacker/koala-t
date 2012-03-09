vow = require './lib/vow'
assert = require 'assert'

koala = require '../'

vow 'koala-t', module, {
  'when starting koala-t':
    topic: -> koala

    'is a function': (r) -> assert.isFunction r
}
