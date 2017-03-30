{polymer_ext} = require 'libs_frontend/polymer_utils'
{load_css_file} = require 'libs_common/content_script_utils'
{cfy} = require 'cfy'

{
  is_habitlab_enabled
  enable_habitlab
} = require 'libs_common/disable_habitlab_utils'

swal = require 'sweetalert2'

polymer_ext {
  is: 'options-view'
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
  }
  listeners: {
    goal_changed: 'on_goal_changed'
  }
  enable_habitlab_button_clicked: ->
    this.is_habitlab_disabled = false
    enable_habitlab()
  get_power_icon_src: ->
    return chrome.extension.getURL('icons/power_button.svg')
  set_selected_tab_by_name: (selected_tab_name) ->
    name_to_idx_map = {
      'progress': 1
      'results': 1
      'dashboard': 1
      'overview': 1
      'goals': 0
      'interventions': 0
      'configure': 0
      'config': 0
      'manage': 0
      'options': 0
      'settings': 0
      'introduction': 0
      'onboarding': 0
    }
    selected_tab_idx = name_to_idx_map[selected_tab_name]
    if selected_tab_idx?
      this.selected_tab_idx = selected_tab_idx
  compute_selected_tab_name: (selected_tab_idx) ->
    return ['settings', 'results'][selected_tab_idx]
  selected_tab_name_changed: (selected_tab_name) ->
    this.fire 'options_selected_tab_changed', {selected_tab_name}
  on_goal_changed: (evt) ->
    this.$$('#options-interventions').on_goal_changed(evt.detail)
    this.$$('#dashboard-view').on_goal_changed(evt.detail)
  # icon_clicked: ->>
    
  #   await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
  #   await swal {'title':"Welcome to HabitLab!", 'text': "HabitLab is a Chrome Extension that will help prevent you from getting distracted on the web.
  #          It will <u>automatically show you interventions</u> to help you keep on track to your goals, and fine-tune its algorithms over time.\n\n\n
          
          
  #         <b>Privacy: </b>In order to optimize your interventions, HabitLab needs to <u>modify your webpages</u> and <u>send data to our server</u> about where and when you see interventions.\n
  #         \n<b>Icons: </b>A <habitlab-logo style='zoom: 0.5;  padding-left: 5px; padding-right: 5px; display: inline-block'></habitlab-logo> is placed on every intervention, so you can easily identify which elements are from HabitLab. Click the gear to get more information or disable the intervention.\n
  #         Click the <iron-icon icon='info-outline' style='margin-top: -3px; padding-left: 5px; padding-right: 5px'></iron-icon> in the top right to see this window again. 
  #         \n\nClick OK to begin selecting your goals!
  #         ", 'animation': false, 'allowOutsideClick': false, 'allowEscapeKey': true}
  ready: ->
    self = this
    is_habitlab_enabled().then (is_enabled) -> self.is_habitlab_disabled = !is_enabled
  #  self.once_available '#optionstab', ->
  #    self.S('#optionstab').prop('selected', 0)
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
