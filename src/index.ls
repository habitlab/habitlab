{
  getUrlParameters
} = require 'libs_frontend/common_libs'

use_polyfill = getUrlParameters().polyfill
if use_polyfill and use_polyfill != 'false' and parseInt(use_polyfill) != 0
  # force the usage of polyfills
  document.registerElement = null

#require 'webcomponents.js/webcomponents-lite'
require 'webcomponentsjs-custom-element-v0'
#require 'webcomponents.js/webcomponents'

# this script must run before Polymer is imported
window.Polymer = {
  dom: 'shady',
  #dom: 'shadow',
  lazyRegister: true,
}


require! {
  'js-yaml'
}

require 'components/components.deps'
require 'components_skate/components_skate'

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
    if k.startsWith('customStyle.')
      tag.customStyle[k.replace('customStyle.', '')] = v
      # tag.updateStyles() or Polymer.updateStyles() doesn't seem to be necessary
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
