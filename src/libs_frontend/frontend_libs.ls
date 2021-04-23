{
  gexport
  gexport_module
} = require 'libs_common/gexport'

/**
 * Gets an object containing the URL parameters. Ie, for a URL http://www.example.com/path?foo=bar&baz=qux will output {'foo': 'bar', 'baz': 'qux'}
 * @return {Object} An object with parameter names as keys, and parameter values as values
 */
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

export sleep = (time) ->>
  return new Promise ->
    setTimeout(it, time)

/**
* Return an element once it's available (check every 0.1 seconds)
* @param {String} selector of the element
* @param {function} callback
* @return {HTMLElement}
*/
export once_available = (selector, callback) ->>
  current_result = document.querySelector(selector)
  while not current_result?
    current_result = document.querySelector(selector)
    await sleep(100)
  if callback?
    callback(current_result)
  return current_result

/**
* Return an element once it's available (check every 0.03 seconds)
* @param {String} selector of the element
* @param {function} callback
* @return {HTMLElement}
*/
export once_available_fast = (selector, callback) ->>
  current_result = document.querySelector(selector)
  while not current_result?
    current_result = document.querySelector(selector)
    await sleep(30)
  if callback?
    callback(current_result)
  return current_result

/**
* Return multiple elements once they are available (check every 0.1 seconds)
* @param {String} selector of the elements
* @param {function} callback
* @return {NodeList} the list of elements selected
*/
export once_available_multiselect = (selector, callback) ->>
  current_result = document.querySelectorAll(selector)
  while not (current_result.length > 0)
    current_result = document.querySelectorAll(selector)
    await sleep(100)
  if callback?
    callback(current_result)
  return current_result

/**
* Return once body is available (check every 0.03 seconds)
* @param {function} callback
*/
export once_body_available = (callback) ->>
  while not document.body?
    await sleep(30)
  if callback?
    callback()
  return

#export add_toolbar_notification = ->
#  chrome.browserAction.setBadgeText {text: '1'}
#  chrome.browserAction.setBadgeBackgroundColor {color: '#3498DB'}

/**
* Execute a particular function when curren url changes
* @param {function} func - function to get executed
*/
export on_url_change = (func) ->
  prev_url = window.location.href
  chrome.runtime.onMessage.addListener (msg, sender, sendResponse) ->
    {type, data} = msg
    if type == 'navigation_occurred'
      if data.url != prev_url
        prev_url := data.url
        func()

/**
* Execute a particular function when curren url changes
* @param {function} func - function to get executed
*/
export on_url_change_not_from_history = (func) ->
  prev_url = window.location.href
  chrome.runtime.onMessage.addListener (msg, sender, sendResponse) ->
    {type, data} = msg
    if type == 'navigation_occurred'
      if data.is_from_history
        return
      if data.url != prev_url
        console.log 'data.url is: ' + data.url
        console.log 'prev_url in loc 2 is: ' + prev_url
        prev_url := data.url
        func()

to_camelcase_string = (myString) ->
  myString.replace(/-([a-z])/g, ((g) -> g[1].toUpperCase()))

to_camelcase_dict = (options) ->
  output = {}
  for k,v of options
    output[to_camelcase_string(k)] = v
  return output

/**
* Creates a div in the shadow dom to protect the div styling from outside CSS
* @param options - css styling which should be applied to shadow div
* @return the created shadow div
*/
export create_shadow_div = (options) ->
  if not options?
    options = {}
  if options.shadow_div?
    shadow_div = options.shadow_div
    delete options.shadow_div
  else
    shadow_div = document.createElement('div')
  options = to_camelcase_dict(options)
  default_options = {
    fontFamily: 'Verdana, Geneva, Tahoma, "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif'
    position: 'static'
    zIndex: 2147483646
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
  shadow_root = shadow_host.attachShadow({mode: 'open'})
  #shadow_root = shadow_host.createShadowRoot()
  for k,v of options
    shadow_div.style[k] = v
  shadow_root.appendChild(shadow_div)
  shadow_div.shadow_root = shadow_root
  shadow_div.shadow_host = shadow_host
  shadow_host.shadow_root = shadow_root
  shadow_host.shadow_div = shadow_div
  return shadow_div

/**
 * Wraps the provided element in a div under the Shadow DOM
 * @param {HTMLElement} elem - The element to add to the Shadow DOM
 * @param {Object} [options] - Options for the creation of the Shadow DOM wrapper element
 * @return {HTMLElement} The created div in the shadow dom
 */
export wrap_in_shadow = (elem, options) ->
  if elem.length? and elem.length > 0
    elem = elem[0]
  options = {} <<< options
  options.shadow_div = elem
  create_shadow_div(options) # return value is equal to elem
  return elem.shadow_host

/**
* Creates a div in the shadow dom to protect the div styling from outside CSS
* @param {Object} [options] - Options(CSS styling) for the creation of the Shadow DOM wrapper element
* @return the created shadow div
*/
export create_shadow_div_on_body = (options) ->
  if not options?
    options = {}
  options.position = options.position ? 'fixed'
  shadow_div = create_shadow_div(options)
  document.body.appendChild(shadow_div.shadow_host)
  return shadow_div

/**
 * Wraps the provided element in a div under the Shadow DOM and appends it to the body of the document
 * @param {HTMLElement} elem - The element to add to the Shadow DOM
 * @param {Object} [options] - Options for the creation of the Shadow DOM wrapper element
 * @return {HTMLElement} The created div in the shadow dom
 */
export append_to_body_shadow = (elem, options) ->
  if not options?
    options = {}
  options.position = options.position ? 'fixed'
  shadow_div = create_shadow_div_on_body(options)
  if elem.length? and elem.length > 0
    elem = elem[0]
  shadow_div.appendChild(elem)
  return shadow_div

# export make_checkbox_clickable = (checkbox) ->
#   if not checkbox?
#     return
#   if not checkbox.shadowRoot?
#     return
#   label = checkbox.shadowRoot.querySelector('#checkboxLabel')
#   label.style.pointerEvents = 'none'
#   container = checkbox.shadowRoot.querySelector('#checkboxContainer')
#   container.style.pointerEvents = 'none'
#   return

# export make_togglebutton_clickable = (checkbox) ->
#   if not checkbox?
#     return
#   if not checkbox.shadowRoot?
#     return
#   container = checkbox.shadowRoot.querySelector('.toggle-container')
#   container.style.pointerEvents = 'none'
#   return

gexport_module 'frontend_libs', -> eval(it)
