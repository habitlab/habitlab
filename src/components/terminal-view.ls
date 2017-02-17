{polymer_ext} = require 'libs_frontend/polymer_utils'

{
  load_css_file
} = require 'libs_common/content_script_utils'

{cfy} = require 'cfy'

{
  eval_content_script_debug_for_tabid
  eval_content_script_for_tabid
  get_active_tab_id
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
    tabid: {
      type: Number
    }
    autoload: {
      type: Boolean
      value: false
      observer: 'autoload_changed'
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
  }
  isdemo_changed: ->
    if this.isdemo
      this.autoload = true
  autoload_changed: ->
    if this.autoload
      this.focus_terminal()
  focus_terminal: cfy ->*
    self = this
    if not self.terminal_loaded
      [jquery_terminal,_] = yield [
        SystemJS.import('jquery.terminal')
        load_css_file('node_modules_custom/jquery.terminal/css/jquery.terminal.min.css')
      ]
      jquery_terminal($)
      self.attach_terminal()
      self.terminal_loaded = true
    setTimeout ->
      document.activeElement.blur()
      $(self.$$('#content_script_terminal')).click()
    , 0
  run_eval_debug: cfy (code) ->*
    tabid = this.tabid
    if not tabid?
      tabid = yield get_active_tab_id()
    yield eval_content_script_debug_for_tabid(tabid, code)
  run_eval: cfy (code) ->*
    tabid = this.tabid
    if not tabid?
      tabid = yield get_active_tab_id()
    yield eval_content_script_for_tabid(tabid, code)
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
      makedefault: ->
        localstorage_setbool('debug_terminal_is_default', true)
        term_div.echo 'Debug Terminal is now the default tab in popup-view'
      resetdefault: ->
        localstorage_setbool('debug_terminal_is_default', false)
        term_div.echo 'Debug Terminal is no longer the default tab in popup-view'
      help: ->
        messages_help = [
          'The following commands are available:'
          '#ls switches to Livescript mode'
          '#js switches to Javascript mode'
          '#global alias for window.customeval = window.eval'
          '#local alias for window.customeval = window.localeval'
          '#debug alias for window.customeval = window.debugeval'
          '#makedefault makes this terminal the default tab in popup-view'
          '#resetdefault resets the default tab in popup-view'
          ''
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
          ''
          'You can set a custom evaluation function by setting window.customeval'
          'For example, this will allow you to access the variables \'intervention\' and \'tab_id\''
          '    window.customeval = window.localeval'
          'The alias #local does the same as above'
          'Some interventions also define window.debugeval which you can use as follows:'
          '    window.customeval = window.debugeval'
          'The alias #debug does the same as above'
          'You can reset the effects of #local or #debug with #global'
          ''
          'If using #local or #debug, assign variables to \'window\' to persist them'
          'So instead of doing \'var x = 3;\' do \'window.x = 3;\''
        ]
        term_div.echo messages_help.join('\n')
    }
    aliases = {
      local: '''
        if (window.localeval) {
          window.customeval = window.localeval;
          hlog([
            '#local has set window.customeval to window.localeval',
            'In #local mode, assign variables to \\'window\\' to persist them',
            'So instead of doing \\'var x = 3;\\' do \\'window.x = 3;\\'',
            'Return to default global eval mode by typing #global'
          ].join('\\n'));
        } else {
          hlog('window.localeval is not defined');
        }
      '''
      debug: '''
        if (window.debugeval) {
          window.customeval = window.debugeval;
          hlog([
            '#debug has set window.customeval to window.debugeval',
            'In #debug mode, assign variables to \\'window\\' to persist them',
            'So instead of doing \\'var x = 3;\\' do \\'window.x = 3;\\'',
            'Return to default global eval mode by typing #global'
          ].join('\\n'));
        } else {
          hlog('window.debugeval is not defined');
        }
      '''
      global: '''
        window.customeval = window.eval;
        hlog('#global has reset window.customeval to global eval');
      '''
    }
    custom_commands.javascript = custom_commands.js
    custom_commands.livescript = custom_commands.ls
    terminal_handler = cfy (command, term) ->*
      is_livescript = localstorage_getbool('debug_terminal_livescript')
      if command[0] == '#'
        after_hash = command.substr(1)
        if custom_commands[after_hash]?
          custom_commands[after_hash]()
          return
        if aliases[after_hash]?
          command = aliases[after_hash]
          is_livescript = false
      if is_livescript
        livescript = yield SystemJS.import('livescript15')
        try
          command = livescript.compile(command, {bare: true, header: false})
        catch err
          term.echo 'Livescript compilation error'
          prettyprintjs = yield SystemJS.import('prettyprintjs')
          term.echo prettyprintjs(err)
          return
      command = command.trim()
      for statement in ['var ', 'let ', 'const ']
        command_lines = command.split('\n')
        if command_lines?0?startsWith(statement)
          if command_lines?0?indexOf('=') == -1
            command_lines.shift()
          else
            command_lines[0] = command_lines[0].substr(statement.length).trim()
        command = command_lines.join('\n').trim()
      contains_yield = (code) ->
        result = code.startsWith('yield ') or code.startsWith('yield(') or code.includes(' yield ') or code.includes('(yield ') or code.includes(' yield(') or code.includes('(yield(')
        return result
      if contains_yield command
        command = """
        SystemJS.import('co').then(function(co) {
          co(function*() {
            return #{command}
          }).then(window.hlog);
        })
        """
      result = yield self.run_eval_debug(command)
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
    self.run_eval('''
      if (window.debugeval && !window.customeval && window.customeval != window.debugeval) {
        window.customeval = window.debugeval;
        hlog([
          '#debug has set window.customeval to window.debugeval',
          'In #debug mode, assign variables to \\'window\\' to persist them',
          'So instead of doing \\'var x = 3;\\' do \\'window.x = 3;\\'',
          'Return to default global eval mode by typing #global'
        ].join('\\n'));
      }
    ''')
}
