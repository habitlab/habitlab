window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

{
  getUrlParameters
} = require 'libs_frontend/common_libs'

use_polyfill = getUrlParameters().polyfill
if use_polyfill and use_polyfill != 'false' and parseInt(use_polyfill) != 0
  # force the usage of polyfills
  document.registerElement = null

require 'webcomponentsjs-custom-element-v0'

# this script must run before Polymer is imported
window.Polymer = {
  dom: 'shady',
  #dom: 'shadow',
  lazyRegister: true,
}

window.intervention = {
  name: 'debug/debug_view'
  description: 'This is a fake intervention used in the debug view page'
  params: {}
  parameters: []
  matches: []
  nomatches: []
  content_scripts: []
  background_scripts: []
  content_script_options: []
  background_script_options: []
  goals: []
}

require! {
  'js-yaml'
}

require 'components/components.deps'
require 'components_skate/components_skate'

if window.jsyaml? and not window.js-yaml?
  window.js-yaml = window.jsyaml

/*
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
*/

set_nested_property = (tag, property_name, property_value) ->
  dot_index = property_name.indexOf('.')
  if dot_index == -1
    tag[property_name] = property_value
    return
  property_name_start = property_name.substr(0, dot_index)
  property_name_remainder = property_name.substr(dot_index + 1)
  set_nested_property tag[property_name_start], property_name_remainder, property_value

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
    v = js-yaml.safeLoad(v)
    set_nested_property tag, k, v
    #if k.startsWith('style.')
    #  tag.customStyle[k.replace('style.', '')] = v
    #  continue
    #if k.startsWith('customStyle.')
    #  tag.customStyle[k.replace('customStyle.', '')] = v
    #  continue
    #  #tag.updateStyles() or Polymer.updateStyles() doesn't seem to be necessary
    #tag[k] = v
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
