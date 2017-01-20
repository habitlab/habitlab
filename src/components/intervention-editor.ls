{cfy} = require 'cfy'

{polymer_ext} = require 'libs_frontend/polymer_utils'

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
    self.livescript = yield System.import('livescript15')
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
      self.ls_editor.getSession().setAnnotations([
        {
          row: e.hash.line
          text: e.message
          type: 'error'
        }
      ])
      console.log e
  ready: cfy ->*
    self = this
    brace = yield System.import('brace')
    yield System.import('brace/mode/javascript')
    yield System.import('brace/mode/livescript')
    yield System.import('brace/theme/monokai')
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
