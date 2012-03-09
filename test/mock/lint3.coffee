lives = 9
cat = '(=^ェ^=)'

kill = (body) ->
  body = null

while lives > 0
  lives -= 1
  kill cat if lives is 0
