export localstorage_getbool = (key) ->
  return localStorage.getItem(key) == 'true'

export localstorage_setbool = (key, val) ->
  if val
    localStorage.setItem(key, 'true')
  else
    localStorage.removeItem(key)
  return

export localstorage_getint = (key) ->
  val = localStorage.getItem(key)
  if val?
    return parseInt(val)
  return null

export localstorage_setint = (key, val) ->
  localStorage.setItem(key, val)
  return

export localstorage_getfloat = (key) ->
  val = localStorage.getItem(key)
  if val?
    return parseFloat(val)
  return null

export localstorage_setfloat = (key, val) ->
  localStorage.setItem(key, val)
  return

export localstorage_getjson = (key) ->
  val = localStorage.getItem(key)
  if val?
    return JSON.parse(val)
  return null

export localstorage_setjson = (key, val) ->
  localStorage.setItem(key, JSON.stringify(val))
  return

export localstorage_getstring = (key) ->
  return localStorage.getItem(key)

export localstorage_setstring = (key, val) ->
  return localStorage.setItem(key, val)
