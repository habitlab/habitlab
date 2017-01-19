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
  ready: cfy ->*
    brace = yield System.import('brace')
    yield System.import('brace/mode/javascript')
    yield System.import('brace/mode/livescript')
    yield System.import('brace/theme/monokai')
    js_editor = brace.edit('javascript_editor')
    js_editor.getSession().setMode('ace/mode/javascript')
    js_editor.setTheme('ace/theme/monokai')
    ls_editor = brace.edit('livescript_editor')
    ls_editor.getSession().setMode('ace/mode/livescript')
    ls_editor.setTheme('ace/theme/monokai')
}
