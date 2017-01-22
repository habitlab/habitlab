{cfy} = require 'cfy'

{polymer_ext} = require 'libs_frontend/polymer_utils'

{
  add_new_intervention
} = require 'libs_backend/intervention_utils'

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
  }
  get_livescript: cfy ->*
    self = this
    if self.livescript?
      return self.livescript
    self.livescript = yield SystemJS.import('livescript15')
    return self.livescript
  ls_editor_changed: cfy ->*
    self = this
    ls_text = self.ls_editor.getValue()
    ls_compiler = yield self.get_livescript()
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
    console.log 'save button pressed'
    intervention_info = {
      name: this.$.intervention_name.value
      displayname: this.$.intervention_name.value
      description: this.$.intervention_description.value
      domain: this.$.intervention_domain.value
      matches: [this.$.intervention_domain.value]
      content_scripts: [
        {
          code: this.js_editor.getSession().getValue()
        }
      ]
      # TODO: set goals to the goal that it satisfies
    }
    console.log intervention_info
    yield add_new_intervention(intervention_info)
    return
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
  
}
