{polymer_ext} = require 'libs_frontend/polymer_utils'
{load_css_file} = require 'libs_common/content_script_utils'

{
  is_habitlab_enabled
  enable_habitlab
} = require 'libs_common/disable_habitlab_utils'

{
  get_goals
  get_enabled_goals
  list_all_goals
} = require 'libs_backend/goal_utils'

{
  list_currently_loaded_interventions
  get_active_tab_info
} = require 'libs_backend/background_common'

{
  get_favicon_data_for_domain_cached
} = require 'libs_backend/favicon_utils'

{
  once_true
} = require 'libs_common/common_libs'

{
  promise_all_object
} = require 'libs_common/promise_utils'

{
  msg
} = require 'libs_common/localization_utils'

{
  log_pagenav
  add_log_habitlab_enabled
} = require 'libs_backend/log_utils'

swal = require 'sweetalert2'

polymer_ext {
  is: 'options-view-v2'
  properties: {
    selected_tab_idx: {
      type: Number
      observer: 'selected_tab_idx_changed'
    }
    selected_tab_name: {
      type: String
      computed: 'compute_selected_tab_name(selected_tab_idx, enabled_goal_info_list)'
      observer: 'selected_tab_name_changed'
    }
    is_habitlab_disabled: {
      type: Boolean
    }
    sidebar_items: {
      type: Array
      computed: 'compute_sidebar_items(enabled_goal_info_list, goal_name_to_icon)'
      #value: ["Home", "Settings", "Facebook", "omg"]
    }
    enabled_goal_info_list: {
      type: Array
    }
    have_options_page_hash: {
      type: Boolean
    }
    goal_name_to_icon: {
      type: Object
      value: {}
    }
  }
  listeners: {
    goal_changed: 'on_goal_changed'
    need_rerender: 'rerender'
    need_tab_change: 'on_need_tab_change'
    go_to_voting: 'on_go_to_voting'
  }
  compute_sidebar_items: (enabled_goal_info_list, goal_name_to_icon) ->
    default_icon = chrome.extension.getURL('icons/loading.gif')
    output = [{name: msg('Overview'), icon: chrome.extension.getURL('icons/results.svg')}, {name: msg('Settings'), icon: chrome.extension.getURL('icons/configure_black.svg')}]
    for x in enabled_goal_info_list
      output.push {name: x.sitename_printable, icon: x.icon ? goal_name_to_icon[x.name] ? default_icon}
    output.push({name: msg('Help / FAQ'), icon: chrome.extension.getURL('icons/help.svg')})
    return output
  enable_habitlab_button_clicked: ->>
    this.is_habitlab_disabled = false
    enable_habitlab()
    tab_info = await get_active_tab_info()
    loaded_interventions = []
    add_log_habitlab_enabled({
      page: 'options-view-v2',
      reason: 'enable_habitlab_big_button_clicked'
      tab_info: tab_info
      url: tab_info?url
      loaded_interventions: loaded_interventions
    })
  get_power_icon_src: ->
    return chrome.extension.getURL('icons/power_button.svg')
  on_go_to_voting: (evt) ->
    this.set_selected_tab_by_name('settings')
    settings_tab = this.$$('#settings_tab')
    offset_top = settings_tab.$.intro8.offsetTop
    window.scrollTo({left: 0, top: offset_top})
  on_need_tab_change: (evt) ->
    if evt?detail?newtab?
      this.set_selected_tab_by_name(evt.detail.newtab)
  set_selected_tab_by_name: (selected_tab_name) ->>
    self = this
    aliases = {
      faq: \help
    }
    selected_tab_name = aliases[selected_tab_name] ? selected_tab_name
    name_to_idx_map = {
      'progress': 0
      'results': 0
      'dashboard': 0
      'overview': 0
      'goals': 1
      'nudges': 1
      'configure': 1
      'config': 1
      'manage': 1
      'options': 1
      'settings': 1
      'introduction': 1
      'onboarding': 1
    }
    selected_tab_idx = name_to_idx_map[selected_tab_name]
    if selected_tab_idx?
      self.selected_tab_idx = selected_tab_idx
      window.scrollTo(0, 0)
      return
    await once_true(-> self.enabled_goal_info_list?length?)
    goals_list = self.enabled_goal_info_list.map((.sitename_printable)).map((.toLowerCase!))
    goals_list.push 'help'
    selected_goal_idx = goals_list.indexOf(selected_tab_name)
    if selected_goal_idx?
      self.selected_tab_idx = selected_goal_idx + 2
    window.scrollTo(0, 0)
  compute_selected_tab_name: (selected_tab_idx, enabled_goal_info_list) ->
    goals_list = enabled_goal_info_list.map((.sitename_printable)).map((.toLowerCase!))
    return (['overview', 'settings'].concat(goals_list)).concat(['help'])[selected_tab_idx]
  selected_tab_name_changed: (selected_tab_name) ->
    this.fire 'options_selected_tab_changed', {selected_tab_name}
    log_pagenav({tab: selected_tab_name})
  string_to_id: (sitename) ->
    output = ''
    for c in sitename
      if 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(c) != -1
        output += c
    return output.toLowerCase()
  selected_tab_idx_changed: (selected_tab_idx) ->>
    self = this
    if (not selected_tab_idx?) or selected_tab_idx == 1
      return
    if selected_tab_idx == 0
      overview_tab = await self.once_available('#overview_tab')
      overview_tab.rerender()
      return
    goal_idx = selected_tab_idx - 2
    await once_true(-> self.enabled_goal_info_list?length?)
    goal_sitename_list = self.enabled_goal_info_list.map((.sitename_printable)).map(-> self.string_to_id(it))
    if goal_idx < 0 or goal_idx >= goal_sitename_list.length
      return
    goal_sitename = goal_sitename_list[goal_idx]
    once_true ->
      self.$$('#siteview_' + goal_sitename)?rerender?
    , ->
      self.$$('#siteview_' + goal_sitename).rerender()
    return
  onboarding_completed: ->
    swal({
      title: "Done Setting Up HabitLab!",
      text: "This is the settings page, where you can manage your Nudges and track your progress.",
      confirmButtonColor: "#3C5A96"
    });

  on_goal_changed: (evt) ->
    this.rerender()
    #this.$$('#options-interventions').on_goal_changed(evt.detail)
    #this.$$('#dashboard-view').on_goal_changed(evt.detail)
  # icon_clicked: ->>

  #   await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
  #   await swal {'title':"Welcome to HabitLab!", 'text': "HabitLab is a Chrome Extension that will help prevent you from getting distracted on the web.
  #          It will <u>automatically show you interventions</u> to help you keep on track to your goals, and fine-tune its algorithms over time.\n\n\n


  #         <b>Privacy: </b>In order to optimize your interventions, HabitLab needs to <u>modify your webpages</u> and <u>send data to our server</u> about where and when you see interventions.\n
  #         \n<b>Icons: </b>A <habitlab-logo-v2 style='zoom: 0.5;  padding-left: 5px; padding-right: 5px; display: inline-block'></habitlab-logo-v2> is placed on every intervention, so you can easily identify which elements are from HabitLab. Click the gear to get more information or disable the intervention.\n
  #         Click the <iron-icon icon='info-outline' style='margin-top: -3px; padding-left: 5px; padding-right: 5px'></iron-icon> in the top right to see this window again.
  #         \n\nClick OK to begin selecting your goals!
  #         ", 'animation': false, 'allowOutsideClick': false, 'allowEscapeKey': true}
  rerender: ->>
    self = this
    #self.is_habitlab_disabled = not (await is_habitlab_enabled())
    is_habitlab_enabled().then (is_enabled) -> self.is_habitlab_disabled = !is_enabled
    [
      goals
      enabled_goals
      goals_list
    ] = [
      await get_goals()
      await get_enabled_goals()
      await list_all_goals()
    ]
    enabled_goal_info_list = []
    for goal_name in goals_list
      goal_info = goals[goal_name]
      is_enabled = enabled_goals[goal_name]
      if not is_enabled
        continue
      enabled_goal_info_list.push(goal_info)
    enabled_goal_info_list.sort (a, b) ->
      if a.is_positive and not b.is_positive
        return 1
      if b.is_positive and not a.is_positive
        return -1
      if a.custom and not b.custom
        return 1
      if b.custom and not a.custom
        return -1
      if a.sitename_printable > b.sitename_printable
        return 1
      else if a.sitename_printable < b.sitename_printable
        return -1
      return 0
    self.enabled_goal_info_list = enabled_goal_info_list
    once_true ->
      self.$$('#settings_tab')?rerender_privacy_options?
    , ->
      self.$$('#settings_tab').rerender_privacy_options()
    once_true ->
      self.$$('#settings_tab')?rerender_idea_generation?
    , ->
      self.$$('#settings_tab').rerender_idea_generation()
    do !->>
      goal_name_to_icon_changed = false
      goal_name_to_new_icon_promises = {}
      for goal_info in enabled_goal_info_list
        if not goal_info.icon?
          goal_name_to_new_icon_promises[goal_info.name] = get_favicon_data_for_domain_cached(goal_info.domain)
          goal_name_to_icon_changed = true
      if goal_name_to_icon_changed
        goal_name_to_new_icons = await promise_all_object goal_name_to_new_icon_promises
        for goal_name,icon of goal_name_to_new_icons
          if not icon?
            icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
          self.goal_name_to_icon[goal_name] = icon
        self.goal_name_to_icon = JSON.parse JSON.stringify self.goal_name_to_icon
    #self.$$('#overview_tab').rerender()
    #self.$$('#settings_tab').rerender()
  #  self.once_available '#optionstab', ->
  #    self.S('#optionstab').prop('selected', 0)
  allow_logging_changed: ->
    console.log 'allow logging changed'
    self = this
    once_true ->
      self.$$('#settings_tab')?rerender_privacy_options?
    , ->
      self.$$('#settings_tab').rerender_privacy_options()
  ready: ->>
    this.$$('#irbdialog').open_if_needed()
    ##self = this
    ##this.$$('#goal_selector').set_sites_and_goals()
    await this.rerender()
    if not this.have_options_page_hash and not this.selected_tab_idx?
      this.selected_tab_idx = 0

    require('components/sidebar-tabs.deps')

    if this.selected_tab_idx == 0
      require('components/dashboard-view-v2.deps')
    else if this.selected_tab_idx == 1
      require('components/options-interventions.deps')
    else if window.location.hash == '#help' or window.location.hash == '#faq'
      require('components/help-faq.deps')
    else
      require('components/site-view.deps')

    setTimeout ->>

      require('components/options-interventions.deps')
      require('components/site-view.deps')
      require('components/dashboard-view-v2.deps')
      require('components/habitlab-logo-v2.deps')
      require('components/help-faq.deps')

      await SystemJS.import('cheerio')
      #await SystemJS.import('jimp')
      #await SystemJS.import('icojs')
    , 1000
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
