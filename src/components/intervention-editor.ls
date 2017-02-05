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
  compile_intervention_code
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

polymer_ext {
  is: 'intervention-editor'
  properties: {
    width: {
      type: String
      value: '38px'
    }
    height: {
      type: String
      value: '38px'
    }
    goal_info_list: {
      type: Array
    }
    intervention_list: {
      type: Array
    }
    intervention_info: {
      type: Object
    }
  }
  ls_editor_changed: cfy ->*
    self = this
    ls_text = self.ls_editor.getValue()
    ls_compiler = yield get_livescript()
    try
      js_text = ls_compiler.compile(ls_text, {bare: true, header: false})
      self.js_editor.getSession().setValue(js_text)
      self.ls_editor.getSession().clearAnnotations()
    catch e
      if e?hash?line?
        self.ls_editor.getSession().setAnnotations([
          {
            row: e.hash.line
            text: e.message
            type: 'error'
          }
        ])
      console.log e
  get_intervention_name: ->
    # return this.$.intervention_name.value
    return this.$.intervention_selector.selectedItem.intervention_name
  save_intervention: cfy ->*
    code = this.js_editor.getSession().getValue().trim()
    lscode = this.ls_editor.getSession().getValue().trim()
    intervention_info = {
      code: code
      name: this.get_intervention_name()
      displayname: this.get_intervention_name()
      description: this.$.intervention_description.value
      domain: this.$.intervention_domain.value
      preview: this.$.intervention_preview_url.value
      matches: [this.$.intervention_domain.value]
      #css_files: required_css_files
      #styles: dependencies.require_style
      /*
      content_scripts: [
        {
          code: code
          run_at: 'document_start'
          jspm_require: true
          #jspm_deps: required_jspm_deps
        }
      ]
      */
      edit_mode: this.get_edit_mode()
      goals: [this.$.goal_selector.selectedItem.goal_info]
      custom: true
    }
    if not (yield compile_intervention_code(intervention_info))
      return false
    #if not (yield add_requires_to_intervention_info(intervention_info))
    #  return false
    if lscode.length > 0 and (intervention_info.edit_mode == 'ls' or intervention_info.edit_mode == 'ls_and_js')
      intervention_info.livescript_code = lscode
    this.intervention_info = intervention_info
    yield add_new_intervention(intervention_info)
    return true
  intervention_selector_changed: cfy (change_info) ->*
    intervention_name = change_info.detail.item.intervention_name
    this.intervention_info = intervention_info = yield get_intervention_info(intervention_name)
    goal_name = intervention_info.goals[0].name
    goal_names_list = this.goal_info_list.map (.name)
    goal_idx = goal_names_list.indexOf(goal_name)
    this.$.goal_selector.selected = goal_idx
    edit_mode_idx = switch intervention_info.edit_mode
    | 'ls_and_js' => 0
    | 'ls' => 1
    | 'js' => 2
    | _ => 0
    this.$.language_selector.selected = edit_mode_idx
    this.set_edit_mode intervention_info.edit_mode
    this.js_editor.setValue(intervention_info.code)
    if intervention_info.livescript_code?
      this.ls_editor.setValue(intervention_info.livescript_code)
  goal_selector_changed: cfy (change_info) ->*
    if not this.intervention_info?
      return
    goal_info = change_info.detail.item.goal_info
    goal_name = this.intervention_info.goals[0].name
    if goal_info.name == goal_name
      this.$.intervention_domain.value = this.intervention_info.domain
      this.$.intervention_preview_url.value = this.intervention_info.preview
      return
    this.$.intervention_domain.value = goal_info.domain
    preview_page = goal_info.preview ? goal_info.homepage
    this.$.intervention_preview_url.value = preview_page
  language_selector_changed: cfy (change_info) ->*
    lang = change_info.detail.item.lang
    this.set_edit_mode(lang)
  get_edit_mode: ->
    return this.$.language_selector.selectedItem.lang
  set_edit_mode: (lang) ->
    self = this
    lse = this.S('#livescript_editor')
    jse = this.S('#javascript_editor')
    if not this.ls_editor? or not this.js_editor
      setTimeout ->
        self.set_edit_mode(lang)
      , 500
      return
    lslen = this.ls_editor.getSession().getLength()
    jslen = this.js_editor.getSession().getLength()
    if lang == 'ls_and_js'
      jse.css {
        width: 'calc(50vw - 10px)'
        display: 'inline-block'
      }
      lse.css {
        width: 'calc(50vw - 10px)'
        display: 'inline-block'
      }
      self.js_editor.focus()
      self.js_editor.setValue(self.js_editor.getValue())
      self.js_editor.gotoLine(jslen)
      self.ls_editor.focus()
      self.ls_editor.setValue(self.ls_editor.getValue())
      self.ls_editor.gotoLine(lslen)
      self.js_editor.setReadOnly(true)
      self.ls_editor.setReadOnly(false)
    else if lang == 'ls'
      jse.css {
        width: '0px'
        display: 'none'
      }
      lse.css {
        width: 'calc(100vw - 20px)'
        display: 'inline-block'
      }
      self.ls_editor.focus()
      self.ls_editor.setValue(self.ls_editor.getValue())
      self.ls_editor.gotoLine(lslen)
      self.js_editor.setReadOnly(true)
      self.ls_editor.setReadOnly(false)
    else if lang == 'js'
      jse.css {
        width: 'calc(100vw - 20px)'
        display: 'inline-block'
      }
      lse.css {
        width: '0px'
        display: 'none'
      }
      self.js_editor.focus()
      self.js_editor.setValue(self.js_editor.getValue())
      self.js_editor.gotoLine(jslen)
      self.ls_editor.setReadOnly(true)
      self.js_editor.setReadOnly(false)
  delete_intervention: cfy ->*
    intervention_name = this.get_intervention_name()
    if not intervention_name
      return
    try
      yield swal {
        title: 'Are you sure you want to delete ' + intervention_name
        text: 'You will not be able to revert this'
        type: 'warning'
        showCancelButton: true
        confirmButtonColor: '#3085d6'
        cancelButtonColor: '#d33'
        confirmButtonText: 'Yes, delete it!'
      }
    catch
      return
    remove_custom_intervention(intervention_name)
    yield this.refresh_intervention_list()
    this.$.intervention_selector.selected = 0
  prompt_new_intervention: cfy ->*
    self = this
    new_intervention_name = null
    cancelable = this.intervention_list.length > 0
    all_interventions = yield list_all_interventions()
    while true
      try
        new_intervention_name := yield swal {
          title: 'Enter a new intervention name'
          input: 'text'
          inputValue: 'my_custom_intervention'
          showCancelButton: false
          preConfirm: (proposed_intervention_name) ->
            return new Promise (resolve, reject) ->
              if proposed_intervention_name.indexOf(' ') != -1
                reject('Cannot contain spaces')
                return
              if proposed_intervention_name == ''
                reject('Must be non-empty')
                return
              if all_interventions.indexOf(proposed_intervention_name) != -1
                reject('An intervention with this name already exists')
                return
              resolve()
        }
      catch
        if cancelable
          return
      if new_intervention_name?
        break
    all_goals = yield get_goals()
    comment_section = """/*
    LiveScript code is displayed on the left side,
    which is compiled to JavaScript on the right.
    To learn LiveScript, see http://livescript.net/

    If you would prefer to write in JavaScript,
    select JavaScript from the dropdown menu above.
    To learn JavaScript, see https://www.javascript.com/try

    This sample intervention will display a popup with SweetAlert.
    Click the 'Try Now' button to see it run.

    To learn how to write HabitLab interventions, see
    https://github.com/habitlab/habitlab/wiki/Writing-Interventions-within-HabitLab

    require_package: returns an NPM module, and ensures that the CSS it uses is loaded
    https://github.com/habitlab/habitlab/wiki/require_package
    */

    """
    js_code = comment_section + '''

    var swal = require_package('sweetalert2');
    swal({
      title: 'Hello World',
      text: 'This is a sample intervention'
    });
    '''
    intervention_info = {
      name: new_intervention_name
      displayname: new_intervention_name
      description: 'Describe your intervention here'
      domain: 'www.buzzfeed.com'
      preview: 'https://www.buzzfeed.com/'
      matches: ['www.buzzfeed.com']
      code: js_code
      content_scripts: [
        {
          code: """
          var co = require('co');
          co(function*() {
            var swal = require("sweetalert2");
            yield require("libs_common/content_script_utils").load_css_file("sweetalert2");
            swal({title: "Hello World", text: "This is a sample intervention"});
          })
          """
          jspm_require: true
          #jspm_deps: [
          #  'sweetalert2'
          #  'co'
          #  'libs_common/content_script_utils'
          #]
        }
      ]
      livescript_code: comment_section + '''

      swal = require_package('sweetalert2')

      swal({
        title: 'Hello World'
        text: 'This is a sample intervention'
      })
      '''
      edit_mode: 'ls_and_js'
      goals: [
        all_goals['buzzfeed/spend_less_time']
      ]
      custom: true
    }
    yield add_new_intervention(intervention_info)
    yield this.refresh_intervention_list()
    this.select_intervention_by_name(new_intervention_name)
  select_intervention_by_name: (intervention_name) ->
    intervention_idx = this.intervention_list.indexOf(intervention_name)
    this.$.intervention_selector.selected = intervention_idx
  refresh_intervention_list: cfy ->*
    this.intervention_list = yield list_custom_interventions()
    if this.intervention_list.length == 0
      this.prompt_new_intervention()
  preview_intervention: cfy ->*
    if not (yield this.save_intervention())
      return
    intervention_name = this.get_intervention_name()
    set_override_enabled_interventions_once intervention_name
    preview_page = this.$.intervention_preview_url.value
    chrome.tabs.create {url: preview_page}
  ready: cfy ->*
    self = this
    brace = yield SystemJS.import('brace')
    yield SystemJS.import('brace/mode/javascript')
    yield SystemJS.import('brace/mode/livescript')
    yield SystemJS.import('brace/theme/monokai')
    self.js_editor = js_editor = brace.edit('javascript_editor')
    js_editor.getSession().setMode('ace/mode/javascript')
    js_editor.setTheme('ace/theme/monokai')
    js_editor.$blockScrolling = Infinity
    self.ls_editor = ls_editor = brace.edit('livescript_editor')
    ls_editor.getSession().setMode('ace/mode/livescript')
    ls_editor.setTheme('ace/theme/monokai')
    ls_editor.$blockScrolling = Infinity
    ls_editor.on 'change', ->
      self.ls_editor_changed()
    all_goals = yield get_goals()
    #enabled_goals = as_array(yield get_enabled_goals())
    #self.goal_info_list = [all_goals[x] for x in enabled_goals]
    goals_list = yield list_all_goals()
    self.goal_info_list = [all_goals[x] for x in goals_list]
    yield load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
    yield self.refresh_intervention_list()
    setTimeout ->
      if self.intervention_info?edit_mode?
        self.set_edit_mode(self.intervention_info.edit_mode)
    , 500
    # preload libraries which take forever to load
    SystemJS.import('libs_backend/sweetjs_utils')
    SystemJS.import('sweetjs-min')
    get_livescript()
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
  ]
}
