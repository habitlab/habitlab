{polymer_ext} = require 'libs_frontend/polymer_utils'
{load_css_file} = require 'libs_common/content_script_utils'
{cfy} = require 'cfy'
swal = require 'sweetalert2'
require 'components/habitlab-logo.deps'
require 'bower_components/iron-icon/iron-icon.deps.js'

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
  }
  listeners: {
    goal_changed: 'on_goal_changed'
  }
  set_selected_tab_by_name: (selected_tab_name) ->
    selected_tab_idx = switch selected_tab_name
    | 'results' => 0
    | 'dashboard' => 0
    | 'goals' => 1
    | 'interventions' => 1
    | 'configure' => 1
    | 'config' => 1
    | 'manage' => 1
    | 'introduction' => 1
    if selected_tab_idx != -1
      this.selected_tab_idx = selected_tab_idx
  compute_selected_tab_name: (selected_tab_idx) ->
    return ['results', 'goals'][selected_tab_idx]
  selected_tab_name_changed: (selected_tab_name) ->
    this.fire 'options_selected_tab_changed', {selected_tab_name}
  on_goal_changed: (evt) ->
    this.$$('#options-interventions').on_goal_changed(evt.detail)
    this.$$('#dashboard-view').on_goal_changed(evt.detail)
  icon_clicked: cfy ->*
    
    console.log \icon_clicked
    yield load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
    yield swal {'title':"Welcome to HabitLab!", 'text': "\nHabitLab is a Chrome Extension that will help prevent you from getting distracted on the web. \n\n
          
          Some other information:\n\n
          <b>Privacy: </b>In order to optimize your interventions, HabitLab needs to <b>modify your webpages</b> and <b>send data to our server about where and when you see interventions</b>.\n
          \n<b>Icons: </b>A <iron-icon icon='settings' style='margin-top: -3px; padding-left: 5px; padding-right: 5px'></iron-icon> is placed on every intervention, so you can easily identify which elements are from HabitLab. Click the gear to get more information or disable the intervention.\n
          Click the <iron-icon icon='info-outline' style='margin-top: -3px; padding-left: 5px; padding-right: 5px'></iron-icon> in the top right to see this window again. Best of luck achieving your internet goals!
          ", 'animation': false, 'allowOutsideClick': false, 'allowEscapeKey': true}
  #ready: ->
  #  self = this
  #  self.once_available '#optionstab', ->
  #    self.S('#optionstab').prop('selected', 0)
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'once_available'
  ]
}
