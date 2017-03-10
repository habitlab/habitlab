{yfy, cfy} = require 'cfy'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

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

export once_available = yfy (selector, callback) ->
  current_result = document.querySelector(selector)
  if current_result != null
    callback current_result
  else
    setTimeout ->
      once_available selector, callback
    , 100

export once_available_multiselect = yfy (selector, callback) ->
  current_result = document.querySelectorAll(selector)
  if current_result.length > 0
    callback current_result
  else
    setTimeout ->
      once_available_multiselect selector, callback
    , 100


export once_document_available = yfy (callback) ->
  if document.body?
    callback()
  else
    setTimeout ->
      once_document_available(callback)
    , 100

export once_true = yfy (condition, callback) ->
  if condition()
    callback()
  else
    setTimeout ->
      once_true(condition, callback)
    , 100

export sleep = cfy (time) ->*
  sleep_base = (msecs, callback) ->
    setTimeout(callback, msecs)
  yield yfy(sleep_base)(time)

export run_only_one_at_a_time = (func) ->
  # func is assumed to take 1 argument (finished callback) for the time being
  is_running = false
  return ->
    if is_running
      return
    is_running := true
    func ->
      # finished
      is_running := false

#export add_toolbar_notification = ->
#  chrome.browserAction.setBadgeText {text: '1'}
#  chrome.browserAction.setBadgeBackgroundColor {color: '#3498DB'}

export on_url_change = (func) ->
  prev_url = window.location.href
  chrome.runtime.onMessage.addListener (msg, sender, sendResponse) ->
    {type, data} = msg
    if type == 'navigation_occurred'
      if data.url != prev_url
        prev_url = data.url
        func()

to_camelcase_string = (myString) ->
  myString.replace(/-([a-z])/g, ((g) -> g[1].toUpperCase()))

to_camelcase_dict = (options) ->
  output = {}
  for k,v of options
    output[to_camelcase_string(k)] = v
  return output

export create_shadow_div = (options) ->
  if not options?
    options = {}
  options = to_camelcase_dict(options)
  default_options = {
    fontFamily: '"Open Sans", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif'
    position: 'static'
    zIndex: Number.MAX_SAFE_INTEGER
    fontSize: '14px'
    lineHeight: 1
    padding: '0px'
    margin: '0px'
    opacity: 1
    boxSizing: 'content-box'
  }
  for k,v of default_options
    options[k] = options[k] ? v
  shadow_host = document.createElement('div')
  #shadow_root = shadow_host.attachShadow({mode: 'open'})
  shadow_root = shadow_host.createShadowRoot()
  shadow_div = document.createElement('div')
  for k,v of options
    shadow_div.style[k] = v
  shadow_root.appendChild(shadow_div)
  shadow_div.shadow_root = shadow_root
  shadow_div.shadow_host = shadow_host
  return shadow_div

export wrap_in_shadow = (elem, options) ->
  shadow_div = create_shadow_div(options)
  if elem.length? and elem.length > 0
    elem = elem[0]
  shadow_div.appendChild(elem)
  return shadow_div.shadow_host

export create_shadow_div_on_body = (options) ->
  if not options?
    options = {}
  options.position = options.position ? 'fixed'
  shadow_div = create_shadow_div(options)
  document.body.appendChild(shadow_div.shadow_host)
  return shadow_div

export append_to_body_shadow = (elem, options) ->
  if not options?
    options = {}
  options.position = options.position ? 'fixed'
  shadow_div = create_shadow_div_on_body(options)
  if elem.length? and elem.length > 0
    elem = elem[0]
  shadow_div.appendChild(elem)
  return shadow_div

gexport_module 'common_libs', -> eval(it)
