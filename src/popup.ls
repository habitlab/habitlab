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

startPage = ->
  params = getUrlParameters()
  tagname = params.tag
  {survey} = params
  if not tagname?
    if survey?
      tagname = survey + '-survey'
    else
      tagname = 'popup-view'
  tag = document.createElement(tagname)
  for k,v of params
    if k == 'tag'
      continue
    v = jsyaml.safeLoad(v)
    tag[k] = v
  document.getElementById('contents').appendChild(tag)

window.addEventListener 'WebComponentsReady', ->
  console.log window.location
  startPage()
  return
