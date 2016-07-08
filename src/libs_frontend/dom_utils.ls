#if IS_CONTENT_SCRIPT
#  {load_css_code} = require 'libs_frontend/content_script_utils'

if not window.all_imported_custom_styles?
  window.all_imported_custom_styles = []

export import_dom_modules = (element_dom) !->
  element_dom_parsed_list = parseHTML(element_dom)
  for element_dom_parsed in element_dom_parsed_list
    if element_dom_parsed.nodeName.toLowerCase() == 'dom-module'
      recreateDomModule(element_dom_parsed)
    if element_dom_parsed.nodeName.toLowerCase() == 'style'
      recreateStyle(element_dom_parsed)

recreateDomModule = (element_dom_parsed) !->
  DOM_MODULE = document.createElement('dom-module')
  for style_parsed in window.all_imported_custom_styles
    if element_dom_parsed.firstChild
      element_dom_parsed.insertBefore(style_parsed, element_dom_parsed.firstChild)
    else
      element_dom_parsed.appendChild(style_parsed)
  DOM_MODULE.innerHTML = element_dom_parsed.innerHTML
  DOM_MODULE.id = element_dom_parsed.id
  #document.getElementsByTagName("head")[0].appendChild(DOM_MODULE)
  DOM_MODULE.createdCallback?!

recreateStyle = (style_parsed) !->
  if style_parsed.getAttribute('is') == 'custom-style'
    recreateCustomStyle(style_parsed)
  else
    recreateGlobalStyle(style_parsed)

recreateCustomStyle = (style_parsed) !->
  window.all_imported_custom_styles.push(style_parsed)
  return
  /*
  STYLES = document.createElement('style', 'custom-style')
  console.log 'recreateCustomStyle called'
  #STYLES.textContent = style_parsed.textContent
  if STYLES.styleSheet
    STYLES.styleSheet.cssText = style_parsed.textContent
  else
    STYLES.appendChild(document.createTextNode(style_parsed.textContent))
  if IS_CONTENT_SCRIPT
    console.log 'recreateCustomStyle in content script'
    load_css_code style_parsed.textContent, ->
      console.log 'load_css_code done'
  else
    console.log 'recreateCustomStyle outside content script'
    document.documentElement.appendChild(STYLES)
  #document.head.appendChild(STYLES)
  #document.getElementsByTagName("head")[0].appendChild(STYLES)
  */

recreateGlobalStyle = (style_parsed) !->
  return
  /*
  STYLES = document.createElement('style')
  console.log 'recreateGlobalStyle called'
  #STYLES.textContent = style_parsed.textContent
  if STYLES.styleSheet
    STYLES.styleSheet.cssText = style_parsed.textContent
  else
    STYLES.appendChild(document.createTextNode(style_parsed.textContent))
  document.documentElement.appendChild(STYLES)
  #document.head.appendChild(STYLES)
  #document.getElementsByTagName("head")[0].appendChild(STYLES)
  */

parseHTML = (str) ->
  tmp = document.implementation.createHTMLDocument()
  tmp.body.innerHTML = str
  return tmp.body.children
