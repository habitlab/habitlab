Polymer({
  is: 'intervention-editor-tutorial'
  properties: {
    default_code: {
      type: Object
      value: {
        hello_world_editor: '''
        alert("Hello World");
        '''
        flip_page_editor: '''
        document.body.style.transform = 'rotate(180deg)';
        '''
      }
    }
  }
  demo_clicked: (evt) ->
    editor_name = evt.target.getAttribute('srcname')
    code = this.default_code[editor_name]
    console.log code
  ready: ->>
    self = this
    brace = await SystemJS.import('brace')
    await SystemJS.import('brace/mode/javascript')
    await SystemJS.import('brace/ext/language_tools')
    brace.acequire('ace/ext/language_tools')
    editor_list = Object.keys(this.default_code)
    for editor_name in editor_list
      js_editor = brace.edit(self.$$('#' + editor_name))
      js_editor.setOptions({
        enableBasicAutocompletion: true
        enableSnippets: true
        enableLiveAutocompletion: true
      });
      js_editor.getSession().setMode('ace/mode/javascript')
      js_editor.getSession().setTabSize(2)
      js_editor.getSession().setUseSoftTabs(true)
      js_editor.setValue(this.default_code[editor_name].trim())
})
