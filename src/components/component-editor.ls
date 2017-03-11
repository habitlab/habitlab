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
    this.set_js_edit_mode(component_info.js_edit_mode)
    this.set_html_edit_mode(component_info.html_edit_mode)
  set_js_edit_mode: (js_edit_mode) ->
    self = this
    jslen = self.js_editor.getSession().getLength()
    self.js_editor.focus()
    self.js_editor.setValue(self.js_editor.getValue())
    self.js_editor.gotoLine(jslen)
  set_html_edit_mode: (html_edit_mode) ->
    self = this
    htmllen = self.html_editor.getSession().getLength()
    self.html_editor.focus()
    self.html_editor.setValue(self.html_editor.getValue())
    self.html_editor.gotoLine(htmllen)
  save_component: cfy ->*
    js_code = this.js_editor.getSession().getValue().trim()
    html_code = this.html_editor.getSession().getValue().trim()
    component_info = {
      name: this.get_component_name()
      html: html_code
      js: js_code
      js_edit_mode: 'js'
      html_edit_mode: 'html'
    }
    yield add_custom_component(component_info)
    return true
  preview_component: cfy ->*
    if not (yield this.save_component())
      return
    component_name = this.get_component_name()
    preview_page = chrome.extension.getURL('/index.html?tag=' + component_name)
    chrome.tabs.create {url: preview_page}
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
    component_name = null
    cancelable = this.component_list.length > 0
    all_components = yield list_custom_components()
    while true
      try
        component_name := yield swal {
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
      if component_name?
        break
    component_info = {
      name: component_name
      html: """
      <dom-module id="#{component_name}">
        <style>
          .white_on_black {
            color: white;
            background-color: black;
          }
        </style>
        <template>
          <div class="white_on_black">
            You've been here for {{seconds_elapsed}} seconds
          </div>
        </template>
      </dom-module>
      """
      js: """
      Polymer({
        is: '#{component_name}',
        properties: {
          seconds_elapsed: {
            type: Number,
            value: 0
          }
        },
        ready: function() {
          var self = this
          setInterval(function() {
            self.seconds_elapsed += 1
          }, 1000)
        }
      })
      """
      js_edit_mode: 'js'
      html_edit_mode: 'html'
    }
    yield add_custom_component(component_info)
    yield this.refresh_component_list()
    this.select_component_by_name(component_name)
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
    self.js_editor = js_editor = brace.edit(this.$.javascript_editor)
    js_editor.getSession().setMode('ace/mode/javascript')
    js_editor.setTheme('ace/theme/monokai')
    js_editor.$blockScrolling = Infinity
    self.html_editor = html_editor = brace.edit(this.$.html_editor)
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
