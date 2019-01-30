<- (-> it!)

window.global_exports = {}

require('enable-webcomponents-in-content-scripts')

window.addEventListener "unhandledrejection", (evt) ->
  throw evt.reason

dlog = window.dlog = (...args) ->
  if localStorage.getItem('display_dlog') == 'true'
    console.log(...args)

require 'libs_backend/systemjs'

if window.location.pathname == '/popup.html'
  require 'components/popup-view.deps'
  document.querySelector('#index_body').appendChild(document.createElement('popup-view'))
  require 'libs_common/global_exports_post'
  return

add_url_input_if_needed = ->
  if localStorage.index_show_url_bar == 'true'
    url_input = document.createElement('input')
    url_input.style.position = 'fixed'
    url_input.style.bottom = '0px'
    url_input.style.left = '0px'
    url_input.value = window.location.href
    url_input.style.width = '100vw'
    url_input.style.backgroundColor = 'transparent'
    url_input.style.border = 'none'
    url_input.style.color = 'white'
    url_input.style.backgroundColor = 'black'
    url_input.addEventListener 'keydown', (evt) ->
      if evt.keyCode == 13
        if url_input.value != window.location.href
          window.location.href = url_input.value
        else
          window.location.reload()
    document.body.appendChild(url_input)
  return

window.developer_options = ->
  window.location.href = '/index.html?tag=options-dev'

if window.location.pathname == '/options.html'
  require 'components/options-view-v2.deps'

  hash = window.location.hash
  if not hash? or hash == ''
    hash = '#settings'
    window.location.hash = '#settings'
  if hash.startsWith('#')
    hash = hash.substr(1)
  options_view = document.querySelector('#options_view')
  if hash == 'introduction'
    options_view.selected_tab_idx = -1
    #await options_view.icon_clicked()
  options_view.set_selected_tab_by_name(hash)
  options_view.addEventListener 'options_selected_tab_changed', (evt) ->
    window.location.hash = evt.detail.selected_tab_name
  #  options_view
  require 'libs_common/global_exports_post'
  add_url_input_if_needed()
  return


{
  getUrlParameters
} = require 'libs_frontend/frontend_libs'

{
  set_intervention
} = require 'libs_common/intervention_info'

params = getUrlParameters()
use_polyfill = false
if params.polyfill?
  use_polyfill = params.polyfill
  delete params.polyfill
  if use_polyfill and use_polyfill != 'false' and parseInt(use_polyfill) != 0
    # force the usage of polyfills
    document.registerElement = null
    require 'webcomponentsjs-custom-element-v0'

window.Polymer = window.Polymer || {}
window.Polymer.lazyRegister = true
window.Polymer.dom = 'shady'
use_shadow_dom = false
if params.shadow_dom?
  use_shadow_dom = params.use_shadow_dom
  if use_shadow_dom and use_shadow_dom != 'false' and parseInt(use_shadow_dom) != 0
    # force the usage of shadow dom
    window.Polymer.dom = 'shadow'

require! {
  'js-yaml'
}

{get_interventions} = require 'libs_backend/intervention_utils'

{
  get_custom_component_info
} = require 'libs_backend/component_utils'

{
  wrap_in_shadow
} = require 'libs_frontend/frontend_libs'

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

{
  log_pageview
} = require 'libs_backend/log_utils'

start_page_index = ->>
  document.title = window.location.href.replace(chrome.extension.getURL(''), '').replace('index.html?tag=', '')
  interventions = await get_interventions()
  window.intervention = interventions['debug/fake_intervention']
  window.goal_info = {
    name: 'debug/fake_goal'
    domain: 'habitlab.stanford.edu'
    homepage: 'https://habitlab.stanford.edu'
    sitename: 'goal'
    sitename_printable: 'Goal'
    description: 'Fake goal'
  }
  require 'components/components.deps'
  #set_intervention window.intervention
  tagname = params.tag
  {index_body_width, index_body_height, index_background_color} = params
  if not tagname?
    tagname = 'debug-view'
  component_info = await get_custom_component_info(tagname)
  if component_info?
    systemjs_config_extra_map = localStorage.getItem('systemjs_config_extra_map')
    if systemjs_config_extra_map?
      systemjs_config_extra_map = JSON.parse systemjs_config_extra_map
      SystemJS.config({map: systemjs_config_extra_map})
    # custom component, need to load it
    #await SystemJS.import('data:text/javascript;base64,' + btoa(component_info.code))
    #await SystemJS.import('components/' + component_info.name + '.jspm.js')
    await SystemJS.import('components/' + component_info.name + '.deps')
  tag = document.createElement(tagname)
  num_properties = 0
  for k,v of params
    if k == 'tag' or k == 'index_body_width' or k == 'index_body_height' or k == 'index_background_color'
      continue
    v = js-yaml.safeLoad(v)
    set_nested_property tag, k, v
    num_properties += 1
    #if k.startsWith('style.')
    #  tag.customStyle[k.replace('style.', '')] = v
    #  continue
    #if k.startsWith('customStyle.')
    #  tag.customStyle[k.replace('customStyle.', '')] = v
    #  continue
    #  #tag.updateStyles() or Polymer.updateStyles() doesn't seem to be necessary
    #tag[k] = v
  if num_properties == 0
    tag.isdemo = true
  if use_shadow_dom
    document.getElementById('index_contents').appendChild(wrap_in_shadow(tag))
  else
    document.getElementById('index_contents').appendChild(tag)
  index_body = document.getElementById('index_body')
  if index_body_width?
    index_body.style.width = index_body_width
  if index_body_height
    index_body.style.height = index_body_height
  if not index_background_color?
    if ['options-view-v2', 'options-view', 'popup-view-v2', 'popup-view'].indexOf(tagname) == -1
      if tag.index_background_color?
        index_background_color = tag.index_background_color
      else
        index_background_color = 'white'
    else
      index_background_color = 'rgb(81, 167,249)'
  if index_background_color?
    console.log 'setting index background color to ' + index_background_color
    document.body.style.backgroundColor = index_background_color
  add_url_input_if_needed()
  window.basetag = tag
  log_pageview({to: 'index'})
  return

start_page_index()

# systemjs_require <- SystemJS.import('libs_common/systemjs_require').then()
# drequire <- systemjs_require.make_require_frontend().then()
# window.require = drequire
window.uselib = (libname, callback) ->
  if typeof(callback) == 'function'
    SystemJS.import(libname).then(callback)
  else if typeof(callback) == 'string'
    SystemJS.import(libname).then (imported_lib) ->
      window[callback] = imported_lib
      console.log('imported as window.' + callback)
  else if typeof(libname) == 'string'
    callback = libname.toLowerCase().split('').filter((x) -> 'abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(x) != -1).join('')
    SystemJS.import(libname).then (imported_lib) ->
      window[callback] = imported_lib
      console.log('imported as window.' + callback)
  else
    console.log([
      'Use uselib() to import jspm libraries.'
      'The first argument is the library name (under SystemJS, see jspm)'
      'The second argument is the name it should be given (in the \'window\' object)'
      'Example of using moment:'
      '    uselib(\'moment\', \'moment\')'
      '    window.moment().format()'
      'Example of using jquery:'
      '    uselib(\'jquery\', \'$\')'
      '    window.$(\'body\').css(\'background-color\', \'black\')'
      'Example of using sweetalert2:'
      '    uselib(\'libs_common/content_script_utils\', \'content_script_utils\')'
      '    content_script_utils.load_css_file(\'bower_components/sweetalert2/dist/sweetalert2.css\')'
      '    uselib(\'sweetalert2\', \'swal\')'
      '    swal(\'hello world\')'
    ].join('\n'))

if localStorage.refresh_livereload == 'true'
  do !->>
    try
      script_fetch_result = await fetch('http://localhost:35729/livereload.js?snipver=1')
      script_text = await script_fetch_result.text()
      script_tag = document.createElement('script')
      #script_tag.src = chrome.extension.getURL('/livereload.js?snipver=1')
      script_tag.src = 'http://localhost:35729/livereload.js?snipver=1'
      document.getElementsByTagName('head')[0].appendChild(script_tag)
      eval(script_text)
    catch e
      console.log e

require 'libs_common/global_exports_post'