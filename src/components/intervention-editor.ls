{yfy, add_noerr} = require 'cfy'
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
    }
  }

  have_unsaved_changes: ->
    window.onbeforeunload = ->
      swal('are you sure you want to exit?')
      return 'are you sure you want to exit?'
  no_unsaved_changes: ->
    window.onbeforeunload = null
  js_editor_changed: ->>
    self = this
    self.have_unsaved_changes()
  get_intervention_name: ->
    if this.opened_intervention_list?
      return this.opened_intervention_list[this.selected_tab_idx]
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
    # goal_info = this.$.goal_selector.selectedItem.goal_info
    new_intervention_info = {
      code: code
      name: intervention_name
      displayname: intervention_name
      description: intervention_info.description
      domain: intervention_info.domain
      preview: intervention_info.preview
      matches: intervention_info.matches
      sitename: intervention_info.sitename
      sitename_printable: intervention_info.sitename_printable
      goals: intervention_info.goals
      custom: true
    }
    if not (await compile_intervention_code(new_intervention_info))
      return false
    self.intervention_info = new_intervention_info
    await add_new_intervention(new_intervention_info)
    this.no_unsaved_changes()
    console.log('saving '+intervention_name+' completed...')
    return true
  delete_current_intervention: ->>
    console.log 'delete_current_intervention'
    intervention_name = this.get_intervention_name()
    this.opened_intervention_list.splice this.selected_tab_idx, 1
    this.opened_intervention_list = JSON.parse JSON.stringify this.opened_intervention_list
    remove_custom_intervention(intervention_name)
    delete this.js_editors[intervention_name]
    console.log intervention_name
    await this.refresh_intervention_list()
    console.log 'deleting '+intervention_name+' completed...'
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
    this.delete_current_intervention()
    # this.$.intervention_selector.selected = 0
  /*
  # goal_selector_changed: (change_info) ->
    # if not this.intervention_info?
    #   console.log('no intervention_info')
    #   return
    # console.log('this.intervention_info '+this.intervention_info)
    # goal_info = change_info.detail.item.goal_info
    # goal_name = this.intervention_info.goals[0]
    # console.log('goal_name'+goal_name)
    # if goal_info.name == goal_name
    #   this.$.intervention_domain.value = this.intervention_info.domain
    #   this.$.intervention_preview_url.value = this.intervention_info.preview
    #   return
    # this.$.intervention_domain.value = goal_info.domain
    # preview_page = goal_info.preview ? goal_info.homepage
    # this.$.intervention_preview_url.value = preview_page
  */
  add_new_intervention_clicked: ->
    self = this
    create_intervention_dialog = document.createElement('create-intervention-dialog')
    document.body.appendChild(create_intervention_dialog)
    create_intervention_dialog.goal_info_list = this.goal_info_list
    create_intervention_dialog.open_create_new_intervention_dialog()
    create_intervention_dialog.addEventListener 'display_new_intervention', (evt) ->
      self.display_new_intervention(evt.detail)
    console.log 'add_new_intervention_clicked completed...'
  open_custom_intervention_clicked: ->
    self=this
    create_intervention_dialog = document.createElement('create-intervention-dialog')
    document.body.appendChild(create_intervention_dialog)
    create_intervention_dialog.intervention_list=this.intervention_list
    create_intervention_dialog.open_existing_custom_intervention_dialog()
    create_intervention_dialog.addEventListener 'display_intervention', (evt) ->
      self.display_intervention(evt.detail)
    console.log 'open_existing_custom_intervention completed...'
  display_template_by_name: (template_name) ->>
    self=this
    code=await fetch(chrome.runtime.getURL('/intervention_templates/'+template_name+'/frontend.js')).then((.text!))
    idx=template_name.indexOf '/'
    if idx!=-1
      short_template_name=template_name.slice idx+1
      new_intervention_name='my_'+short_template_name
    intervention_info=await get_intervention_info(template_name)
    if intervention_info.goals.length>0
      goal_info=await get_goal_info(intervention_info.goals[0])
    else
      goal_info=await get_goal_info('youtube/spend_less_time')
    intervention_info={
      name:new_intervention_name
      description: intervention_info.description
      domain: goal_info.domain
      preview: goal_info.preview
      matches: goal_info.matches
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
    console.log 'display_intervention '+intervention_name
    self=this
    if not this.opened_intervention_list.includes intervention_name
      this.intervention_info = intervention_info = await get_intervention_info(intervention_name)
      this.opened_intervention_list.push intervention_name
      new_opened_intervention_list = JSON.parse JSON.stringify this.opened_intervention_list
      this.set('opened_intervention_list', [])
      this.set('opened_intervention_list', new_opened_intervention_list)
      once_true ->
        self.js_editors[intervention_name]?
      , ->
        self.js_editors[intervention_name].setValue(intervention_info.code)
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
    console.log 'info_clicked for '+this.get_intervention_name()+' completed...'
  modify_intervention_info: (data) ->>
    self=this
    intervention_info=await get_intervention_info(data.old_intervention_name)
    intervention_info={
      name:data.new_intervention_name
      description: data.new_intervention_description
      domain: data.new_goal_info.domain
      preview: data.new_goal_info.preview ? data.new_goal_info.homepage
      matches: data.new_goal_info.matches
      sitename: data.new_goal_info.sitename
      sitename_printable: data.new_goal_info.sitename_printable
      custom: true
      code: intervention_info.code
      content_scripts:intervention_info.code
      goals: [data.new_goal_info.name]  
    }
    console.log 'modify_intervention_info'
    console.log intervention_info 
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
    */
    """
    intervention_info={
      name: new_intervention_name
      description: new_intervention_data.intervention_description
      domain: goal_info.domain
      preview: goal_info.preview ? goal_info.homepage
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
    console.log('display_new_intervention for '+new_intervention_name+ ' completed...')
  refresh_intervention_list: ->>
    this.intervention_list = await list_custom_interventions()
    #if this.intervention_list.length == 0
    #  this.prompt_new_intervention()
  preview_intervention: ->>
    self=this
    if not (await this.save_intervention())
      return
    intervention_name=self.get_intervention_name()
    intervention_info=await get_intervention_info(intervention_name)
    console.log intervention_info.goals[0].preview
    set_override_enabled_interventions_once intervention_name
    chrome.tabs.create {url: intervention_info.preview}
  debug_intervention: ->>
    if not (await this.save_intervention())
      return
    intervention_name = this.get_intervention_name()
    set_override_enabled_interventions_once intervention_name
    intervention_info=await get_intervention_info(intervention_name)
    preview_page = intervention_info.preview
    tab = await new Promise -> chrome.tabs.create {url: preview_page}, it
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
    console.log 'debug_intervention for '+intervention_name
  hide_or_show_sidebar: ->
    if this.S('#sidebar').is(":visible")
      this.S('#sidebar').hide()
    else
      this.S('#sidebar').show()
  help_clicked: ->
    chrome.tabs.create {url: 'https://habitlab.github.io/devdocs'}
  share_clicked: ->
    chrome.tabs.create {url: 'https://habitlab.github.io/share'}
  make_javascript_editor: (editor_div) ->>
    console.log 'make_javascript_editor called'
    intervention_name = editor_div.intervention_tab_name
    if intervention_name?
      self = this
      if self.js_editors[intervention_name]?
        return
      brace = await SystemJS.import('brace')
      await SystemJS.import('brace/mode/javascript')
      # await SystemJS.import('brace/theme/monokai')
      self.js_editors[intervention_name] = js_editor = brace.edit(editor_div)
      js_editor.getSession().setMode('ace/mode/javascript')
      js_editor.getSession().setTabSize(2)
      js_editor.getSession().setUseSoftTabs(true)
      # js_editor.setTheme('ace/theme/monokai')
      js_editor.$blockScrolling = Infinity
      self.intervention_info = intervention_info = await get_intervention_info(intervention_name)
      js_editor.setValue(intervention_info.code)
      js_editor.on 'change', ->
        self.js_editor_changed()
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
    brace = await SystemJS.import('brace')
    await SystemJS.import('brace/mode/javascript')
    all_goals = await get_goals()    
    #enabled_goals = as_array(await get_enabled_goals())
    #self.goal_info_list = [all_goals[x] for x in enabled_goals]
    goals_list = await list_all_goals()
    self.goal_info_list = [all_goals[x] for x in goals_list]
    await load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
    await self.refresh_intervention_list()
    setTimeout ->
      # if self.intervention_info?edit_mode?
      #   self.set_edit_mode(self.intervention_info.edit_mode)
      self.no_unsaved_changes()
    , 500
    self.once_available_multiselect '.javascript_editor_div', (editor_divs) ->
      for editor_div in editor_divs
        self.make_javascript_editor(editor_div)
    new_intervention_info = localStorage.getItem('intervention_editor_new_intervention_info')
    if new_intervention_info?
      new_intervention_info = JSON.parse new_intervention_info
      console.log 'new_intervention_info'+new_intervention_info
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
    /*
    once_true(-> self?intervention_info?code?
    , ->>
      await compile_intervention_code(self.intervention_info)
      clear_cache_all_interventions()
      get_interventions()
    )
    */
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
    'SM'
    'once_available'
    'once_available_multiselect'
  ]
}