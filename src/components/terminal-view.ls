{polymer_ext} = require 'libs_frontend/polymer_utils'

{
  load_css_file
} = require 'libs_common/content_script_utils'

{cfy} = require 'cfy'

{
  eval_content_script_debug_for_active_tab
} = require 'libs_backend/background_common'

{
  localstorage_setbool
  localstorage_getbool
  localstorage_getjson
} = require 'libs_common/localstorage_utils'

$ = require 'jquery'

polymer_ext {
  is: 'terminal-view'
  properties: {
    terminal_loaded: {
      type: Boolean
      value: false
    }
  }
  focus_terminal: cfy ->*
    self = this
    if not self.terminal_loaded
      [jquery_terminal,_] = yield [
        System.import('jquery.terminal')
        load_css_file('node_modules_custom/jquery.terminal/css/jquery.terminal.min.css')
      ]
      jquery_terminal($)
      self.attach_terminal()
      self.terminal_loaded = true
    setTimeout ->
      document.activeElement.blur()
      $(self.$$('#content_script_terminal')).click()
    , 0
  attach_terminal: ->
    self = this
    thiswidth = $(this).width()
    thisheight = $(this).height()
    css_options = {
      width: thiswidth + 'px'
      height: thisheight + 'px'
    }
    term_div = $(this.$.content_script_terminal)
    term_div.css(css_options)
    messages_livescript = [
      'Content Script Debugger (Livescript)'
      'Switch to Javascript by entering #js'
      'Use hlog() instead of console.log()'
      'Use uselib() to import jspm libraries, type #help for examples'
      'Check the Javascript console for error messages.'
      'You can open it with Command-Option-J or Ctrl-Shift-J'
      'For more tips, type #help'
    ]
    messages_javascript = [
      'Content Script Debugger (Javascript)'
      'Switch to Livescript by entering #ls'
      'Use hlog() instead of console.log()'
      'Use uselib() to import jspm libraries, type #help for examples'
      'Check the Javascript console for error messages'
      'You can open it with Command-Option-J or Ctrl-Shift-J'
      'For more tips, type #help'
    ]
    custom_commands = {
      ls: ->
        localstorage_setbool('debug_terminal_livescript', true)
        term_div.echo messages_livescript.join('\n')
      js: ->
        localStorage.removeItem('debug_terminal_livescript')
        term_div.echo messages_javascript.join('\n')
      help: ->
        messages_help = [
          'The following commands are available:'
          '#ls switches to Livescript mode'
          '#js switches to Javascript mode'
          'Assign variables to this or window to persist them'
          'Example:'
          '    this.x = 3'
          '    console.log(this.x)'
          'Use uselib() to import jspm libraries.'
          'The first argument is the library name (under SystemJS, see jspm)'
          'The second argument is the name it should be given (in the \'this\' object)'
          'Example of using moment:'
          '    uselib(\'moment\', \'moment\')'
          '    this.moment().format()'
          'Example of using jquery:'
          '    uselib(\'jquery\', \'$\')'
          '    this.$(\'body\').css(\'background-color\', \'black\')'
          'Example of using sweetalert2:'
          '    uselib(\'libs_common/content_script_utils\', \'content_script_utils\')'
          '    content_script_utils.load_css_file(\'bower_components/sweetalert2/dist/sweetalert2.css\')'
          '    uselib(\'sweetalert2\', \'swal\')'
          '    swal(\'hello world\')'
          'You can set a custom evaluation function by setting window.customeval'
          'For example, this will allow you to access the variables \'intervention\' and \'tab_id\''
          '    window.customeval = window.localeval'
          'The alias #local does the same as above'
          'Some interventions also define window.debugeval which you can use as follows:'
          '    window.customeval = window.debugeval'
          'The alias #debug does the same as above'
          'You can reset the effects of the above by doing #global'
          'If you override window.customeval, assign variables to \'window\' to persist them'
          'So instead of doing \'var x = 3;\' do \'window.x = 3\''
        ]
        term_div.echo messages_help.join('\n')
    }
    aliases = {
      '#local': '''
        if (window.localeval) {
          window.customeval = window.localeval;
          hlog('set window.customeval to window.localeval')
        } else {
          hlog('window.localeval is not defined');
        }
      '''
      '#debug': '''
        if (window.debugeval) {
          window.customeval = window.debugeval;
          hlog('set window.customeval to window.debugeval')
        } else {
          hlog('window.debugeval is not defined');
        }
      '''
      '#global': '''
        window.customeval = null;
          hlog('reset window.customeval to global eval')
      '''
    }
    custom_commands.javascript = custom_commands.js
    custom_commands.livescript = custom_commands.ls
    terminal_handler = cfy (command, term) ->*
      # TODO: implement a command "livescript" which switches to lsc, and "javascript" which switches to js
      #console.log command
      if command[0] == '#' and custom_commands[command.substr(1)]?
        custom_commands[command.substr(1)]()
        return
      if aliases[command]?
        command = aliases[command]
      else if localstorage_getbool('debug_terminal_livescript')
        livescript = yield System.import('livescript15')
        try
          command = livescript.compile(command, {bare: true, header: false})
        catch err
          term.echo 'Livescript compilation error'
          prettyprintjs = yield System.import('prettyprintjs')
          term.echo prettyprintjs(err)
          return
      result = yield eval_content_script_debug_for_active_tab(command)
      term.echo result
    messages = []
    if not localstorage_getbool('debug_terminal_livescript')
      messages = messages_javascript
    else
      messages = messages_livescript
    term_div.terminal terminal_handler, {
      greetings: messages.join('\n')
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
}
