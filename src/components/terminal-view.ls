{polymer_ext} = require 'libs_frontend/polymer_utils'

{
  load_css_file
} = require 'libs_common/content_script_utils'

{cfy} = require 'cfy'

{
  eval_content_script_for_active_tab
} = require 'libs_backend/background_common'

{
  localstorage_getjson
} = require 'libs_common/localstorage_utils'

$ = require 'jquery'
require('jquery.terminal')($)

polymer_ext {
  is: 'terminal-view'
  properties: {
  }
  ready: cfy ->*
    yield load_css_file('node_modules_custom/jquery.terminal/css/jquery.terminal.min.css')
  focus_terminal: ->
    self = this
    setTimeout ->
      document.activeElement.blur()
      $(self.$$('#content_script_terminal')).click()
    , 0
  attached: ->
    self = this
    thiswidth = $(this).width()
    thisheight = $(this).height()
    css_options = {
      width: thiswidth + 'px'
      height: thisheight + 'px'
    }
    term_div = $(this.$.content_script_terminal)
    term_div.css(css_options)
    terminal_handler = cfy (command, term) ->*
      # TODO: implement a command "livescript" which switches to lsc, and "javascript" which switches to js
      #console.log command
      result = yield eval_content_script_for_active_tab(command)
      term.echo result
    term_div.terminal terminal_handler, {
      greetings: "content script debugger\nsupports new lines as well"
      width: css_options.width
      height: css_options.height
    }
    setInterval ->
      messages = localstorage_getjson('debug_terminal_messages')
      if messages?
        localStorage.removeItem('debug_terminal_messages')
        for message in messages
          term_div.echo message
    , 100
  /*
    chrome.runtime.onMessage.addListener this.listen_for_message
    chrome.runtime.onMessage.addListener (x) ->
      console.log 'got message'
      console.log x
    term_div.echo 'added listener for listen_for_message'
  listen_for_message: (request, sender, sendResponse) ->
    term_div = $(this.$.content_script_terminal)
    term_div.echo 'listen_for_message'
    term_div.echo request
  detached: ->
    chrome.runtime.onMessage.removeListener this.listen_for_message  
  */
}
