$ = require 'jquery'
window.jQuery = $
require 'jquery.terminal'
LiveScript = require('livescript15')

{
  load_css_file
} = require 'libs_frontend/content_script_utils'

export listen_for_eval = (eval_func) ->
  if window.eval_content_script_listener_loaded
    return
  window.eval_content_script_listener_loaded = true

  chrome.runtime.onMessage.addListener (message, sender, sendResponse) ->
    {type, data} = message
    if type != 'eval_content_script'
      return
    result = eval_func data
    console.log result
    sendResponse result
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

ls2js = (livescript_code) ->
  LiveScript.compile livescript_code, {bare: true, header: false}

export insert_console = (eval_func, options) ->
  options = {} <<< options
  <- load_css_file 'bower_components/jquery.terminal/css/jquer
  y.terminal.min.css'
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
  | 'livescript' => 'livescript'
  | 'ls' => 'livescript'
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
  terminal_handlers.livescript = (command, term) ->
    console.log command
    console.log LiveScript
    js_command = ls2js command
    console.log js_command
    result = eval_func js_command
    console.log result
    term.echo result
  term_div.terminal terminal_handlers[lang], {
    greetings: "content script debugger (#{lang})"
    width: css_options.width
    height: css_options.height
    #completion: true
  }
