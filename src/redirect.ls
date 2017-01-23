getUrlParameters = ->
  url = window.location.href
  hash = url.lastIndexOf('#')
  if hash != -1
    url = url.slice(0, hash)
  map = {}
  parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) ->
    #map[key] = decodeURI(value).split('+').join(' ').split('%2C').join(',') # for whatever reason this seems necessary?
    map[key] = decodeURIComponent(value).split('+').join(' ') # for whatever reason this seems necessary?
  )
  return map

params = getUrlParameters()
query = params.query

do ->
  seen_colon = false
  is_alphanumeric = (x) ->
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(x) != -1
  for i from 0 til query.length
    c = query[i]
    if c == ':'
      seen_colon = true
      continue
    if seen_colon and is_alphanumeric(c)
      query := query.substr(i)
      return
  query := 'options'

if query == 'options'
  query = 'options.html'
if query == 'popup'
  query = 'popup.html'
if query.startsWith('index.html') or query.startsWith('options.html') or query.startsWith('popup.html') or query.startsWith('index_jspm.html')
  url = chrome.extension.getURL('/') + query
else
  query = query.split('?').join('&')
  url = chrome.extension.getURL('/index.html?tag=' + query)

window.location.href = url
