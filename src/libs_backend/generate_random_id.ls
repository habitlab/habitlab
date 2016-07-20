export generate_random_id = ->
  randomPool = new Uint8Array(32)
  crypto.getRandomValues(randomPool)
  hex = ''
  for i from 0 til randomPool.length
      hex += randomPool[i].toString(16)
  return hex
