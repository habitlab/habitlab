$ = require 'jquery'
require('jquery.terminal')($)

require! {
  prettyprintjs
}

{
  load_css_file
} = require 'libs_common/content_script_utils'

export listen_for_eval = (eval_func) ->
  console.log 'listen_for_eval running'
  if window.eval_content_script_listener_loaded
    return
  window.eval_content_script_listener_loaded = true

  chrome.runtime.onMessage.addListener (message, sender, sendResponse) ->
    {type, data} = message
    if type == 'eval_content_script'
      result = window.eval(data)
      sendResponse result
      return true
    if type != 'eval_content_script_debug'
      return
    result = ''
    error_to_throw = null
    try
      result = eval_func data
      console.log result
      result = prettyprintjs(result)
    catch err
      error_to_throw = err
      result = err.message
    sendResponse result
    if error_to_throw?
      throw error_to_throw
    return true

adjust_css_options = (options, new_options) ->
  if not new_options?
    return options
  if new_options.left? and options.right?
    delete options.right
  if new_options.right? and options.left?
    delete options.left
  if new_options.top? and options.bottom?
    delete options.bottom
  if new_options.bottom? and options.top?
    delete options.top
  for k,v of new_options
    options[k] = v
  return options

#ls2js = (livescript_code) ->
#  LiveScript.compile livescript_code, {bare: true, header: false}

export insert_console = (eval_func, options) ->
  options = {} <<< options
  <- load_css_file 'modules_custom/jquery.terminal/css/jquery.terminal.min.css'
  $('body').append($('<div>').attr('id', 'content_script_terminal'))
  term_div = $('#content_script_terminal')
  css_options = {
    position: 'fixed'
    bottom: '0px'
    right: '0px'
    width: '400px'
    height: '200px'
    'z-index': Number.MAX_SAFE_INTEGER
    #'background-color': 'blue'
  }
  lang = switch options.lang
  #| 'livescript' => 'livescript'
  #| 'ls' => 'livescript'
  | 'js' => 'javascript'
  | _ => 'javascript'
  if options.lang?
    delete options.lang
  css_options = adjust_css_options(css_options, options)
  term_div.css css_options
  terminal_handlers = {}
  terminal_handlers.javascript = (command, term) ->
    result = eval_func command
    console.log result
    term.echo result
  /*
  terminal_handlers.livescript = (command, term) ->
    console.log command
    console.log LiveScript
    js_command = ls2js command
    console.log js_command
    result = eval_func js_command
    console.log result
    term.echo result
  */
  term_div.terminal terminal_handlers[lang], {
    greetings: "content script debugger (#{lang})"
    width: css_options.width
    height: css_options.height
    #completion: true
  }
