window.addEventListener "unhandledrejection", (evt) ->
  throw new Error(evt.reason)

require! {
  co
}

co ->*
  localStorage.removeItem 'cached_list_all_goals'
  localStorage.removeItem 'cached_list_all_interventions'
  localStorage.removeItem 'cached_list_generic_interventions'
  localStorage.removeItem 'cached_get_goals'
  localStorage.removeItem 'cached_get_interventions'

  window.global_exports = {}

  dlog = window.dlog = (...args) ->
    if localStorage.getItem('display_dlog') == 'true'
      console.log(...args)

  require! {
    localforage
  }

  manifest = chrome.runtime.getManifest()
  if manifest.update_url? or localStorage.getItem('devmode_use_cache') == 'true'
    need_to_clear_cache = localStorage.getItem('devmode_clear_cache_on_reload') == 'true'
    if need_to_clear_cache or manifest.update_url?  # installed from chrome web store
      store = localforage.createInstance({
        name: 'localget'
      })
      if not need_to_clear_cache
        if manifest.update_url?
          version_cached = yield store.getItem('habitlab_version')
          if version_cached != manifest.version
            need_to_clear_cache = true
      if need_to_clear_cache
        yield store.clear()
        yield store.setItem('habitlab_version', manifest.version)

  require 'libs_backend/systemjs'

  {
    get_all_message_handlers
  } = require 'libs_backend/expose_lib'

  require 'libs_backend/expose_backend_libs'

  {localget} = require 'libs_common/cacheget_utils'

  {
    addtokey_dictdict
    start_syncing_all_db_collections
    getkey_dictdict
  } = require 'libs_backend/db_utils'

  {
    send_message_to_active_tab
    send_message_to_tabid
    get_active_tab_info
  } = require 'libs_backend/background_common'

  {
    get_interventions
    list_enabled_nonconflicting_interventions_for_location
    list_all_enabled_interventions_for_location
    list_available_interventions_for_location
    get_intervention_parameters
    is_it_outside_work_hours
  } = require 'libs_backend/intervention_utils'

  {
    get_goals
    get_enabled_goals
    get_goal_target
  } = require 'libs_backend/goal_utils'

  {
    make_wait_token
    wait_for_token
    finished_waiting
  } = require 'libs_common/wait_utils'

  {
    get_days_since_epoch
  } = require 'libs_common/time_utils'

  {
    get_new_session_id_for_domain
  } = require 'libs_common/time_spent_utils'

  {
    url_to_domain
  } = require 'libs_common/domain_utils'

  {
    add_tab_navigation_event
  } = require 'libs_backend/session_utils'

  {
    as_array
    as_dictset
  } = require 'libs_common/collection_utils'

  {
    localstorage_getjson
    localstorage_setjson
  } = require 'libs_common/localstorage_utils'

  require! {
    moment
    'promise-debounce'
  }

  $ = require 'jquery'

  {
    gexport
    gexport_module
  } = require 'libs_common/gexport'

  {
    set_active_interventions_for_domain_and_session
  } = require 'libs_backend/intervention_manager'

  {
    get_progress_on_enabled_goals_today
    get_progress_on_goal_this_week
  } = require 'libs_backend/goal_progress'

  {
    start_syncing_all_logs
  } = require 'libs_backend/log_utils'

  {
    is_habitlab_enabled_sync
  } = require 'libs_backend/disable_habitlab_utils'

  {
    ensure_history_utils_data_cached
  } = require 'libs_common/history_utils'

  {cfy, yfy} = require 'cfy'

  # require 'libs_common/measurement_utils'

  # dlog 'weblab running in background'
  # alert('hello');

  /*
  execute_content_script = (tabid, options, callback) ->
    #chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    if not tabid?
      if callback?
        callback()
      return
    chrome.tabs.executeScript tabid, {file: options.path, allFrames: options.all_frames, runAt: options.run_at}, ->
      if callback?
        callback()
  */

  insert_css = cfy (css_path) ->*
    # todo does not do anything currently
    return

  running_background_scripts = {}

  load_background_script = cfy (options, intervention_info) ->*
    if running_background_scripts[options.path]?
      # already running
      return
    if options.code?
      background_script_text = options.code
    else
      background_script_text = yield localget(options.path)
    background_script_function = new Function('env', background_script_text)
    env = {
      intervention_info: intervention_info
    }
    background_script_function(env)
    running_background_scripts[options.path] = env
    return

  cached_systemjs_code = null

  execute_content_scripts_for_intervention = cfy (intervention_info, tabId, intervention_list) ->*
    {content_script_options, name} = intervention_info

    intervention_info_copy = JSON.parse JSON.stringify intervention_info
    parameter_values = yield get_intervention_parameters(intervention_info.name)
    for i in [0 til intervention_info_copy.parameters.length]
      parameter = intervention_info_copy.parameters[i]
      parameter.value = parameter_values[parameter.name]
      intervention_info_copy.params[parameter.name].value = parameter_values[parameter.name]

    if cached_systemjs_code != null
      systemjs_content_script_code = cached_systemjs_code
    else
      systemjs_content_script_code = yield localget('/intervention_utils/systemjs.js')
      cached_systemjs_code := systemjs_content_script_code

    debug_content_script_code = """
    content_script_debug.listen_for_eval(function(command_to_evaluate) {
      if (window.customeval) {
        return window.customeval(command_to_evaluate);
      } else {
        return eval.bind(this)(command_to_evaluate);
      }
    });
    """
    if intervention_info_copy.params.debug? and intervention_info_copy.params.debug.value
      debug_content_script_code = """
      content_script_debug.listen_for_eval((x) => { return eval(x); });
      content_script_debug.insert_console((x) => { return eval(x); }, {lang: 'livescript'});
      """
    debug_content_script_code_with_hlog = """
    SystemJS.import_multi(['prettyprintjs', 'libs_frontend/content_script_debug'], function(prettyprintjs, content_script_debug) {
      var console_log_orig = window.console.log;
      var hlog = function(...args) {
        console_log_orig(...args);
        var data_string;
        var err_to_throw = null;
        try {
          if (args.length == 1) {
            data_string = prettyprintjs(args[0]);
          } else {
            data_string = prettyprintjs(args);
          }
        } catch (err) {
          data_string = 'Error was thrown. Check Javascript console (Command+Option+J or Ctrl+Shift+J)\\n' + err.message;
          err_to_throw = err;
        }
        chrome.runtime.sendMessage({type: 'send_to_debug_terminal', data: data_string});
        if (err_to_throw) {
          throw err_to_throw;
        }
      }
      var uselib = function(libname, callback) {
        if (typeof(callback) == 'function') {
          SystemJS.import(libname).then(callback);
        } else if (typeof(callback) == 'string') {
          SystemJS.import(libname).then(function(imported_lib) {
            window[callback] = imported_lib;
            hlog('imported as window.' + callback);
          }, function(err) {
            console.log(err.message);
            throw err;
          });
        } else if (typeof(libname) == 'string') {
          callback = libname.toLowerCase().split('').filter((x) => 'abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(x) != -1).join('');
          SystemJS.import(libname).then(function(imported_lib) {
            window[callback] = imported_lib;
            hlog('imported as window.' + callback);
          }, function(err) {
            console.log(err.message);
            throw err;
          });
        } else {
          hlog([
            'Use uselib() to import jspm libraries.',
            'The first argument is the library name (under SystemJS, see jspm)',
            'The second argument is the name it should be given (in the \\'this\\' object)',
            'Example of using moment:',
            '    uselib(\\'moment\\', \\'moment\\')',
            '    window.moment().format()',
            'Example of using jquery:',
            '    uselib(\\'jquery\\', \\'$\\')',
            '    window.$(\\'body\\').css(\\'background-color\\', \\'black\\')',
            'Example of using sweetalert2:',
            '    uselib(\\'libs_common/content_script_utils\\', \\'content_script_utils\\')',
            '    content_script_utils.load_css_file(\\'bower_components/sweetalert2/dist/sweetalert2.css\\')',
            '    uselib(\\'sweetalert2\\', \\'swal\\')',
            '    swal(\\'hello world\\')'
          ].join('\\n'))
        }
      }
      window.hlog = hlog;
      window.uselib = uselib;
      window.localeval = function(command_to_evaluate) {
        return eval(command_to_evaluate);
      }
      #{debug_content_script_code}
      return;
    })
    """
    for options in content_script_options
      if options.code?
        content_script_code = options.code
      else
        content_script_code = yield localget(options.path)
      if options.jspm_require
        content_script_code = """
        window.Polymer = window.Polymer || {}
        window.Polymer.dom = 'shadow'
        SystemJS.import('libs_common/intervention_info').then(function(intervention_info_setter_lib) {
          intervention_info_setter_lib.set_intervention(#{JSON.stringify(intervention_info_copy)});
          SystemJS.import('data:text/javascript;base64,#{btoa(content_script_code)}');
        })
        """
        /*
        SystemJS.import('libs_common/intervention_info').then(function(intervention_info_setter_lib) {
          intervention_info_setter_lib.set_intervention(#{JSON.stringify(intervention_info_copy)})
          #{content_script_code}
        })
        */
        /*
        SystemJS.import('libs_common/intervention_info').then(function(intervention_info_setter_lib) {
          intervention_info_setter_lib.set_intervention(#{JSON.stringify(intervention_info_copy)});
          SystemJS.import('data:text/javascript;base64,#{btoa(content_script_code)}');
        })
        */
        /*
        SystemJS.import('libs_common/intervention_info').then(function(intervention_info_setter_lib) {
          intervention_info_setter_lib.set_intervention(#{JSON.stringify(intervention_info_copy)})
          SystemJS.import('libs_common/systemjs_require').then(function(systemjs_require) {
            systemjs_require.make_require(#{JSON.stringify(options.jspm_deps)}).then(function(require) {
              #{content_script_code}
            })
          })
        })
        */
        /*
        content_script_code = """
        SystemJS.import('co').then(function(co) {
          co(function*() {
            var intervention_info_setter_lib = yield SystemJS.import('libs_common/intervention_info')
            intervention_info_setter_lib.set_intervention(#{JSON.stringify(intervention_info_copy)})
            var systemjs_require = yield SystemJS.import('libs_common/systemjs_require')
            const require = yield systemjs_require.make_require(#{JSON.stringify(options.jspm_deps)})
            #{content_script_code}
          })
        })
        """
        */
      content_script_code = """
  if (!window.allowed_interventions) {
    window.allowed_interventions = #{JSON.stringify(as_dictset(intervention_list))};

    window.onunhandledrejection = function(evt) {
      throw evt.reason;
    };

    window.loaded_interventions = {};
    window.loaded_content_scripts = {};
  }

  if (window.allowed_interventions['#{intervention_info_copy.name}'] && !window.loaded_interventions['#{intervention_info_copy.name}']) {
    window.loaded_interventions['#{intervention_info_copy.name}'] = true;

    if (!window.loaded_content_scripts['#{options.path}']) {
      window.loaded_content_scripts['#{options.path}'] = true;
      const intervention = #{JSON.stringify(intervention_info_copy)};
      const tab_id = #{tabId};
      const dlog = function(...args) { console.log(...args); };

      if (!window.SystemJS) {
        #{systemjs_content_script_code}
      }
      #{content_script_code}
      #{debug_content_script_code_with_hlog}
    }
  }
      """
      yield yfy(chrome.tabs.executeScript) tabId, {code: content_script_code, allFrames: options.all_frames, runAt: options.run_at}
    return

  load_intervention_list = cfy (intervention_list, tabId) ->*
    all_interventions = yield get_interventions()
    intervention_info_list = [all_interventions[intervention_name] for intervention_name in intervention_list]

    # load background scripts
    for intervention_info in intervention_info_list
      for options in intervention_info.background_script_options
        yield load_background_script options, intervention_info

    # load css files
    for intervention_info in intervention_info_list
      if intervention_info.css_files?
        for css_file in intervention_info.css_files
          yield -> chrome.tabs.insertCSS {file: css_file}, it
      if intervention_info.styles?
        for css_code in intervention_info.styles
          yield -> chrome.tabs.insertCSS {code: css_code}, it

    # load content scripts
    for intervention_info in intervention_info_list
      yield execute_content_scripts_for_intervention intervention_info, tabId, intervention_list
    return

  load_intervention = cfy (intervention_name, tabId) ->*
    all_interventions = yield get_interventions()
    intervention_info = all_interventions[intervention_name]

    # load background scripts
    for options in intervention_info.background_script_options
      yield load_background_script options, intervention_info

    # load css files
    if intervention_info.css_files?
      for css_file in intervention_info.css_files
        yield -> chrome.tabs.insertCSS {file: css_file}, it
    if intervention_info.styles?
      for css_code in intervention_info.styles
        yield -> chrome.tabs.insertCSS {code: css_code}, it

    # load content scripts
    yield execute_content_scripts_for_intervention intervention_info, tabId, [intervention_name]
    return

  list_loaded_interventions = cfy ->*
    yield send_message_to_active_tab 'list_loaded_interventions', {}

  get_session_id_for_tab_id_and_domain = cfy (tabId, domain) ->*
    if not tab_id_to_domain_to_session_id[tabId]?
      tab_id_to_domain_to_session_id[tabId] = {}
    session_id = tab_id_to_domain_to_session_id[tabId][domain]
    if session_id?
      return session_id
    session_id = yield get_new_session_id_for_domain(domain)
    tab_id_to_domain_to_session_id[tabId][domain] = session_id
    return session_id

  tab_id_to_loaded_interventions = {}

  load_intervention_for_location = promise-debounce cfy (location, tabId) ->*
    if is_it_outside_work_hours()
      return
    if !is_habitlab_enabled_sync()
      return

    domain = url_to_domain(location)
    session_id = yield get_session_id_for_tab_id_and_domain(tabId, domain)
    active_interventions = yield getkey_dictdict 'interventions_active_for_domain_and_session', domain, session_id
    dlog 'active_interventions is'
    dlog active_interventions
    override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
    dlog 'override_enabled_interventions is'
    dlog override_enabled_interventions
    if not active_interventions?
      if override_enabled_interventions?
        possible_interventions = as_array(JSON.parse(override_enabled_interventions))
      else
        possible_interventions = yield list_enabled_nonconflicting_interventions_for_location(location)
      intervention = possible_interventions[0]
      if intervention?
        yield set_active_interventions_for_domain_and_session domain, session_id, [intervention]
      else
        yield set_active_interventions_for_domain_and_session domain, session_id, []
      localStorage.removeItem('override_enabled_interventions_once')
    else
      active_interventions = JSON.parse active_interventions
      intervention = active_interventions[0]
      if intervention?
        all_enabled_interventions = yield list_all_enabled_interventions_for_location(location)
        if all_enabled_interventions.length > 0 and all_enabled_interventions.indexOf(intervention) == -1
          # the intervention is no longer enabled. need to choose a new session id
          dlog 'intervention is no longer enabled. choosing new session id'
          dlog 'tabid is ' + tabId
          dlog 'domain is ' + domain
          dlog 'old session_id is ' + session_id
          dlog 'active_interventions'
          dlog active_interventions
          dlog 'all_enabled_interventions'
          dlog all_enabled_interventions
          session_id = yield get_new_session_id_for_domain(domain)
          tab_id_to_domain_to_session_id[tabId][domain] = session_id
          if override_enabled_interventions?
            possible_interventions = as_array(JSON.parse(override_enabled_interventions))
          else
            possible_interventions = yield list_enabled_nonconflicting_interventions_for_location(location)
          intervention = possible_interventions[0]
          #domain_to_session_id_to_intervention[domain][session_id] = intervention
          if intervention?
            yield set_active_interventions_for_domain_and_session domain, session_id, [intervention]
          else
            yield set_active_interventions_for_domain_and_session domain, session_id, []
          localStorage.removeItem('override_enabled_interventions_once')
    interventions_to_load = []
    if intervention?
      interventions_to_load.push intervention
    #if not intervention?
    #  return
    #yield load_intervention intervention, tabId
    if not override_enabled_interventions?
      permanently_enabled_interventions = localStorage.getItem('permanently_enabled_interventions')
      if permanently_enabled_interventions?
        permanently_enabled_interventions = as_array(JSON.parse(permanently_enabled_interventions))
        all_available_interventions = yield list_available_interventions_for_location(location)
        all_available_interventions = as_dictset(all_available_interventions)
        permanently_enabled_interventions = permanently_enabled_interventions.filter (x) -> all_available_interventions[x]
        for permanently_enabled_intervention in permanently_enabled_interventions
          if permanently_enabled_intervention != intervention
            interventions_to_load.push permanently_enabled_intervention
            #yield load_intervention permanently_enabled_intervention, tabId
    tab_id_to_loaded_interventions[tabId] = interventions_to_load
    yield load_intervention_list interventions_to_load, tabId
    return

  /*
  load_intervention_for_location = cfy (location, tabId) ->*
    {work_hours_only ? 'false', start_mins_since_midnight ? '0', end_mins_since_midnight ? '1440'} = localStorage
    work_hours_only = work_hours_only == 'true'
    start_mins_since_midnight = parseInt start_mins_since_midnight
    end_mins_since_midnight = parseInt end_mins_since_midnight
    mins_since_midnight = moment().hours()*60 + moment().minutes()
    if work_hours_only and not (start_mins_since_midnight <= mins_since_midnight <= end_mins_since_midnight)
      return
    possible_interventions = yield list_enabled_nonconflicting_interventions_for_location(location)
    for intervention in possible_interventions
      yield load_intervention intervention, tabId
    localStorage.removeItem('override_enabled_interventions_once')
    return
  */

  getLocation = cfy ->*
    #send_message_to_active_tab 'getLocation', {}, callback
    tabinfo = yield get_active_tab_info()
    return tabinfo.url

  split_list_by_length = (list, len) ->
    output = []
    curlist = []
    for x in list
      curlist.push x
      if curlist.length == len
        output.push curlist
        curlist = []
    if curlist.length > 0
      output.push curlist
    return output

  css_packages = require('libs_common/css_packages')

  message_handlers = get_all_message_handlers()

  message_handlers <<< {
    'getLocation': (data, callback) ->
      getLocation (location) ->
        dlog 'getLocation background page:'
        dlog location
        callback location
    'load_intervention': (data, callback) ->
      {intervention_name, tabId} = data
      load_intervention intervention_name, tabId, ->
        callback()
    'load_intervention_for_location': cfy (data) ->*
      {location, tabId} = data
      yield load_intervention_for_location location, tabId
      return
    'load_css_file': (data, callback) ->
      {css_file, tab} = data
      tabid = tab.id
      if css_packages[css_file]?
        css_file = css_packages[css_file]
      chrome.tabs.insertCSS tabid, {file: css_file}, ->
        callback()
    'load_css_code': (data, callback) ->
      {css_code, tab} = data
      tabid = tab.id
      chrome.tabs.insertCSS tabid, {code: css_code}, ->
        callback()
    'send_to_debug_terminal': (data, callback) ->
      existing_messages = localstorage_getjson('debug_terminal_messages')
      if not existing_messages?
        existing_messages = []
      existing_messages.push data
      localstorage_setjson('debug_terminal_messages', existing_messages)
      callback()
  }

  #tabid_to_current_location = {}

  #which_interventions_are_loaded = (tabId, callback) ->

  prev_domain = ''

  domain_changed = (new_domain) ->
    prev_domain := new_domain
    current_day = get_days_since_epoch()
    addtokey_dictdict 'visits_to_domain_per_day', new_domain, current_day, 1, (total_visits) ->
      dlog "total visits to #{new_domain} today is #{total_visits}"

  # our definition of a session:
  # how long a tab was open and on Facebook (or other site of interest) until it was closed
  # some pitfalls. if user navigates to FB, then goes to say buzzfeed, then goes back (on that same tab) the sessions are merged
  tab_id_to_domain_to_session_id = {}
  # domain_to_session_id_to_intervention = {}

  export list_domain_to_session_ids = ->
    for tab_id,domain_to_session_id of tab_id_to_domain_to_session_id
      dlog domain_to_session_id

  navigation_occurred = (url, tabId) ->
    new_domain = url_to_domain(url)
    if new_domain != prev_domain
      domain_changed(new_domain)
    #if tabid_to_current_location[tabId] == url
    #  return
    #tabid_to_current_location[tabId] = url
    #possible_interventions <- list_available_interventions_for_location(url)
    #if possible_interventions.length > 0
    #  chrome.pageAction.show(tabId)
    #else
    #  chrome.pageAction.hide(tabId)
    #send_pageupdate_to_tab(tabId)
    dlog "navigation_occurred to #{url}"
    load_intervention_for_location url, tabId

  chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
    if tab.url
      #dlog 'tabs updated!'
      #dlog tab.url
      #if changeInfo.status != 'complete'
      #  return
      #if changeInfo.status == 'complete'
      #  send_message_to_tabid tabId, 'navigation_occurred', {
      #    url: tab.url
      #    tabId: tabId
      #  }
      if changeInfo.status == 'loading'
        add_tab_navigation_event tabId, tab.url

      send_message_to_tabid tabId, 'navigation_occurred', {
        url: tab.url
        tabId: tabId
      }
      navigation_occurred tab.url, tabId

      loaded_interventions = tab_id_to_loaded_interventions[tabId]
      if is_habitlab_enabled_sync()
        if loaded_interventions? and loaded_interventions.length > 0
          chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon_active.svg')}
        else
          chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon.svg')}
      else
        chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon_disabled.svg')}

  chrome.webNavigation.onHistoryStateUpdated.addListener (info) ->
    send_message_to_tabid info.tabId, 'navigation_occurred', {
      url: info.url
      tabId: info.tabId
    }
    navigation_occurred info.url, info.tabId

  message_handlers_requiring_tab = {
    'load_css_file': true
    'load_css_code': true
  }

  chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
    {type, data} = request
    #dlog 'onmessage'
    #dlog type
    #dlog data
    #dlog sender
    message_handler = message_handlers[type]
    if not message_handler?
      return
    # tabId = sender.tab.id
    if message_handlers_requiring_tab[type]
      if typeof(data) == 'object' and data != null and sender.tab? and not data.tab?
        data = {} <<< data
        data.tab = sender.tab
    message_handler data, (response) ->
      #dlog 'message handler response:'
      #dlog response
      #response_data = {response}
      #dlog response_data
      # chrome bug - doesn't seem to actually send the response back....
      #sendResponse response_data
      if sendResponse?
        sendResponse response
      # {requestId} = request
      # if requestId? # response requested
      #  chrome.tabs.sendMessage tabId, {event: 'backgroundresponse', requestId, response}
    if sendResponse?
      return true
    else
      return false

  #browser_focus_changed = (new_focused) ->
  #  dlog "browser focus changed: #{new_focused}"

  current_idlestate = 'active'

  # not supported by firefox
  chrome.idle?onStateChanged?addListener? (idlestate) ->
    current_idlestate := idlestate
    dlog "idle state changed: #{idlestate}"

  prev_browser_focused = false
  setInterval ->
    chrome.windows.getCurrent (browser) ->
      focused = browser.focused
      if focused != prev_browser_focused
        prev_browser_focused := focused
        #browser_focus_changed(focused)
  , 500

  /*
  export list_current_tab_ids = ->
    chrome.tabs.query {}, (tabs) ->
      output = {}
      for tab in tabs
        output[tab.url] = tab.id
      dlog output
  */

  setInterval (cfy ->*
    if !prev_browser_focused
      return
    if current_idlestate != 'active'
      return
    active_tab = yield get_active_tab_info()
    if not active_tab?
      return
    if active_tab.url.startsWith('chrome://') or active_tab.url.startsWith('chrome-extension://') # ignore time spent on extension pages
      return
    current_domain = url_to_domain(active_tab.url)
    current_day = get_days_since_epoch()
    # dlog "currently browsing #{url_to_domain(active_tab.url)} on day #{get_days_since_epoch()}"
    session_id = yield get_session_id_for_tab_id_and_domain(active_tab.id, current_domain)
    #dlog "session id #{session_id} current_domain #{current_domain} tab_id #{active_tab.id}"
    yield addtokey_dictdict 'seconds_on_domain_per_session', current_domain, session_id, 1
    yield addtokey_dictdict 'seconds_on_domain_per_day', current_domain, current_day, 1
    #addtokey_dictdict 'seconds_on_domain_per_day', current_domain, current_day, 1, (total_seconds) ->
    #  dlog "total seconds spent on #{current_domain} today is #{total_seconds}"
  ), 1000

  do ->
    # open the options page on first run
    if not localStorage.getItem('notfirstrun')
      localStorage.setItem('notfirstrun', true)
      chrome.tabs.create {url: 'options.html#onboarding'}

  #localStorage.tabsOpened = 0
  #chrome.tabs.onCreated.addListener (x) ->
  #  localStorage.tabsOpened = Number(localStorage.tabsOpened) + 1

  /*
  setInterval (cfy ->*
    if !prev_browser_focused
      return
    if current_idlestate != 'active'
      return
    active_tab = yield get_active_tab_info()
    if not active_tab?
      return
    if active_tab.url.startsWith('chrome://') or active_tab.url.startsWith('chrome-extension://') # ignore time spent on extension pages
      return
    current_domain = url_to_domain(active_tab.url)
    dlog "current domain is #{current_domain}"
    dlog "current tab id is #{active_tab.id}"
    session_id = yield get_session_id_for_tab_id_and_domain(active_tab.id, current_domain)
    dlog "session_id: #{session_id}"
    seconds_spent = yield get_seconds_spent_on_domain_in_session(current_domain, session_id)
    dlog "seconds spent: #{seconds_spent}"
  ), 1000
  */

  #start_syncing_all_logs()
  #start_syncing_all_db_collections()

  gexport_module 'background', -> eval(it)

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
      

  ensure_history_utils_data_cached()

  require 'libs_common/global_exports_post'

  #require('libs_backend/message_after_tab_close')
  require('libs_backend/notification_timer') #lewin notification_timer code
