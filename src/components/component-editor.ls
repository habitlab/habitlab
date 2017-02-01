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

{
  add_custom_component
  remove_custom_component
  list_custom_components
  get_custom_component_info
} = require 'libs_backend/component_utils'

swal = require 'sweetalert2'

get_livescript = memoizeSingleAsync cfy ->*
  yield SystemJS.import('livescript15')

polymer_ext {
  is: 'component-editor'
  properties: {
    component_name: {
      type: String
    }
    component_list: {
      type: Array
    }
    component_info: {
      type: Object
    }
  }
  component_selector_changed: cfy (change_info) ->*
    component_name = change_info.detail.item.component_name
    this.component_name = component_name
    this.component_info = component_info = yield get_custom_component_info(component_name)
    this.js_editor.setValue(component_info.js)
    this.html_editor.setValue(component_info.html)
    console.log component_name
  save_component: cfy ->*
    console.log this.component_name
  preview_component: cfy ->*
    console.log this.component_name
  get_component_name: ->
    return this.$.component_selector.selectedItem.component_name
  delete_component: cfy ->*
    component_name = this.get_component_name()
    if not component_name?
      return
    try
      yield swal {
        title: 'Are you sure you want to delete ' + component_name
        text: 'You will not be able to revert this'
        type: 'warning'
        showCancelButton: true
        confirmButtonColor: '#3085d6'
        cancelButtonColor: '#d33'
        confirmButtonText: 'Yes, delete it!'
      }
    catch
      return
    remove_custom_component(component_name)
    yield this.refresh_component_list()
    this.$.component_selector.selected = 0
  prompt_new_component: cfy ->*
    self = this
    new_component_name = null
    cancelable = this.component_list.length > 0
    all_components = yield list_custom_components()
    while true
      try
        new_component_name := yield swal {
          title: 'Enter a new component name'
          input: 'text'
          inputValue: 'custom-component'
          showCancelButton: false
          preConfirm: (proposed_component_name) ->
            return new Promise (resolve, reject) ->
              if proposed_component_name.indexOf(' ') != -1
                reject('Cannot contain spaces')
                return
              if proposed_component_name.indexOf('-') == -1
                reject('Must contain at least one dash (-)')
                return
              if proposed_component_name == ''
                reject('Must be non-empty')
                return
              if all_components.indexOf(proposed_component_name) != -1
                reject('A component with this name already exists')
                return
              resolve()
        }
      catch
        if cancelable
          return
      if new_component_name?
        break
    component_info = {
      name: new_component_name
      html: """
      <dom-module>
      </dom-module>
      """
      js: """
      Polymer({

      })
      """
    }
    yield add_custom_component(component_info)
    yield this.refresh_component_list()
    this.select_component_by_name(new_component_name)
  select_component_by_name: (component_name) ->
    component_idx = this.component_list.indexOf(component_name)
    this.$.component_selector.selected = component_idx
  refresh_component_list: cfy ->*
    this.component_list = yield list_custom_components()
    if this.component_list.length == 0
      this.prompt_new_component()
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
    self.html_editor = html_editor = brace.edit('html_editor')
    html_editor.getSession().setMode('ace/mode/html')
    html_editor.setTheme('ace/theme/monokai')
    html_editor.$blockScrolling = Infinity
    #ls_editor.on 'change', ->
    #  self.ls_editor_changed()
    #all_goals = yield get_goals()
    #enabled_goals = as_array(yield get_enabled_goals())
    #self.goal_info_list = [all_goals[x] for x in enabled_goals]
    #goals_list = yield list_all_goals()
    #self.goal_info_list = [all_goals[x] for x in goals_list]
    yield load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
    yield self.refresh_component_list()
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
  ]
}
