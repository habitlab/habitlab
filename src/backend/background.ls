window.addEventListener "unhandledrejection", (evt) ->
  throw new Error(evt.reason)

do !->>
  localStorage.removeItem 'cached_list_all_goals'
  localStorage.removeItem 'cached_list_all_interventions'
  localStorage.removeItem 'cached_list_generic_interventions'
  localStorage.removeItem 'cached_list_generic_positive_interventions'
  localStorage.removeItem 'cached_list_video_interventions'
  localStorage.removeItem 'cached_get_goals'
  localStorage.removeItem 'cached_get_interventions'
  localStorage.removeItem 'baseline_session_time_on_domains'
  localStorage.removeItem 'baseline_time_on_domains'

  window.global_exports = {}

  dlog = window.dlog = (...args) ->
    if localStorage.getItem('display_dlog') == 'true'
      console.log(...args)

  {
    addtokey_dictdict
    getkey_dictdict
    getDb
    setvar_experiment
  } = require 'libs_backend/db_utils'

  await getDb()

  require! {
    localforage
  }

  chrome_manifest = chrome.runtime.getManifest()
  habitlab_version = chrome_manifest.version
  developer_mode = not chrome_manifest.update_url?
  unofficial_version = chrome.runtime.id != 'obghclocpdgcekcognpkblghkedcpdgd'

  if (not developer_mode) or localStorage.getItem('devmode_use_cache') == 'true'
    need_to_clear_cache = localStorage.getItem('devmode_clear_cache_on_reload') == 'true'
    if need_to_clear_cache or (not developer_mode) # installed from chrome web store
      store = localforage.createInstance({
        name: 'localget'
      })
      storesystemjs = localforage.createInstance({
        name: 'systemjsget'
      })
      if not need_to_clear_cache
        if (not developer_mode)
          version_cached = await store.getItem('habitlab_version')
          if version_cached != habitlab_version
            need_to_clear_cache = true
      if need_to_clear_cache
        await store.clear()
        await store.setItem('habitlab_version', habitlab_version)
        await storesystemjs.clear()

  require 'libs_backend/systemjs'

  {
    get_goals
    get_goal_info
    get_enabled_goals
    get_goal_target
    get_goal_intervention_info
    set_goals_enabled
    set_default_goals_enabled
    get_random_positive_goal
    site_has_enabled_spend_less_time_goal
  } = require 'libs_backend/goal_utils'

  {
    get_interventions
    list_enabled_nonconflicting_interventions_for_location
    list_all_enabled_interventions_for_location
    list_available_interventions_for_location
    get_intervention_parameters
    is_it_outside_work_hours
    set_default_generic_interventions_enabled
    get_suggested_intervention_if_needed_for_url
  } = require 'libs_backend/intervention_utils'

  {
    send_message_to_active_tab
    send_message_to_tabid
    get_active_tab_info
    get_user_id
    get_install_id
    get_user_secret
    list_currently_loaded_interventions_for_tabid
  } = require 'libs_backend/background_common'

  {
    send_logging_enabled
    get_basic_client_data
    send_feature_disabled
  } = require 'libs_backend/logging_enabled_utils'

  export make_tab_focused = (tab_id, window_id) ->>
    await new Promise -> chrome.windows.update(window_id, {focused: true}, it)
    await new Promise -> chrome.tabs.update(tab_id, {active: true}, it)

  export focus_tab_by_pattern_if_available = (url_pattern) ->>
    all_tab_list = await new Promise -> chrome.tabs.query {url: url_pattern}, it
    if all_tab_list.length == 0
      return false
    candidate_list = all_tab_list.filter (.currentWindow)
    if candidate_list.length > 0
      all_tab_list = candidate_list
    candidate_list = all_tab_list.filter (.active)
    if candidate_list.length > 0
      all_tab_list = candidate_list
    tab_info = all_tab_list[0]
    await make_tab_focused(tab_info.id, tab_info.windowId)
    return true

  num_times_notification_already_shown = 0
  num_times_to_pause_before_next_notification = 0
  export show_finish_configuring_notification_if_needed = ->>
    if localStorage.getItem('allow_logging')?
      return
    tabs_list = await new Promise -> chrome.tabs.query {url: chrome.extension.getURL('/options.html')}, it
    if tabs_list.length > 0
      return
    if num_times_to_pause_before_next_notification > 0 # decreases frequency of notification exponentially to decrease annoyingness
      num_times_to_pause_before_next_notification := num_times_to_pause_before_next_notification - 1
      if num_times_to_pause_before_next_notification > 0
        return
    num_times_notification_already_shown := num_times_notification_already_shown + 1
    num_times_to_pause_before_next_notification := Math.pow(2, num_times_notification_already_shown + 1)
    notification = new Notification 'Finish setting up HabitLab', {
      icon: chrome.extension.getURL('icons/icon_128.png')
      body: 'Click here to finish setting up HabitLab'
      requireInteraction: true
    }
    close_notification = notification.close.bind(notification)
    notification.onclick = ->
      chrome.tabs.create({url: chrome.extension.getURL('options.html#onboarding')})
      close_notification()

  export get_last_visit_to_website_timestamp = ->>
    history_search_results = await new Promise -> chrome.history.search({text: 'https://habitlab.stanford.edu', startTime: 0}, it)
    last_visit_timestamp = -1
    for search_result in history_search_results
      if search_result.url.startsWith('https://habitlab.stanford.edu')
        if search_result.lastVisitTime > last_visit_timestamp
          last_visit_timestamp = search_result.lastVisitTime
    return last_visit_timestamp

  export get_last_visit_to_chrome_store_timestamp = ->>
    history_search_results = await new Promise -> chrome.history.search({text: 'https://chrome.google.com/webstore/detail/habitlab/obghclocpdgcekcognpkblghkedcpdgd', startTime: 0}, it)
    last_visit_timestamp = -1
    for search_result in history_search_results
      if search_result.url.startsWith('https://chrome.google.com/webstore/detail/habitlab/obghclocpdgcekcognpkblghkedcpdgd')
        if search_result.lastVisitTime > last_visit_timestamp
          last_visit_timestamp = search_result.lastVisitTime
    return last_visit_timestamp

  set_intervention_selection_algorithm_firstinstall = ->
    # algorithms = ['one_random_intervention_per_enabled_goal', 'experiment_always_same', 'experiment_oneperday', 'experiment_onepertwodays', 'experiment_oneperthreedays']
    # algorithms = ['experiment_alternate_between_same_vs_random_varlength_deterministic_latinsquare']
    algorithms = ['one_random_intervention_per_enabled_goal']
    chosen_algorithm = algorithms[Math.floor(Math.random() * algorithms.length)]
    localStorage.setItem('selection_algorithm_for_visit', chosen_algorithm)
    setvar_experiment('selection_algorithm_for_visit', chosen_algorithm)
    return

  set_intervention_firstimpression_notice_firstinstall = ->
    #algorithms = ['none', 'info', 'power']
    algorithms = ['power']
    chosen_algorithm = algorithms[Math.floor(Math.random() * algorithms.length)]
    localStorage.setItem('intervention_firstimpression_notice', chosen_algorithm)
    setvar_experiment('intervention_firstimpression_notice', chosen_algorithm)
    return
  
  set_difficulty_selection_screen = ->
    algorithms = ['none', 'nodefault_optional', 'nodefault_forcedchoice']
    chosen_algorithm = algorithms[Math.floor(Math.random() * algorithms.length)]
    if chosen_algorithm == 'none'
      localStorage.setItem('difficulty_selector_disabled', true)
    if chosen_algorithm == 'nodefault_forcedchoice'
      localStorage.setItem('difficulty_selector_forcedchoice', true)
    localStorage.setItem('difficulty_selection_screen', chosen_algorithm)
    setvar_experiment('difficulty_selection_screen', chosen_algorithm)
    return

  set_daily_goal_reminders_abtest = ->
    algorithms = ['on', 'off']
    chosen_algorithm = algorithms[Math.floor(Math.random() * algorithms.length)]
    if chosen_algorithm == 'off'
      localStorage.setItem('allow_daily_goal_notifications', false)
      send_feature_disabled({page: 'background', feature: 'allow_daily_goal_notifications', manual: false, reason: 'daily_goal_reminders_abtest'})
    setvar_experiment('daily_goal_reminders_abtest', chosen_algorithm)
    return
    
  set_reward_gifs_abtest = ->
    algorithms = ['on', 'off']
    chosen_algorithm = algorithms[Math.floor(Math.random() * algorithms.length)]
    if chosen_algorithm == 'off'
      localStorage.setItem('allow_reward_gifs', false)
      send_feature_disabled({page: 'background', feature: 'allow_reward_gifs', manual: false, reason: 'reward_gifs_abtest'})
    setvar_experiment('reward_gifs_abtest', chosen_algorithm)
    return

  do !->>
    {
      post_json
    } = require('libs_backend/ajax_utils')
    # open the options page on first run
    if localStorage.getItem('notfirstrun')
      return
    #  if not localStorage.getItem('allow_logging')? # user did not complete onboarding
    #    show_finish_configuring_notification_if_needed()
    #    #setInterval ->
    #    #  show_finish_configuring_notification_if_needed()
    #    #, 20000
    #    #chrome.tabs.create {url: 'options.html#onboarding:last'}
    #    #localStorage.setItem('allow_logging_on_default_without_onboarding', true)
    #    #localStorage.setItem('allow_logging', true)
    #    #send_logging_enabled {page: 'background', manual: false, 'allow_logging_on_default_without_onboarding': true}
    #  return
    localStorage.setItem('notfirstrun', true)
    localStorage.setItem('positive_goals_disabled', true)
    await set_default_goals_enabled()
    await set_default_generic_interventions_enabled()
    # set intervention selection algorithm - experiment
    set_intervention_selection_algorithm_firstinstall()
    set_intervention_firstimpression_notice_firstinstall()
    set_difficulty_selection_screen()
    set_daily_goal_reminders_abtest()
    set_reward_gifs_abtest()
    user_id = await get_user_id()
    tab_info = await get_active_tab_info()
    last_visit_to_website_timestamp = await get_last_visit_to_website_timestamp()
    last_visit_to_chrome_store_timestamp = await get_last_visit_to_chrome_store_timestamp()
    need_to_create_new_tab = true
    install_source = 'unknown'
    if tab_info?
      if tab_info.url == 'https://habitlab.netlify.com/#installing' or tab_info.url == 'https://habitlab.stanford.edu/#installing' or tab_info.url == 'https://habitlab.github.io/#installing' or tab_info.url == 'http://habitlab.netlify.com/#installing' or tab_info.url == 'http://habitlab.stanford.edu/#installing' or tab_info.url == 'http://habitlab.github.io/#installing'
        install_source = tab_info.url
        #need_to_create_new_tab = false
        #chrome.tabs.executeScript(tab_info.id, {code: 'window.location.href = "' + chrome.extension.getURL('options.html#onboarding') + '"'})
    if need_to_create_new_tab
      if install_source == 'unknown'
        if developer_mode
          install_source = 'sideload'
        else
          install_source = 'webstore'
      chrome.tabs.create {url: 'options.html#onboarding'}
    install_data = await get_basic_client_data()
    install_data.install_source = install_source
    install_data.last_visit_to_website = last_visit_to_website_timestamp
    install_data.last_visit_to_chrome_store = last_visit_to_chrome_store_timestamp
    post_json('https://habitlab.herokuapp.com/add_install', install_data)
    #user_secret = await get_user_secret()
    #post_json('https://habitlab.herokuapp.com/add_secret', {user_id, user_secret})
    #setInterval ->
    #  show_finish_configuring_notification_if_needed()
    #, 5000

  {
    get_all_message_handlers
  } = require 'libs_backend/expose_lib'

  require 'libs_backend/expose_backend_libs'

  {localget, remoteget, systemjsget} = require 'libs_common/cacheget_utils'

  {
    start_syncing_all_data
  } = require 'libs_backend/log_sync_utils'

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
    run_every_timeperiod
  } = require 'libs_common/common_libs'

  {
    as_array
    as_dictset
  } = require 'libs_common/collection_utils'

  {
    localstorage_getjson
    localstorage_setjson
    localstorage_getbool
  } = require 'libs_common/localstorage_utils'

  {
    baseline_time_per_session_for_domain
  } = require 'libs_common/gamification_utils'

  require! {
    moment
    'promise-debounce'
  }

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
    is_habitlab_enabled_sync
  } = require 'libs_backend/disable_habitlab_utils'

  {
    ensure_history_utils_data_cached
  } = require 'libs_common/history_utils'

  {
    log_impression_internal
  } = require 'libs_backend/log_utils'

  {
    sleep
  } = require 'libs_common/common_libs'

  {
    printable_time_spent_short
  } = require 'libs_common/time_utils'
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

  insert_css = (css_path) ->>
    # todo does not do anything currently
    return

  running_background_scripts = {}

  load_background_script = (options, intervention_info) ->>
    if running_background_scripts[options.path]?
      # already running
      return
    if options.code?
      background_script_text = options.code
    else
      background_script_text = await localget(options.path)
    background_script_function = new Function('env', background_script_text)
    env = {
      intervention_info: intervention_info
    }
    background_script_function(env)
    running_background_scripts[options.path] = env
    return

  cached_systemjs_code = null

  execute_content_scripts_for_intervention = (intervention_info, tabId, intervention_list, is_new_session, session_id, is_preview_mode, is_suggestion_mode) ->>
    {content_script_options, name} = intervention_info

    if localStorage.test_suggestion_mode == 'true'
      is_suggestion_mode = true

    # do not put here, because it may generate duplicates if the page causes the intervention to try to load multiple times
    # log_impression_internal(name)

    content_script_codes_promises = []
    for content_script_option in content_script_options
      if content_script_option.code?
        content_script_codes_promises.push Promise.resolve(content_script_option.code)
      else
        content_script_codes_promises.push localget(content_script_option.path)

    if cached_systemjs_code != null
      systemjs_content_script_code_promise = Promise.resolve cached_systemjs_code
    else
      systemjs_content_script_code_promise = localget('/intervention_utils/systemjs.js')

    [
      goal_info
      parameter_values
      systemjs_content_script_code
      ...content_script_codes
    ] = await Promise.all [
      get_goal_info(intervention_info.goals[0])
      get_intervention_parameters(intervention_info.name)
      systemjs_content_script_code_promise
      ...content_script_codes_promises
    ]

    if not cached_systemjs_code?
      cached_systemjs_code := systemjs_content_script_code
    intervention_info_copy = JSON.parse JSON.stringify intervention_info
    for i in [0 til intervention_info_copy.parameters.length]
      parameter = intervention_info_copy.parameters[i]
      parameter.value = parameter_values[parameter.name]
      intervention_info_copy.params[parameter.name].value = parameter_values[parameter.name]

    debug_content_script_code = """
    content_script_debug.listen_for_eval(function(command_to_evaluate) {
      if (window.customeval) {
        return window.customeval(command_to_evaluate);
      } else if (window.debugeval) {
        return window.debugeval(command_to_evaluate);
      } else {
        return window.eval(command_to_evaluate);
        //return eval.bind(this)(command_to_evaluate);
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
        chrome.runtime.sendMessage({type: 'send_to_debug_terminal', data: {tab: tab_id, text: data_string}});
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
      };
      #{debug_content_script_code}
      return;
    });
    """
    open_debug_page_if_needed = ''
    if localstorage_getbool('open_debug_console_on_load')
      open_debug_page_if_needed = """
      SystemJS.import('libs_frontend/intervention_debug_console').then(function(intervention_debug_console) {
        intervention_debug_console.open_debug_page()
      });
      """
    for options,idx in content_script_options
      content_script_code = content_script_codes[idx]
      if options.jspm_require
        content_script_code_prequel = """
        const intervention = #{JSON.stringify(intervention_info_copy)};
        const parameters = #{JSON.stringify(parameter_values)};
        const tab_id = #{tabId};
        const session_id = #{session_id};
        const is_new_session = #{is_new_session};
        const dlog = function(...args) { console.log(...args); };
        const set_default_parameters = function(parameter_object) {
          for (let parameter_name of Object.keys(parameter_object)) {
            if (parameters[parameter_name] == null) {
              parameters[parameter_name] = parameter_object[parameter_name];
            }
          }
        };

        """
        if options.debug_code? and localStorage.getItem('insert_debugging_code')?
          localStorage.removeItem('insert_debugging_code')
          content_script_debugging_code = options.debug_code
        else
          content_script_debugging_code = ''
        content_script_code = """
        window.Polymer = window.Polymer || {}
        window.Polymer.dom = 'shadow'
        SystemJS.import('libs_common/intervention_info').then(function(intervention_info_setter_lib) {
          intervention_info_setter_lib.set_intervention(#{JSON.stringify(intervention_info_copy)});
          intervention_info_setter_lib.set_goal_info(#{JSON.stringify(goal_info)});
          intervention_info_setter_lib.set_tab_id(#{tabId});
          intervention_info_setter_lib.set_session_id(#{session_id});
          intervention_info_setter_lib.set_is_new_session(#{is_new_session});
          SystemJS.import('data:text/javascript;base64,#{btoa(unescape(encodeURIComponent(content_script_code_prequel + content_script_debugging_code + content_script_code)))}');
        });
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
      const goal_info = #{JSON.stringify(goal_info)};
      const parameters = #{JSON.stringify(parameter_values)};
      const tab_id = #{tabId};
      const session_id = #{session_id};
      const is_new_session = #{is_new_session};
      const is_preview_mode = #{is_preview_mode};
      const is_suggestion_mode = #{is_suggestion_mode};
      const dlog = function(...args) { console.log(...args); };
      const set_default_parameters = function(parameter_object) {
        for (let parameter_name of Object.keys(parameter_object)) {
          if (parameters[parameter_name] == null) {
            parameters[parameter_name] = parameter_object[parameter_name];
          }
        }
      };
      window.intervention_disabled = false;

      if (!window.SystemJS) {
        #{systemjs_content_script_code}
      }
      #{content_script_code}
      #{debug_content_script_code_with_hlog}

      (async function() {
        while (document.body == null) {
          await new Promise(function(cb) {
            setTimeout(cb, 30);
          });
        }
        document.body.addEventListener('disable_intervention', function() {
          window.intervention_disabled = true;
          if (typeof(window.on_intervention_disabled) == 'function') {
            console.log('rinsitnrs');
            window.on_intervention_disabled();
          } else {
            SystemJS.import_multi(['libs_frontend/content_script_utils', 'sweetalert2'], function(content_script_utils, sweetalert) {
              content_script_utils.load_css_file('sweetalert2').then(function() {
                sweetalert({
                  title: 'Reload page to turn off intervention',
                  text: 'This intervention has not implemented support for disabling itself. Reload the page to disable it.'
                });
              });
            });
          }
          SystemJS.import('libs_frontend/intervention_log_utils').then(function(log_utils) {
            log_utils.log_disable();
          });
        });
      })();

      SystemJS.import_multi(['libs_common/intervention_info', 'libs_frontend/intervention_log_utils'], function(intervention_info_setter_lib, log_utils) {
        intervention_info_setter_lib.set_intervention(intervention);
        intervention_info_setter_lib.set_goal_info(goal_info);
        intervention_info_setter_lib.set_tab_id(tab_id);
        intervention_info_setter_lib.set_session_id(session_id);
        intervention_info_setter_lib.set_is_new_session(is_new_session);
        intervention_info_setter_lib.set_is_preview_mode(is_preview_mode);
        intervention_info_setter_lib.set_is_suggestion_mode(is_suggestion_mode);
        log_utils.log_impression();
        if (is_suggestion_mode) {
          log_utils.log_intervention_suggested();
        }
        #{open_debug_page_if_needed}
      });
    }
  }
      """
      await new Promise -> chrome.tabs.executeScript tabId, {code: content_script_code, allFrames: options.all_frames, runAt: options.run_at}, it
    return

  load_intervention_list = (intervention_list, tabId, is_new_session, session_id, is_preview_mode, is_suggestion_mode) ->>
    if intervention_list.length == 0
      return

    all_interventions = await get_interventions()
    intervention_info_list = [all_interventions[intervention_name] for intervention_name in intervention_list]

    # load background scripts
    for intervention_info in intervention_info_list
      for options in intervention_info.background_script_options
        await load_background_script options, intervention_info

    for intervention_info in intervention_info_list
      if intervention_info.css_files?
        for css_file in intervention_info.css_files
          await new Promise -> chrome.tabs.insertCSS tabId, {file: css_file}, it
      if intervention_info.styles?
        for css_code in intervention_info.styles
          await new Promise -> chrome.tabs.insertCSS tabId, {code: css_code}, it

    # load content scripts
    for intervention_info in intervention_info_list
      await execute_content_scripts_for_intervention intervention_info, tabId, intervention_list, is_new_session, session_id, is_preview_mode, is_suggestion_mode
    return

  #load_intervention = (intervention_name, tabId) ->>
  #  await load_intervention_list [intervention_name], tabId

  list_loaded_interventions = ->>
    await send_message_to_active_tab 'list_loaded_interventions', {}

  get_session_id_for_tab_id_and_domain = (tabId, domain) ->>
    if not tab_id_to_domain_to_session_id[tabId]?
      tab_id_to_domain_to_session_id[tabId] = {}
    session_id = tab_id_to_domain_to_session_id[tabId][domain]
    if session_id?
      return [session_id, false]
    session_id = await get_new_session_id_for_domain(domain)
    tab_id_to_domain_to_session_id[tabId][domain] = session_id
    return [session_id, true]

  tab_id_to_loaded_interventions = {}

  domain_to_prev_enabled_interventions = {}

  page_was_just_refreshed = false

  load_intervention_for_location = promise-debounce (location, tabId) ->>
    if is_it_outside_work_hours() and (not localStorage.getItem('override_enabled_interventions_once')?)
      chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon_disabled.svg')}
      return
    if !is_habitlab_enabled_sync()
      chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon_disabled.svg')}
      return

    is_suggestion_mode = false
    domain = url_to_domain(location)
    override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
    has_enabled_spend_less_time_goal = await site_has_enabled_spend_less_time_goal(domain)
    if (not has_enabled_spend_less_time_goal) and (not override_enabled_interventions?)
      return

    if not domain_to_prev_enabled_interventions[domain]?
      domain_to_prev_enabled_interventions[domain] = []
    prev_enabled_interventions = domain_to_prev_enabled_interventions[domain]
    all_enabled_interventions = await list_all_enabled_interventions_for_location(domain)
    if (all_enabled_interventions.length == 0) and (not override_enabled_interventions?)
      return
    domain_to_prev_enabled_interventions[domain] = all_enabled_interventions
    enabled_intervention_set_changed = JSON.stringify(all_enabled_interventions) != JSON.stringify(prev_enabled_interventions)
    [session_id, is_new_session] = await get_session_id_for_tab_id_and_domain(tabId, domain)
    dlog 'session_id is:'
    dlog session_id
    dlog 'is_new_session is:'
    dlog is_new_session
    active_interventions = await getkey_dictdict 'interventions_active_for_domain_and_session', domain, session_id
    dlog 'active_interventions is'
    dlog active_interventions
    dlog 'override_enabled_interventions is'
    dlog override_enabled_interventions
    if not active_interventions?
      if override_enabled_interventions?
        possible_interventions = as_array(JSON.parse(override_enabled_interventions))
      else
        possible_interventions = await list_enabled_nonconflicting_interventions_for_location(domain)
      intervention = possible_interventions[Math.floor(Math.random() * possible_interventions.length)]
      if intervention?
        await set_active_interventions_for_domain_and_session domain, session_id, [intervention]
      else
        await set_active_interventions_for_domain_and_session domain, session_id, []
      localStorage.removeItem('override_enabled_interventions_once')
    else
      active_interventions = JSON.parse active_interventions
      intervention = active_interventions[Math.floor(Math.random() * active_interventions.length)]
      intervention_no_longer_enabled = false
      need_new_session_id = false
      #if page_was_just_refreshed
      #  need_new_session_id = true
      if intervention?
        intervention_no_longer_enabled = all_enabled_interventions.length > 0 and all_enabled_interventions.indexOf(intervention) == -1
        if intervention_no_longer_enabled
          need_new_session_id = true
      #else
      #  if enabled_intervention_set_changed
      #    need_new_session_id = true
      if enabled_intervention_set_changed
        need_new_session_id = true
      if need_new_session_id
        # the intervention is no longer enabled. need to choose a new session id
        dlog 'intervention is no longer enabled. choosing new session id'
        dlog 'tabid is ' + tabId
        dlog 'domain is ' + domain
        dlog 'old session_id is ' + session_id
        dlog 'active_interventions'
        dlog active_interventions
        dlog 'all_enabled_interventions'
        dlog all_enabled_interventions
        session_id = await get_new_session_id_for_domain(domain)
        tab_id_to_domain_to_session_id[tabId][domain] = session_id
        if override_enabled_interventions?
          possible_interventions = as_array(JSON.parse(override_enabled_interventions))
        else
          possible_interventions = await list_enabled_nonconflicting_interventions_for_location(location)
        intervention = possible_interventions[0]
        intervention_suggestion = await get_suggested_intervention_if_needed_for_url(location)
        if intervention_suggestion?
          intervention = intervention_suggestion
          is_suggestion_mode = true

        #domain_to_session_id_to_intervention[domain][session_id] = intervention
        if intervention?
          await set_active_interventions_for_domain_and_session domain, session_id, [intervention]
        else
          await set_active_interventions_for_domain_and_session domain, session_id, []
        localStorage.removeItem('override_enabled_interventions_once')
    page_was_just_refreshed := false
    interventions_to_load = []
    if intervention?
      interventions_to_load.push intervention
    #if not intervention?
    #  return
    #await load_intervention intervention, tabId
    if not override_enabled_interventions?
      permanently_enabled_interventions = localStorage.getItem('permanently_enabled_interventions')
      if permanently_enabled_interventions?
        permanently_enabled_interventions = as_array(JSON.parse(permanently_enabled_interventions))
        all_available_interventions = await list_available_interventions_for_location(location)
        all_available_interventions = as_dictset(all_available_interventions)
        permanently_enabled_interventions = permanently_enabled_interventions.filter (x) -> all_available_interventions[x]
        for permanently_enabled_intervention in permanently_enabled_interventions
          if permanently_enabled_intervention != intervention
            interventions_to_load.push permanently_enabled_intervention
            #await load_intervention permanently_enabled_intervention, tabId
    tab_id_to_loaded_interventions[tabId] = interventions_to_load
    dlog 'interventions to load is:'
    dlog interventions_to_load
    await load_intervention_list interventions_to_load, tabId, is_new_session, session_id, override_enabled_interventions?, is_suggestion_mode
    if interventions_to_load.length > 0
      chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon_active.svg')}
    else
      chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon_disabled.svg')}
    return

  /*
  load_intervention_for_location = (location, tabId) ->>
    {work_hours_only ? 'false', start_mins_since_midnight ? '0', end_mins_since_midnight ? '1440'} = localStorage
    work_hours_only = work_hours_only == 'true'
    start_mins_since_midnight = parseInt start_mins_since_midnight
    end_mins_since_midnight = parseInt end_mins_since_midnight
    mins_since_midnight = moment().hours()*60 + moment().minutes()
    if work_hours_only and not (start_mins_since_midnight <= mins_since_midnight <= end_mins_since_midnight)
      return
    possible_interventions = await list_enabled_nonconflicting_interventions_for_location(location)
    for intervention in possible_interventions
      await load_intervention intervention, tabId
    localStorage.removeItem('override_enabled_interventions_once')
    return
  */

  getLocation = ->>
    #send_message_to_active_tab 'getLocation', {}, callback
    tabinfo = await get_active_tab_info()
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

  iframed_domain_to_track = null
  tabs_to_listen_for_focus = new Set()

  css_packages = require('libs_common/css_packages')
  css_files_cached = require('libs_common/css_files_cached')

  message_handlers = get_all_message_handlers()

  message_handlers <<< {
    'getLocation': (data) ->>
      location = await getLocation()
      #dlog 'getLocation background page:'
      #dlog location
      return location
    #'load_intervention': (data) ->>
    #  {intervention_name, tabId} = data
    #  await load_intervention intervention_name, tabId
    #  return
    'load_intervention_for_location': (data) ->>
      {location, tabId} = data
      await load_intervention_for_location location, tabId
      return
    'load_css_file': (data) ->>
      {css_file, tab} = data
      tabid = tab.id
      if css_packages[css_file]?
        css_file = css_packages[css_file]
      #chrome.tabs.insertCSS tabid, {file: css_file}, ->
      #  callback()
      if css_file.startsWith('http://') or css_file.startsWith('https://')
        css_code = await remoteget(css_file)
        await new Promise -> chrome.tabs.insertCSS tabid, {code: css_code}, it
        return
      else
        if css_files_cached[css_file]?
          css_code = css_files_cached[css_file]
        else
          css_code = await systemjsget(css_file)
        await new Promise -> chrome.tabs.insertCSS tabid, {code: css_code}, it
        return
    'load_css_code': (data) ->>
      {css_code, tab} = data
      tabid = tab.id
      await new Promise -> chrome.tabs.insertCSS tabid, {code: css_code}, it
      return
    'send_to_debug_terminal': (data) ->>
      existing_messages = localstorage_getjson('debug_terminal_messages')
      if not existing_messages?
        existing_messages = []
      existing_messages.push data
      localstorage_setjson('debug_terminal_messages', existing_messages)
      return
    'set_alternative_url_to_track': (data) ->>
      {url} = data
      if url?
        iframed_domain_to_track := url_to_domain(url)
      else
        iframed_domain_to_track := null
      return
    'register_listener_for_tab_focus': (data, sender) ->>
      {tab} = data
      tabs_to_listen_for_focus.add(tab.id)
      return
    'remove_listener_for_tab_focus': (data, sender) ->>
      {tab} = data  
      if tabs_to_listen_for_focus.has(tab.id)
        tabs_to_listen_for_focus.delete(tab.id)
      return
  }

  #tabid_to_current_location = {}

  #which_interventions_are_loaded = (tabId, callback) ->

  prev_domain = ''

  domain_changed = (new_domain) ->
    prev_domain := new_domain
    current_day = get_days_since_epoch()
    addtokey_dictdict 'visits_to_domain_per_day', new_domain, current_day, 1, (total_visits) ->
      return
      #dlog "total visits to #{new_domain} today is #{total_visits}"

  # our definition of a session:
  # how long a tab was open and on Facebook (or other site of interest) until it was closed
  # some pitfalls. if user navigates to FB, then goes to say buzzfeed, then goes back (on that same tab) the sessions are merged
  tab_id_to_domain_to_session_id = {}
  # domain_to_session_id_to_intervention = {}
  tab_id_to_url = {}

  export list_domain_to_session_ids = ->
    for tab_id,domain_to_session_id of tab_id_to_domain_to_session_id
      dlog domain_to_session_id

  {
    get_last_duolingo_progress_update_time
    update_duolingo_progress
  } = require 'libs_backend/duolingo_utils'

  # If they have a Duolingo goal, periodically check the site for progress updates in case it was used on another device.
  setInterval (->>
    enabled_goals = await get_enabled_goals()
    if enabled_goals['duolingo/complete_lesson_each_day']
      last_duolingo_progress_check = get_last_duolingo_progress_update_time()
      if moment().diff(last_duolingo_progress_check, 'hours') > 1
        update_duolingo_progress()
  ), 5min * 60s_per_min * 1000ms_per_s

  navigation_occurred = (url, tabId, is_from_history) ->
    new_domain = url_to_domain(url)

    if prev_domain == "www.duolingo.com"
      update_duolingo_progress()

    if new_domain != prev_domain
      domain_changed(new_domain)
      iframed_domain_to_track := null

    if not (url.startsWith('http://') or url.startsWith('https://'))
      chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon.svg')}
      return

    #if tabid_to_current_location[tabId] == url
    #  return
    #tabid_to_current_location[tabId] = url
    #possible_interventions <- list_available_interventions_for_location(url)
    #if possible_interventions.length > 0
    #  chrome.pageAction.show(tabId)
    #else
    #  chrome.pageAction.hide(tabId)
    #send_pageupdate_to_tab(tabId)
    #dlog "navigation_occurred to #{url}"
    load_intervention_for_location(url, tabId).then ->
      loaded_interventions = tab_id_to_loaded_interventions[tabId]
      if loaded_interventions? and loaded_interventions.length > 0
        chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon_active.svg')}
      else
        if is_habitlab_enabled_sync() and !is_it_outside_work_hours()
          chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon.svg')}
        else
          chrome.browserAction.setIcon {tabId: tabId, path: chrome.extension.getURL('icons/icon_disabled.svg')}

  # A bit naive and over-conservative, but a start
  chrome.windows.onFocusChanged.addListener (windowId) ->
    iframed_domain_to_track := null
  
  chrome.windows.onRemoved.addListener (windowId) ->
    iframed_domain_to_track := null

  chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
    if changeInfo.status == 'loading' and not changeInfo.url?
      # user refreshed the page
      page_was_just_refreshed := true
      iframed_domain_to_track := null
    if tab.url
      tab_id_to_url[tabId] = tab.url
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
        is_from_history: false
      }
      navigation_occurred tab.url, tabId, false
  reward_display_base_code_cached = null

  chrome.tabs.onActivated.addListener (activeInfo) ->>
    tabId = activeInfo.tabId
    if tabs_to_listen_for_focus.has tabId
      send_message_to_tabid tabId, 'tab_activated', {}

  chrome.tabs.onRemoved.addListener (tabId, info) ->>
    iframed_domain_to_track := null
    if tabs_to_listen_for_focus.has tabId
      tabs_to_listen_for_focus.delete tabId

    url = tab_id_to_url[tabId]
    if not url?
      return
    domain = url_to_domain(url)
    if not tab_id_to_domain_to_session_id[tabId]?
      return
    session_id = tab_id_to_domain_to_session_id[tabId][domain]
    if not session_id?
      return
    delete tab_id_to_domain_to_session_id[tabId]
    delete tab_id_to_url[tabId]
    delete tab_id_to_loaded_interventions[tabId]
    interventions_active = await getkey_dictdict('interventions_active_for_domain_and_session', domain, session_id)
    if (not interventions_active?) or (interventions_active.length == 0) or interventions_active == '[]'
      return
    if reward_display_base_code_cached == null
      reward_display_base_code_cached := await fetch('frontend_utils/close_tab_message.js').then (.text!)
    baseline_seconds_spent = await baseline_time_per_session_for_domain(domain)
    seconds_spent = await getkey_dictdict('seconds_on_domain_per_session', domain, session_id)
    if seconds_spent > baseline_seconds_spent
      return
    if isNaN(seconds_spent)
      seconds_spent = 0
    seconds_saved = baseline_seconds_spent - seconds_spent
    current_tab_info = await get_active_tab_info()
    if (not current_tab_info?) or (not current_tab_info.url?)
      return
    if not (current_tab_info.url.startsWith('http://') or current_tab_info.url.startsWith('https://'))
      return
    reward_display_code = "window.reward_display_seconds_saved = " + seconds_saved + ";\n\n" + reward_display_base_code_cached
    if localStorage.getItem('allow_reward_gifs') != 'false'
      chrome.tabs.executeScript current_tab_info.id, {code: reward_display_code}

  /*
  setInterval ->>
    base_code = await fetch('frontend_utils/close_tab_message.js').then (.text!)
    reward_display_code = "window.reward_display_seconds_saved = 6;\n\n" + base_code
    current_tab_info = await get_active_tab_info()
    chrome.tabs.executeScript current_tab_info.id, {code: reward_display_code}
  , 5000
  */

  #chrome.tabs.onActivated.addListener (info) ->
  #  console.log 'tab activated'
  #  console.log info

  chrome.webNavigation.onHistoryStateUpdated.addListener (info) ->
    #if info.tabId? and info.url?
    #  tab_id_to_url[info.tabId] = info.url
    send_message_to_tabid info.tabId, 'navigation_occurred', {
      url: info.url
      tabId: info.tabId
      is_from_history: true
    }
    navigation_occurred info.url, info.tabId, true

  message_handlers_requiring_tab = {
    'load_css_file': true
    'load_css_code': true
    'register_listener_for_tab_focus': true
    'remove_listener_for_tab_focus': true
  }

  chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
    {type, data} = request
    # console.log 'onMessage'
    # console.log type
    # console.log data
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
    message_handler(data).then (response) ->
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

  setInterval (->>
    if !prev_browser_focused
      return
    if current_idlestate != 'active'
      return
    active_tab = await get_active_tab_info()
    if not active_tab?
      return
    if not (active_tab.url.startsWith('http://') or active_tab.url.startsWith('https://'))
      return
    if iframed_domain_to_track?
      current_domain = iframed_domain_to_track
    else
      current_domain = url_to_domain(active_tab.url)
    current_day = get_days_since_epoch()
    has_enabled_goal = await site_has_enabled_spend_less_time_goal(current_domain)
    if not has_enabled_goal
      chrome.browserAction.setBadgeText({text: '', tabId: active_tab.id})
      return
    domain_to_session_id = tab_id_to_domain_to_session_id[active_tab.id]
    if not domain_to_session_id?
      chrome.browserAction.setBadgeText({text: '', tabId: active_tab.id})
      return
    session_id = domain_to_session_id[current_domain]
    if not session_id?
      chrome.browserAction.setBadgeText({text: '', tabId: active_tab.id})
      return
    # dlog "currently browsing #{url_to_domain(active_tab.url)} on day #{get_days_since_epoch()}"
    # [session_id, is_new_session] = await get_session_id_for_tab_id_and_domain(active_tab.id, current_domain)
    # dlog "session id #{session_id} current_domain #{current_domain} tab_id #{active_tab.id}"
    addtokey_dictdict('seconds_on_domain_per_session', current_domain, session_id, 1)
    addtokey_dictdict('seconds_on_domain_per_day', current_domain, current_day, 1).then (total_seconds) ->
      chrome.browserAction.setBadgeText({text: printable_time_spent_short(total_seconds), tabId: active_tab.id})
    #addtokey_dictdict 'seconds_on_domain_per_day', current_domain, current_day, 1, (total_seconds) ->
    #  dlog "total seconds spent on #{current_domain} today is #{total_seconds}"
  ), 1000

  #localStorage.tabsOpened = 0
  #chrome.tabs.onCreated.addListener (x) ->
  #  localStorage.tabsOpened = Number(localStorage.tabsOpened) + 1

  /*
  setInterval (->>
    if !prev_browser_focused
      return
    if current_idlestate != 'active'
      return
    active_tab = await get_active_tab_info()
    if not active_tab?
      return
    if active_tab.url.startsWith('chrome://') or active_tab.url.startsWith('chrome-extension://') # ignore time spent on extension pages
      return
    current_domain = url_to_domain(active_tab.url)
    dlog "current domain is #{current_domain}"
    dlog "current tab id is #{active_tab.id}"
    [session_id, is_new_session] = await get_session_id_for_tab_id_and_domain(active_tab.id, current_domain)
    dlog "session_id: #{session_id}"
    seconds_spent = await get_seconds_spent_on_domain_in_session(current_domain, session_id)
    dlog "seconds spent: #{seconds_spent}"
  ), 1000
  */

  start_syncing_all_data()

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

  require('libs_backend/require_remote_utils')

  #require('libs_backend/message_after_tab_close')
  require('libs_backend/notification_timer') #lewin notification_timer code

  await get_goal_intervention_info() # ensure cached
  await get_goals()
  await get_enabled_goals()

  get_habitlab_uninstall_url = ->>
    base64_js = require('base64-js')
    msgpack_lite = require('msgpack-lite')
    compress_and_encode = (data) ->
      base64_js.fromByteArray(msgpack_lite.encode(data))
    uninstall_url_base = 'https://habitlab.github.io/bye#'
    uninstall_url = uninstall_url_base
    uninstall_url_data = {}
    uninstall_url_data.v = habitlab_version
    if chrome.runtime.id == 'obghclocpdgcekcognpkblghkedcpdgd'
      uninstall_url_data.r = 0 # stable
    else if chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina'
      uninstall_url_data.r = 1 # beta
      uninstall_url_base = 'https://habitlab.netlify.com/bye#'
    else if developer_mode
      uninstall_url_data.r = 2 # developer
      uninstall_url_base = 'https://habitlab.netlify.com/bye#'
    else
      uninstall_url_data.r = 3 # unknown release
      uninstall_url_data.ri = chrome.runtime.id
    set_uninstall_url_if_valid = ->
      uninstall_url_next = uninstall_url_base + compress_and_encode(uninstall_url_data)
      if uninstall_url_next.length <= 255
        uninstall_url := uninstall_url_next
        return true
      return false # had an error
    uninstall_url_data.u = await get_user_id()
    uninstall_url_data.l = if (localStorage.getItem('allow_logging') == 'true') then 1 else 0
    uninstall_url_data.i = await get_install_id()
    if not set_uninstall_url_if_valid()
      return uninstall_url
    list_enabled_goals_short = ->>
      output = []
      goals = await get_enabled_goals()
      all_goals = await get_goals()
      for k,v of goals
        if not v
          continue
        goal_info = all_goals[k]
        output.push goal_info.sitename_printable
      return output
    uninstall_url_data.g = await list_enabled_goals_short()
    if not set_uninstall_url_if_valid()
      return uninstall_url
    return uninstall_url
  
  decode_habitlab_uninstall_url_data = (url) ->>
    data = url.substr(url.indexOf('/bye#') + 5) # 'https://habitlab.github.io/bye#'.length
    base64_js = require('base64-js')
    msgpack_lite = require('msgpack-lite')
    decompress_and_decode = (str) ->
      msgpack_lite.decode(base64_js.toByteArray(str))
    return decompress_and_decode(data)

  set_habitlab_uninstall_url = ->>
    habitlab_uninstall_url = await get_habitlab_uninstall_url()
    chrome.runtime.setUninstallURL(habitlab_uninstall_url)
  
  export open_habitlab_uninstall_url = ->>
    uninstall_url = await get_habitlab_uninstall_url()
    chrome.tabs.create {url: uninstall_url}

  if (not developer_mode) # not developer mode
    await set_habitlab_uninstall_url()

  num_times_restart_failed_due_to_loaded_interventions = 0
  num_times_restart_failed_due_to_loaded_interventions_active = 0
  num_times_restart_failed_due_to_habitlab_tab_open = 0
  num_times_restart_failed_due_to_habitlab_tab_open_active = 0
  restart_failed_priority_to_counts = [
    0 # have habitlab tab open and active
    0 # have habitlab intervention running and active
    0 # have habitlab intervention open
    0 # have habitlab tab open
  ]

  record_restart_failed = (priority) !->
    restart_failed_priority_to_counts[priority] += 1
    #dlog restart_failed_priority_to_counts
    restart_habitlab = ->
      chrome.runtime.reload()
      chrome.runtime.restart()
    if (priority == 0) and (restart_failed_priority_to_counts[0] >= 5000)
      restart_habitlab()
    if (priority == 1) and (restart_failed_priority_to_counts[0] + restart_failed_priority_to_counts[1] >= 1000)
      restart_habitlab()
    if (priority == 2) and (restart_failed_priority_to_counts[0] + restart_failed_priority_to_counts[1] + restart_failed_priority_to_counts[2] >= 250)
      restart_habitlab()
    if (priority == 3) and (restart_failed_priority_to_counts[0] + restart_failed_priority_to_counts[1] + restart_failed_priority_to_counts[2] + restart_failed_priority_to_counts[3]) >= 50
      restart_habitlab()
  export try_to_restart_habitlab_now = !->>
    open_tabs = await new Promise -> chrome.tabs.query({}, it)
    active_tabs = open_tabs.filter (.active)
    for tab_info in active_tabs
      if tab_info.url? and tab_info.url.startsWith(chrome.extension.getURL(''))
        # have a habitlab tab open currently, active
        return record_restart_failed(0)
    tab_ids_with_no_interventions = {}
    for tab_info in active_tabs
      loaded_interventions = await list_currently_loaded_interventions_for_tabid(tab_info.id)
      if loaded_interventions.length > 0
        # have loaded interventions, active
        return record_restart_failed(1)
      else
        tab_ids_with_no_interventions[tab_info.id] = true
    for tab_info in open_tabs
      if tab_ids_with_no_interventions[tab_info.id]?
        continue
      loaded_interventions = await list_currently_loaded_interventions_for_tabid(tab_info.id)
      if loaded_interventions.length > 0
        # have loaded interventions, not active
        return record_restart_failed(2)
    for tab_info in open_tabs
      if tab_info.url? and tab_info.url.startsWith(chrome.extension.getURL(''))
        # have a habitlab tab open currently, not active
        return record_restart_failed(3)
    chrome.runtime.reload()
    chrome.runtime.restart()

  habitlab_restarter_running = false
  export start_trying_to_restart_habitlab = !->>
    if habitlab_restarter_running
      return
    habitlab_restarter_running := true
    while true
      await try_to_restart_habitlab_now()
      await sleep(60000) # every 60 seconds

  require! {
    semver
  }

  {
    check_if_update_available_and_run_update
  } = require 'libs_backend/habitlab_update_utils'

  require 'libs_common/global_exports_post'

  update_available_version = localStorage.getItem('extension_update_available_version')
  if update_available_version?
    if not semver.valid(update_available_version)
      localStorage.removeItem('extension_update_available_version')
    if semver.gte(habitlab_version, update_available_version)
      localStorage.removeItem('extension_update_available_version')
  
  chrome.runtime.onUpdateAvailable.addListener (update_details) ->
    if semver.valid(update_details.version)
      localStorage.setItem('extension_update_available_version', update_details.version)
      start_trying_to_restart_habitlab()

  if (not developer_mode) or (localStorage.getItem('check_for_updates_devmode') == 'true')
    if localStorage.getItem('allow_logging') != 'false'
      run_every_timeperiod check_if_update_available_and_run_update, 600000 # 1000*60*10 every 10 minutes

  url_to_open_on_next_start = localStorage.getItem('habitlab_open_url_on_next_start')
  if url_to_open_on_next_start?
    localStorage.removeItem('habitlab_open_url_on_next_start')
    chrome.tabs.create {url: url_to_open_on_next_start}


