{polymer_ext} = require 'libs_frontend/polymer_utils'

{
  add_new_intervention
  set_override_enabled_interventions_once
  list_custom_interventions
  remove_custom_intervention
  list_all_interventions
  get_intervention_info
  get_interventions
  clear_cache_all_interventions
  get_enabled_interventions
  set_intervention_disabled
  set_intervention_enabled
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

{
  once_true
  sleep
} = require 'libs_common/common_libs'

{
  get_active_tab_id
  list_currently_loaded_interventions
} = require 'libs_backend/background_common'

{
  open_debug_page_for_tab_id
} = require 'libs_backend/debug_console_utils'

{get_goal_info} = require 'libs_common/goal_utils'

{
  upload_intervention
} = require 'libs_backend/intervention_sharing_utils' 

{
  systemjsget
} = require 'libs_backend/cacheget_utils'

swal = require 'sweetalert2'
lodash = require 'lodash'

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
    js_editors: {
      type: Object
      value: {}
    }
    opened_intervention_list:{
      type:Array
      value:[]
      observer: 'opened_intervention_list_changed'
    }
    selected_tab_idx: {
      type:Number
      value:0
      observer: 'selected_tab_idx_changed'
    }
    pill_button_idx: {
      type:Number
    }
    pill_button_idxes: {
      type: Object
      value: {}
    }
    is_tutorial_shown: {
      type: Boolean
      value: true
    }
    is_apidoc_shown: {
      type: Boolean
      value: false
      observer: 'is_apidoc_shown_changed'
    }
    is_on_tutorial_tab: {
      type: Boolean
      computed: 'compute_is_on_tutorial_tab(is_tutorial_shown, selected_tab_idx)'
    }
    api_markdown_text: {
      type: String
    }
  }
  is_apidoc_shown_changed: (is_apidoc_shown) ->
    if is_apidoc_shown
      this.SM('.resizable_editor_div').removeClass('editor_div_wide').addClass('editor_div_narrow')
    else
      this.SM('.resizable_editor_div').removeClass('editor_div_narrow').addClass('editor_div_wide')
  hide_docs_clicked: ->
    this.is_apidoc_shown = false
  show_docs_clicked: ->
    this.is_apidoc_shown = true
  compute_is_on_tutorial_tab: (is_tutorial_shown, selected_tab_idx) ->
    return is_tutorial_shown and (selected_tab_idx == 0)
  pill_button_selected: (evt) ->
    if evt.detail.buttonidx == 0 
      set_intervention_disabled(this.get_intervention_name())
      this.pill_button_idx=this.pill_button_idxes[this.get_intervention_name()]=0
    else
      set_intervention_enabled(this.get_intervention_name())
      this.pill_button_idx=this.pill_button_idxes[this.get_intervention_name()]=1     
  selected_tab_idx_changed: ->>
    while not this.get_intervention_name()?
      await sleep(100)
    this.pill_button_idx=this.pill_button_idxes[this.get_intervention_name()]
  get_intervention_name: ->
    if this.opened_intervention_list?
      # if this.is_tutorial_shown
      #   return this.opened_intervention_list[this.selected_tab_idx - 1]
      # return this.opened_intervention_list[this.selected_tab_idx]
      return this.opened_intervention_list[this.selected_tab_idx - 1]
  # download_code: ->
  #   edit_mode = this.get_edit_mode()
  #   if edit_mode == 'ls' or edit_mode == 'ls_and_js'
  #     code = this.ls_editor.getSession().getValue().trim()
  #   else
  #     code = this.js_editor.getSession().getValue().trim()
  #   element = document.createElement('a')
  #   element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code))
  #   element.setAttribute('download', 'intervention.txt')
  #   element.style.display = 'none'
  #   document.body.appendChild(element);
  #   element.click();
  #   document.body.removeChild(element);
  save_intervention: ->>
    self=this
    intervention_name = self.get_intervention_name() 
    js_editor = this.js_editors[intervention_name]
    code = js_editor.getSession().getValue().trim()
    intervention_info = await get_intervention_info(intervention_name)
    display_name=intervention_name.replace new RegExp('_', 'g'), ' '
    new_intervention_info = {
      code: code
      name: intervention_name
      displayname: display_name
      description: intervention_info.description
      domain: intervention_info.domain
      preview: intervention_info.preview
      matches: [intervention_info.domain]
      sitename: intervention_info.sitename
      sitename_printable: intervention_info.sitename_printable
      goals: intervention_info.goals
      custom: true
    }
    if not (await compile_intervention_code(new_intervention_info))
      return false
    self.intervention_info = new_intervention_info
    await add_new_intervention(new_intervention_info)
    localStorage['saved_intervention_' + intervention_name] = new_intervention_info.code
    return true
  close_tab_clicked: (evt)->
    # close_tab_name evt.path[1].id.substring(4)
    # if this.is_tutorial_shown
    #   this.opened_intervention_list.splice this.selected_tab_idx-1, 1
    # else
    #   this.opened_intervention_list.splice this.selected_tab_idx, 1
    intervention_idx = this.selected_tab_idx - 1
    intervention_name = this.opened_intervention_list[intervention_idx]
    if this.js_editors[intervention_name]?
      delete this.js_editors[intervention_name]
    opened_intervention_list = JSON.parse JSON.stringify this.opened_intervention_list
    opened_intervention_list.splice intervention_idx - 1, 1
    if opened_intervention_list.length == 0
      this.is_tutorial_shown = true
    this.opened_intervention_list = opened_intervention_list
    this.selected_tab_idx=this.opened_intervention_list.length
  close_tutorial_clicked :(evt)->
    self = this
    if self.opened_intervention_list.length == 0
      return
    self.is_tutorial_shown=false
    if self.selected_tab_idx == 0
      self.selected_tab_idx = 1
  delete_current_intervention: ->>
    intervention_name = this.get_intervention_name()
    if intervention_name?
      this.opened_intervention_list.splice this.selected_tab_idx-1, 1
      # if this.is_tutorial_shown
      #   this.opened_intervention_list.splice this.selected_tab_idx-1, 1
      # else
      #   this.opened_intervention_list.splice this.selected_tab_idx, 1
      this.opened_intervention_list = JSON.parse JSON.stringify this.opened_intervention_list
      remove_custom_intervention(intervention_name)
      delete this.js_editors[intervention_name]
      await this.refresh_intervention_list()
    return
  delete_intervention: ->>
    intervention_name = this.get_intervention_name()
    if not intervention_name
      return
    try
      await swal {
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
    await this.delete_current_intervention()
    if this.opened_intervention_list.length == 0
      this.is_tutorial_shown = true
    this.selected_tab_idx=this.opened_intervention_list.length
  add_new_intervention_clicked: ->
    self = this
    create_intervention_dialog = document.createElement('create-intervention-dialog')
    document.body.appendChild(create_intervention_dialog)
    create_intervention_dialog.goal_info_list = this.goal_info_list
    create_intervention_dialog.open_create_new_intervention_dialog()
    create_intervention_dialog.addEventListener 'display_new_intervention', (evt) ->
      self.display_new_intervention(evt.detail)
    # chrome.tabs.create({url: chrome.extension.getURL('index.html?tag=intervention-editor-onboard')});
  open_custom_intervention_clicked: ->
    self=this
    create_intervention_dialog = document.createElement('create-intervention-dialog')
    document.body.appendChild(create_intervention_dialog)
    create_intervention_dialog.intervention_list=this.intervention_list
    create_intervention_dialog.open_existing_custom_intervention_dialog()
    create_intervention_dialog.addEventListener 'display_intervention', (evt) ->
      self.display_intervention(evt.detail)
  display_template_by_name: (template_name) ->>
    self=this
    code=await systemjsget(chrome.runtime.getURL('/intervention_templates/'+template_name+'/frontend.js'))
    idx=template_name.indexOf '/'
    if idx!=-1
      short_template_name=template_name.slice idx+1
      new_intervention_name='custom_'+short_template_name
    intervention_info=await get_intervention_info(template_name)
    if intervention_info.goals.length>0
      goal_info=await get_goal_info(intervention_info.goals[0])
    else
      goal_info=await get_goal_info('youtube/spend_less_time')
    display_name=new_intervention_name.replace new RegExp('_', 'g'), ' '
    intervention_info={
      name:new_intervention_name
      description: intervention_info.description
      displayname: display_name
      domain: goal_info.domain
      preview: goal_info.preview
      matches: [goal_info.domain]
      sitename: goal_info.sitename
      sitename_printable: goal_info.sitename_printable
      custom: true
      code: code
      content_scripts:code
      goals: [goal_info.name] 
    }
    await add_new_intervention(intervention_info)
    await this.refresh_intervention_list()
    this.opened_intervention_list.push new_intervention_name
    this.opened_intervention_list = JSON.parse JSON.stringify this.opened_intervention_list
    this.once_available '#editor_' + new_intervention_name, (result) ->
      self.make_javascript_editor(result)
  display_intervention_by_name: (intervention_name) ->>
    self=this
    if not this.opened_intervention_list.includes intervention_name
      intervention_info = await get_intervention_info(intervention_name)
      if not intervention_info?
        return
      this.intervention_info = intervention_info
      localStorage['saved_interventions_' + intervention_name] = this.intervention_info.code
      autosaved_code = localStorage['autosaved_intervention_' + intervention_name]
      if autosaved_code? and (autosaved_code != intervention_info.code)
        try
          await swal({
            title: 'Restore autosaved version?',
            text: 'You closed '+localStorage['last_opened_intervention']+' without saving it. Do you want to restore the autosaved version?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No'
            confirmButtonText: 'Restore'
          })
          intervention_info.code = autosaved_code
          localStorage['saved_intervention_' + intervention_name] = autosaved_code
          delete localStorage['autosaved_intervention_' + intervention_name]
          await add_new_intervention(intervention_info)
        catch
          delete localStorage['autosaved_intervention_' + intervention_name]
      this.opened_intervention_list.push intervention_name
      new_opened_intervention_list = JSON.parse JSON.stringify this.opened_intervention_list
      this.set('opened_intervention_list', [])
      this.set('opened_intervention_list', new_opened_intervention_list)
      once_true ->
        self.js_editors[intervention_name]?
      , ->
        self.js_editors[intervention_name].setValue(intervention_info.code)
      # if this.is_tutorial_shown
      #   this.selected_tab_idx=this.opened_intervention_list.length
      # else
      #   this.selected_tab_idx=this.opened_intervention_list.length-1
      this.selected_tab_idx=this.opened_intervention_list.length
  display_intervention: (intervention_data) ->
    intervention_name = intervention_data.intervention_name
    this.display_intervention_by_name(intervention_name)
  info_clicked: ->
    self=this
    create_intervention_dialog = document.createElement('create-intervention-dialog')
    document.body.appendChild(create_intervention_dialog)
    create_intervention_dialog.goal_info_list = this.goal_info_list 
    create_intervention_dialog.current_intervention = this.get_intervention_name()
    create_intervention_dialog.addEventListener 'modify_intervention_info', (evt) ->
      self.modify_intervention_info(evt.detail)
    create_intervention_dialog.open_edit_intervention_info_dialog() 
  modify_intervention_info: (data) ->>
    self=this
    intervention_info=await get_intervention_info(data.old_intervention_name)
    display_name=data.new_intervention_name.replace new RegExp('_', 'g'), ' '
    intervention_info={
      name:data.new_intervention_name
      displayname: display_name
      description: data.new_intervention_description
      domain: data.new_goal_info.domain
      preview: data.new_preview
      matches: [data.new_goal_info.domain]
      sitename: data.new_goal_info.sitename
      sitename_printable: data.new_goal_info.sitename_printable
      custom: true
      code: intervention_info.code
      content_scripts:intervention_info.code
      goals: [data.new_goal_info.name]  
    }
    await add_new_intervention(intervention_info)
    if data.old_intervention_name!=data.new_intervention_name
      this.delete_current_intervention()
      this.opened_intervention_list.push data.new_intervention_name
      this.opened_intervention_list = JSON.parse JSON.stringify this.opened_intervention_list
      this.once_available '#editor_' + data.new_intervention_name, (result) ->
        self.make_javascript_editor(result)
    await this.refresh_intervention_list()
  display_new_intervention: (new_intervention_data) ->>
    self = this
    new_intervention_name = new_intervention_data.intervention_name
    goal_info = new_intervention_data.goal_info
    comment_section = """/*
    This intervention is written in JavaScript.
    To learn JavaScript, see https://www.javascript.com/try
    This sample intervention will display a popup with SweetAlert.
    Click the 'PREVIEW' button to see it run.
    To learn how to write HabitLab interventions, see
    https://habitlab.github.io/devdocs
    require_package: returns an NPM module, and ensures that the CSS it uses is loaded
    https://habitlab.github.io/devdocs?q=require_package
    */"""+'\n'
    display_name=new_intervention_name.replace new RegExp('_', 'g'), ' '
    intervention_info={
      name: new_intervention_name
      displayname: display_name
      description: new_intervention_data.intervention_description
      domain: goal_info.domain
      preview: new_intervention_data.preview_url
      matches: [goal_info.domain]
      sitename: goal_info.sitename
      sitename_printable: goal_info.sitename_printable
      custom: true
      code: comment_section + '''
    var swal = require_package('sweetalert2');
    swal({
      title: 'Hello World',
      text: 'This is a sample intervention'
    });
    '''
      content_scripts:{
          code: comment_section + '''
    var swal = require_package('sweetalert2');
    swal({
      title: 'Hello World',
      text: 'This is a sample intervention'
    });
    '''
      }
      goals: [goal_info.name]
    }
    await add_new_intervention(intervention_info)
    await this.refresh_intervention_list()
    this.opened_intervention_list.push new_intervention_name
    this.opened_intervention_list = JSON.parse JSON.stringify this.opened_intervention_list
    this.once_available '#editor_' + new_intervention_name, (result) ->
      self.make_javascript_editor(result)
    this.selected_tab_idx=this.opened_intervention_list.length
    # if this.is_tutorial_shown
    #   this.selected_tab_idx=this.opened_intervention_list.length
    # else
    #   this.selected_tab_idx=this.opened_intervention_list.length-1
  refresh_intervention_list: ->>
    this.intervention_list = await list_custom_interventions()
  preview_intervention: ->>
    self=this
    if not (await this.save_intervention())
      return
    intervention_name=self.get_intervention_name()
    intervention_info=await get_intervention_info(intervention_name)
    set_override_enabled_interventions_once intervention_name
    preview_url = intervention_info.preview
    if not preview_url?
      goal_info = await get_goal_info(intervention_info.goals[0])
      preview_url = goal_info.preview ? ('https://' + goal_info.domain + '/')
    chrome.tabs.create {url: preview_url}
  debug_intervention: ->>
    if not (await this.save_intervention())
      return
    intervention_name = this.get_intervention_name()
    set_override_enabled_interventions_once intervention_name
    intervention_info=await get_intervention_info(intervention_name)
    preview_url = intervention_info.preview
    if not preview_url?
      goal_info = await get_goal_info(intervention_info.goals[0])
      preview_url = goal_info.preview ? ('https://' + goal_info.domain + '/')
    tab = await new Promise -> chrome.tabs.create {url: preview_url}, it
    while true
      current_tab_id = await get_active_tab_id()
      if current_tab_id == tab.id
        break
      await sleep(100)
    while true
      loaded_interventions = await list_currently_loaded_interventions()
      if loaded_interventions.includes(intervention_name)
        break
      await sleep(100)
    await open_debug_page_for_tab_id(tab.id)
  # hide_or_show_sidebar: ->
  #   if this.S('#sidebar').is(":visible")
  #     this.S('#sidebar').hide()
  #   else
  #     this.S('#sidebar').show()
  help_clicked: ->
    # chrome.tabs.create {url: 'https://habitlab.github.io/devdocs'}
    this.is_tutorial_shown=true
    this.selected_tab_idx=0
  share_clicked: ->>
    # self=this
    # chrome.permissions.request {
    #   permissions: ['identity', 'identity.email']
    #   origins: []
    # }, (granted) -> 
    #   console.log 'granted: ' + granted
    #   return
    # intervention_name=self.get_intervention_name()
    # intervention_info = await get_intervention_info(intervention_name)
    # chrome.identity.getProfileUserInfo (author_info) ->>
    #   upload_result = await upload_intervention(intervention_info, author_info)
    #   if upload_result.status=='success'
    #     try
    #       await swal({
    #         title: 'Copy the url below to privately share your nudge. \n Click Submit for HabitLab developers to publish your nudge to all users.'
    #         text: upload_result.url
    #         type: 'info'
    #         showCancelButton: true
    #         confirmButtonText: 'Submit'
    #         cancelButtonText: 'No'
    #       })
    #     catch
    #       console.log 'not sharing this time'
    #       # TODO remove_intervention(intervention_name)
    #   return
    chrome.tabs.create {url: 'https://github.com/habitlab/habitlab/wiki/Share-Interventions'}
  make_javascript_editor: (editor_div) ->>
    intervention_name = editor_div.intervention_tab_name
    if intervention_name?
      self = this
      if self.js_editors[intervention_name]?
        return
      brace = await SystemJS.import('brace')
      await SystemJS.import('brace/mode/javascript')
      await SystemJS.import('brace/ext/language_tools')
      brace.acequire('ace/ext/language_tools')
      self.js_editors[intervention_name] = js_editor = brace.edit(editor_div)
      js_editor.setOptions({
        enableBasicAutocompletion: true
        enableSnippets: true
        enableLiveAutocompletion: true
        #autoScrollEditorIntoView: true
      });
      js_editor.getSession().setMode('ace/mode/javascript')
      js_editor.getSession().setTabSize(2)
      js_editor.getSession().setUseSoftTabs(true)
      js_editor.$blockScrolling = Infinity
      self.intervention_info = intervention_info = await get_intervention_info(intervention_name)
      js_editor.setValue(intervention_info.code)
  opened_intervention_list_changed: ->>
    self = this
    while true
      rendered_interventions = []
      editor_div_list = self.SM('.javascript_editor_div')
      for editor_div in editor_div_list
        intervention_name = editor_div.intervention_tab_name
        rendered_interventions.push(intervention_name)
      done_rendering = lodash.isEqual(self.opened_intervention_list, rendered_interventions)
      if done_rendering
        for editor_div in editor_div_list
          self.make_javascript_editor(editor_div)
        return
      else
        await sleep(100)
  ready: ->>
    self = this
    all_goals = await get_goals()    
    #enabled_goals = as_array(await get_enabled_goals())
    #self.goal_info_list = [all_goals[x] for x in enabled_goals]
    goals_list = await list_all_goals()
    self.goal_info_list = [all_goals[x] for x in goals_list]
    await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
    await self.refresh_intervention_list()
    enabled_interventions = await get_enabled_interventions()
    for intervention_name in self.intervention_list
      if enabled_interventions[intervention_name]
        self.pill_button_idxes[intervention_name]=1
      else
        self.pill_button_idxes[intervention_name]=0
    self.once_available_multiselect '.javascript_editor_div', (editor_divs) ->
      for editor_div in editor_divs
        self.make_javascript_editor(editor_div)
    new_intervention_info = localStorage.getItem('intervention_editor_new_intervention_info')
    if new_intervention_info?
      new_intervention_info = JSON.parse new_intervention_info
      localStorage.removeItem('intervention_editor_new_intervention_info')
      self.display_new_intervention(new_intervention_info)
    open_intervention_name=localStorage.getItem('intervention_editor_open_intervention_name')
    if open_intervention_name?
      open_intervention_name=JSON.parse open_intervention_name
      localStorage.removeItem('intervention_editor_open_intervention_name')
      self.display_intervention_by_name(open_intervention_name)
    open_template_name=localStorage.getItem('intervention_editor_open_template_name')
    if open_template_name?
      open_template_name=JSON.parse open_template_name
      localStorage.removeItem('intervention_editor_open_template_name')
      self.display_template_by_name(open_template_name)
    if (not new_intervention_info?) and (not open_intervention_name?) and (not open_template_name?) and localStorage.last_opened_intervention? and self.opened_intervention_list.length==0
      self.display_intervention_by_name(localStorage.last_opened_intervention)
    window.onbeforeunload = ->
      have_modifed_interventions = false
      for intervention_name,js_editor of self.js_editors
        intervention_text = js_editor.getSession().getValue().trim()
        localStorage['autosaved_intervention_' + intervention_name] = intervention_text
        if intervention_text != localStorage['saved_intervention_' + intervention_name]
          have_modifed_interventions = true
      last_opened_intervention = self.get_intervention_name()
      if last_opened_intervention?
        localStorage.last_opened_intervention = last_opened_intervention
      if have_modifed_interventions
        return true
      return
    systemjsget(chrome.runtime.getURL('API.md')).then (markdown_text) ->
      markdown_text = markdown_text.replace('### Table of Contents', '### API')
      #self.$.markdown_display.markdown = markdown_text
      self.api_markdown_text = markdown_text
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'SM'
    'once_available'
    'once_available_multiselect'
    'text_if_else'
  ]
}