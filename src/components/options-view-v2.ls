{polymer_ext} = require 'libs_frontend/polymer_utils'
{load_css_file} = require 'libs_common/content_script_utils'
{cfy} = require 'cfy'

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
  results_icon
  gear_icon
  habitlab_icon
  help_icon
} = require 'libs_common/icon_data'

{
  once_true
} = require 'libs_frontend/common_libs'

swal = require 'sweetalert2'

polymer_ext {
  is: 'options-view-v2'
  properties: {
    selected_tab_idx: {
      type: Number
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
      computed: 'compute_sidebar_items(enabled_goal_info_list)'
      #value: ["Home", "Settings", "Facebook", "omg"]
    }
    enabled_goal_info_list: {
      type: Array
    }
    have_options_page_hash: {
      type: Boolean
    }
  }
  listeners: {
    goal_changed: 'on_goal_changed'
    need_rerender: 'rerender'
    need_tab_change: 'on_need_tab_change'
  }
  compute_sidebar_items: (enabled_goal_info_list) ->
    default_icon = habitlab_icon
    return [{name: 'Overview', icon: habitlab_icon}, {name: 'Settings', icon: gear_icon}].concat([{name: x.sitename_printable, icon: x.icon ? default_icon} for x in enabled_goal_info_list]).concat({name: 'Help / FAQ', icon: help_icon})
  enable_habitlab_button_clicked: ->
    this.is_habitlab_disabled = false
    enable_habitlab()
  get_power_icon_src: ->
    return chrome.extension.getURL('icons/power_button.svg')
  on_need_tab_change: (evt) ->
    if evt?detail?newtab?
      this.set_selected_tab_by_name(evt.detail.newtab)
  set_selected_tab_by_name: cfy (selected_tab_name) ->*
    self = this
    aliases = {
      faq: \help
    }
    selected_tab_name = aliases[selected_tab_name] ? selected_tab_name
    selected_tab_idx = switch selected_tab_name
    | 'progress' => 0
    | 'results' => 0
    | 'dashboard' => 0
    | 'overview' => 0
    | 'goals' => 1
    | 'interventions' => 1
    | 'configure' => 1
    | 'config' => 1
    | 'manage' => 1
    | 'options' => 1
    | 'settings' => 1
    | 'introduction' => 1
    | 'onboarding' => 1
    | _ => -1
    if selected_tab_idx != -1
      self.selected_tab_idx = selected_tab_idx
      return
    yield once_true(-> self.enabled_goal_info_list?length?)
    goals_list = self.enabled_goal_info_list.map((.sitename_printable)).map((.toLowerCase!))
    goals_list.push 'help'
    selected_goal_idx = goals_list.indexOf(selected_tab_name)
    if selected_goal_idx != -1
      self.selected_tab_idx = selected_goal_idx + 2
  compute_selected_tab_name: (selected_tab_idx, enabled_goal_info_list) ->
    goals_list = enabled_goal_info_list.map((.sitename_printable)).map((.toLowerCase!))
    return (['overview', 'settings'].concat(goals_list)).concat(['help'])[selected_tab_idx]
  selected_tab_name_changed: (selected_tab_name) ->
    this.fire 'options_selected_tab_changed', {selected_tab_name}
  on_goal_changed: (evt) ->
    this.rerender()
    #this.$$('#options-interventions').on_goal_changed(evt.detail)
    #this.$$('#dashboard-view').on_goal_changed(evt.detail)
  # icon_clicked: cfy ->*

  #   yield load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
  #   yield swal {'title':"Welcome to HabitLab!", 'text': "HabitLab is a Chrome Extension that will help prevent you from getting distracted on the web.
  #          It will <u>automatically show you interventions</u> to help you keep on track to your goals, and fine-tune its algorithms over time.\n\n\n


  #         <b>Privacy: </b>In order to optimize your interventions, HabitLab needs to <u>modify your webpages</u> and <u>send data to our server</u> about where and when you see interventions.\n
  #         \n<b>Icons: </b>A <habitlab-logo style='zoom: 0.5;  padding-left: 5px; padding-right: 5px; display: inline-block'></habitlab-logo> is placed on every intervention, so you can easily identify which elements are from HabitLab. Click the gear to get more information or disable the intervention.\n
  #         Click the <iron-icon icon='info-outline' style='margin-top: -3px; padding-left: 5px; padding-right: 5px'></iron-icon> in the top right to see this window again.
  #         \n\nClick OK to begin selecting your goals!
  #         ", 'animation': false, 'allowOutsideClick': false, 'allowEscapeKey': true}
  rerender: cfy ->*
    self = this
    self.is_habitlab_disabled = not (yield is_habitlab_enabled())
    #is_habitlab_enabled().then (is_enabled) -> self.is_habitlab_disabled = !is_enabled
    goals = yield get_goals()
    enabled_goals = yield get_enabled_goals()
    goals_list = yield list_all_goals()
    enabled_goal_info_list = []
    for goal_name in goals_list
      goal_info = goals[goal_name]
      is_enabled = enabled_goals[goal_name]
      if not is_enabled
        continue
      enabled_goal_info_list.push(goal_info)
    enabled_goal_info_list.sort (a, b) ->
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
    self.$$('#settings_tab').rerender_privacy_options()
    #self.$$('#overview_tab').rerender()
    #self.$$('#settings_tab').rerender()
  #  self.once_available '#optionstab', ->
  #    self.S('#optionstab').prop('selected', 0)
  ready: cfy ->*
    yield this.rerender()
    if not this.have_options_page_hash and not this.selected_tab_idx?
      this.selected_tab_idx = 0
    yield SystemJS.import('cheerio')
    #yield SystemJS.import('jimp')
    #yield SystemJS.import('icojs')
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
