exports.sum = (args) -> args.reduce (a, b) -> a + b

exports.mixin = (obj, base) ->
  Object.keys(obj).forEach (k) ->
    base[k] = obj[k]

  base

exports.flatten = (arr) -> arr.reduce (a, b) -> a.concat b
