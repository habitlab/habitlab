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

swal = require 'sweetalert2'

polymer_ext {
  is: 'options-view-v2'
  properties: {
    selected_tab_idx: {
      type: Number
      value: 0
    }
    selected_tab_name: {
      type: String
      computed: 'compute_selected_tab_name(selected_tab_idx)'
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
  }
  listeners: {
    goal_changed: 'on_goal_changed'
    need_rerender: 'rerender'
  }
  compute_sidebar_items: (enabled_goal_info_list) ->
    default_icon = 'data:image/png;base64,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'
    gear_icon = default_icon
    return [{name: 'Overview', icon: default_icon}, {name: 'Settings', icon: gear_icon}].concat [{name: x.sitename_printable, icon: x.icon ? default_icon} for x in enabled_goal_info_list]
  tab_elem_selected_changed: (evt) ->
    this.selected_tab_idx = evt.detail.idx
  enable_habitlab_button_clicked: ->
    this.is_habitlab_disabled = false
    enable_habitlab()
  get_power_icon_src: ->
    return chrome.extension.getURL('icons/power_button.svg')
  set_selected_tab_by_name: (selected_tab_name) ->
    selected_tab_idx = switch selected_tab_name
    | 'progress' => 1
    | 'results' => 1
    | 'dashboard' => 1
    | 'goals' => 0
    | 'interventions' => 0
    | 'configure' => 0
    | 'config' => 0
    | 'manage' => 0
    | 'options' => 0
    | 'settings' => 0
    | 'introduction' => 0
    if selected_tab_idx != -1
      this.selected_tab_idx = selected_tab_idx
  compute_selected_tab_name: (selected_tab_idx) ->
    return ['settings', 'results'][selected_tab_idx]
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
    self.enabled_goal_info_list = enabled_goal_info_list
  #  self.once_available '#optionstab', ->
  #    self.S('#optionstab').prop('selected', 0)
  ready: cfy ->*
    this.rerender()
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
