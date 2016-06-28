export getUrlParameters = ->
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
  {index_body_width, index_body_height} = params
  if not tagname?
    tagname = 'debug-view'
  tag = document.createElement(tagname)
  for k,v of params
    if k == 'tag' or k == 'index_body_width' or k == 'index_body_height'
      continue
    v = jsyaml.safeLoad(v)
    tag[k] = v
  document.getElementById('index_contents').appendChild(tag)
  index_body = document.getElementById('index_body')
  if index_body_width?
    index_body.style.width = index_body_width
  if index_body_height
    index_body.style.height = index_body_height
  return

window.addEventListener 'WebComponentsReady', ->
  startPage()
  return
