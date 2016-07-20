export generate_random_id = ->
  output = ''
  for i from 0 til 24
    output += '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return output
