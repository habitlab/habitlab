#if IS_CONTENT_SCRIPT
#  {load_css_code} = require 'libs_common/content_script_utils'

if not window.file_local_styles?
  window.file_local_styles = []

if not window.all_imported_custom_styles?
  window.all_imported_custom_styles = []

if not window.all_imported_html_files?
  window.all_imported_html_files = {}

export import_dom_modules = (element_dom, options) !->
  filename = null
  if typeof(options) == 'string'
    filename = options
    options = {filename: options}
  if filename? and window.all_imported_html_files[filename]
    return
  if not options?
    options = {}
  if filename?
    window.all_imported_html_files[filename] = true
  window.file_local_styles = []
  element_dom_parsed_list = parseHTML(element_dom)
  for element_dom_parsed in element_dom_parsed_list
    if not element_dom_parsed?
      continue
    nodename = element_dom_parsed.nodeName.toLowerCase()
    if nodename == 'dom-module'
      recreateDomModule(element_dom_parsed, options)
    else if nodename == 'custom-style' and element_dom_parsed.firstChild?nodeName?toLowerCase?() == 'style'
      'recreate on custom-style being called'
      recreateCustomStyle(element_dom_parsed.firstChild)
    else if nodename == 'style'
      recreateStyle(element_dom_parsed)
    else if nodename == 'iron-iconset-svg'
      recreateIronIconset(element_dom_parsed)

recreateIronIconset = (element_dom_parsed) !->
  elem = document.createElement(element_dom_parsed.nodeName.toLowerCase())
  elem.innerHTML = element_dom_parsed.innerHTML
  for attribute in element_dom_parsed.attributes
    name = attribute.name
    value = attribute.value
    elem.setAttribute name, value
  elem.createdCallback?!
  #document.getElementsByTagName("body")[0].appendChild(elem)

recreateDomModule = (element_dom_parsed, options) !->
  DOM_MODULE = document.createElement('dom-module')
  for style_parsed in window.all_imported_custom_styles.concat(window.file_local_styles)
    if element_dom_parsed.firstChild
      element_dom_parsed.insertBefore(style_parsed, element_dom_parsed.firstChild)
    else
      element_dom_parsed.appendChild(style_parsed)
  DOM_MODULE.innerHTML = element_dom_parsed.innerHTML
  if options.tagname?
    DOM_MODULE.id = options.tagname
  else
    DOM_MODULE.id = element_dom_parsed.id
  #document.getElementsByTagName("head")[0].appendChild(DOM_MODULE)
  DOM_MODULE.createdCallback?!

recreateStyle = (style_parsed) !->
  if style_parsed.getAttribute('is') == 'custom-style'
    recreateCustomStyle(style_parsed)
  else
    #recreateGlobalStyle(style_parsed)
    recreateFileLocalStyle(style_parsed)

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

recreateFileLocalStyle = (style_parsed) !->
  window.file_local_styles.push(style_parsed)
  return

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

export __get__ = (name) ->
  return eval(name)

export __set__ = (name, val) ->
  eval(name + ' = val')
