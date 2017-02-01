{cfy} = require 'cfy'

{polymer_ext} = require 'libs_frontend/polymer_utils'

{
  add_new_intervention
  set_override_enabled_interventions_once
  list_custom_interventions
  remove_custom_intervention
  list_all_interventions
  get_intervention_info
} = require 'libs_backend/intervention_utils'

{
  as_array
} = require 'libs_common/collection_utils'

{
  get_goals
  get_enabled_goals
  list_all_goals
} = require 'libs_backend/goal_utils'

{
  add_requires_to_intervention_info
} = require 'libs_backend/intervention_editor_utils'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  load_css_file
} = require 'libs_common/content_script_utils'

swal = require 'sweetalert2'

get_livescript = memoizeSingleAsync cfy ->*
  yield SystemJS.import('livescript15')

list_custom_components = cfy ->*
  return ['custom-component']

polymer_ext {
  is: 'component-editor'
  properties: {
    component_name: {
      type: String
    }
  }
  component_selector_changed: cfy (change_info) ->*
    component_name = change_info.detail.item.component_name
    this.component_name = component_name
    console.log component_name
  refresh_component_list: cfy ->*
    this.component_list = yield list_custom_components()
  ready: cfy ->*
    self = this
    brace = yield SystemJS.import('brace')
    yield SystemJS.import('brace/mode/javascript')
    yield SystemJS.import('brace/mode/livescript')
    yield SystemJS.import('brace/mode/html')
    yield SystemJS.import('brace/theme/monokai')
    self.js_editor = js_editor = brace.edit('javascript_editor')
    js_editor.getSession().setMode('ace/mode/javascript')
    js_editor.setTheme('ace/theme/monokai')
    js_editor.$blockScrolling = Infinity
    self.ls_editor = ls_editor = brace.edit('html_editor')
    ls_editor.getSession().setMode('ace/mode/html')
    ls_editor.setTheme('ace/theme/monokai')
    ls_editor.$blockScrolling = Infinity
    #ls_editor.on 'change', ->
    #  self.ls_editor_changed()
    #all_goals = yield get_goals()
    #enabled_goals = as_array(yield get_enabled_goals())
    #self.goal_info_list = [all_goals[x] for x in enabled_goals]
    #goals_list = yield list_all_goals()
    #self.goal_info_list = [all_goals[x] for x in goals_list]
    yield self.refresh_component_list()
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
  ]
}
