{cfy} = require 'cfy'

{polymer_ext} = require 'libs_frontend/polymer_utils'

{
  add_new_intervention
} = require 'libs_backend/intervention_utils'

{
  as_array
} = require 'libs_common/collection_utils'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

get_livescript = memoizeSingleAsync cfy ->*
  yield SystemJS.import('livescript15')

get_list_requires = memoizeSingleAsync cfy ->*
  yield SystemJS.import('list_requires')

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
  save_intervention: cfy ->*
    code = this.js_editor.getSession().getValue()
    list_requires = yield get_list_requires()
    dependencies = list_requires(code)
    new_code = """
    SystemJS.import('libs_common/systemjs_require').then(function(systemjs_require) {
      systemjs_require.make_require(#{JSON.stringify(dependencies)}).then(function(require) {
        #{code}
      })
    })
    """
    intervention_info = {
      name: this.$.intervention_name.value
      displayname: this.$.intervention_name.value
      description: this.$.intervention_description.value
      domain: this.$.intervention_domain.value
      preview: this.$.intervention_preview_url.value
      matches: [this.$.intervention_domain.value]
      content_scripts: [
        {
          code: new_code
        }
      ]
      goals: [this.$.goal_selector.selectedItem.goal_info]
      # TODO: set goals to the goal that it satisfies
    }
    yield add_new_intervention(intervention_info)
    return
  goal_selector_changed: cfy (change_info) ->*
    goal_info = change_info.detail.item.goal_info
    this.$.intervention_domain.value = goal_info.domain
    preview_page = goal_info.preview ? goal_info.homepage
    this.$.intervention_preview_url.value = preview_page
  preview_intervention: cfy ->*
    yield this.save_intervention()
    intervention_name = this.$.intervention_name.value
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
    enabled_goals = as_array(yield get_enabled_goals())
    self.goal_info_list = [all_goals[x] for x in enabled_goals]
}
