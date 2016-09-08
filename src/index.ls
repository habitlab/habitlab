<- (-> it!)

window.global_exports = {}

window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

if window.location.pathname == '/popup.html'
  require 'components/popup-view.deps'
  document.querySelector('#index_body').appendChild(document.createElement('popup-view'))
  require 'libs_common/global_exports_post'
  return

if window.location.pathname == '/options.html'
  require 'components/options-view.deps'

  hash = window.location.hash
  if not hash? or hash == ''
    hash = '#settings'
    window.location.hash = '#settings'
  if hash.startsWith('#')
    hash = hash.substr(1)
  options_view = document.querySelector('#options_view')
  if hash == 'introduction'
    options_view.selected_tab_idx = -1
    #yield options_view.icon_clicked()
  options_view.set_selected_tab_by_name(hash)
  options_view.addEventListener 'options_selected_tab_changed', (evt) ->
    window.location.hash = evt.detail.selected_tab_name
  #  options_view
  require 'libs_common/global_exports_post'
  return


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

require! {
  'js-yaml'
}

{cfy} = require 'cfy'
{get_interventions} = require 'libs_backend/intervention_utils'

require 'components/components.deps'

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

start_page_index = cfy ->*
  interventions = yield get_interventions()
  window.intervention = interventions['debug/fake_intervention']
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

start_page_index()

require 'libs_common/systemjs'

systemjs_require <- System.import('libs_common/systemjs_require').then()
drequire <- systemjs_require.make_require_frontend().then()
window.drequire = drequire

require 'libs_common/global_exports_post'