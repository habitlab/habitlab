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

# {get_goal_info} = require 'libs_common/goal_utils'
swal = require 'sweetalert2'

# get_livescript = memoizeSingleAsync ->>
#   await SystemJS.import('livescript15')

# check_for_livescript_errors = (ls_text) ->>
#   ls_compiler = await get_livescript()
#   try
#     js_text = ls_compiler.compile(ls_text, {bare: true, header: false})
#     return false
#   catch e
#     swal {
#       title: 'livescript compile error'
#       text: e.message
#       type: 'error'
#     }
#     return true

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
    if this.$.intervention-tabs?
      console.log('get_intervention_name through intervention-tabs: '+this.$.intervention-tabs.selectedItem.intervention_tab_name)
      return this.$.intervention-tabs.selectedItem.intervention_name
    else  
      console.log('get_intervention_name through intervention_selector: '+this.$.intervention_selector.selectedItem.intervention_name)
      return this.$.intervention_selector.selectedItem.intervention_name
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
    code = this.js_editor.getSession().getValue().trim()
    # lscode = this.ls_editor.getSession().getValue().trim()
    # edit_mode = this.get_edit_mode()
    goal_info = this.$.goal_selector.selectedItem.goal_info
    intervention_info = {
      code: code
      name: this.get_intervention_name()
      displayname: this.get_intervention_name()
      description: this.$.intervention_description.value
      domain: [goal_info.domain]
      preview: [goal_info.domain]
      matches: [goal_info.domain]
      sitename: goal_info.sitename
      sitename_printable: goal_info.sitename_printable
      goals: [goal_info.name]
      custom: true
    }
    if not (await compile_intervention_code(intervention_info))
      return false
    #if not (await add_requires_to_intervention_info(intervention_info))
    #  return false
    # if lscode.length > 0 and (intervention_info.edit_mode == 'ls' or intervention_info.edit_mode == 'ls_and_js')
    #   intervention_info.livescript_code = lscode
    console.log('save_intervention')
    this.intervention_info = intervention_info
    console.log('add_new_intervention')
    await add_new_intervention(intervention_info)
    this.no_unsaved_changes()
    return true
  display_intervention_tab_by_name: (intervention_name) ->
    intervention_idx = this.intervention_list.indexOf(intervention_name)
    console.log(intervention_idx)
  selected_intervention_tab_changed: (change_info)->
    intervention_name = change_info.detail.item.intervention_tab_name
    console.log('selected_intervention_tab_changed'+intervention_name)
    # this.intervention_info = intervention_info = await get_intervention_info(intervention_name)    
    # this.js_editor.setValue(intervention_info.code)
  intervention_selector_changed: (change_info) ->>
    intervention_name = change_info.detail.item.intervention_name
    this.intervention_info = intervention_info = await get_intervention_info(intervention_name)
    # goal_name = intervention_info.goals[0]
    # if (typeof(goal_name) != 'string') and goal_name.name?
    #   goal_name = goal_name.name
    # goal_names_list = this.goal_info_list.map (.name)
    # goal_idx = goal_names_list.indexOf(goal_name)
    # this.$.goal_selector.selected = goal_idx
    # edit_mode_name_to_idx = {
    #   js: 0
    #   ls: 1
    #   ls_and_js: 2
    # }
    # edit_mode_idx = edit_mode_name_to_idx[intervention_info.edit_mode] ? 0
    # this.$.language_selector.selected = edit_mode_idx
    # this.set_edit_mode intervention_info.edit_mode
    this.js_editor.setValue(intervention_info.code)
    this.display_intervention_tab_by_name(intervention_name)
    # if intervention_info.livescript_code?
    #   this.ls_editor.setValue(intervention_info.livescript_code)
  # language_selector_changed: (change_info) ->>
  #   lang = change_info.detail.item.lang
  #   this.set_edit_mode(lang)
  # get_edit_mode: ->
  #   return this.$.language_selector.selectedItem.lang

  set_edit_mode: (lang) ->
    self = this
    # lse = this.S('#livescript_editor')
    jse = this.S('#javascript_editor')
    if not this.ls_editor? or not this.js_editor
      setTimeout ->
        self.set_edit_mode(lang)
      , 500
      return
    # lslen = this.ls_editor.getSession().getLength()
    jslen = this.js_editor.getSession().getLength()
    if lang == 'ls_and_js'
      jse.css {
        width: '50vw'
        left: '50vw'
        display: 'inline-block'
      }
      # lse.css {
      #   width: '50vw'
      #   left: '0px'
      #   display: 'inline-block'
      # }
      self.js_editor.focus()
      self.js_editor.setValue(self.js_editor.getValue())
      self.js_editor.gotoLine(jslen)
      # self.ls_editor.focus()
      # self.ls_editor.setValue(self.ls_editor.getValue())
      # self.ls_editor.gotoLine(lslen)
      self.js_editor.setReadOnly(true)
      # self.ls_editor.setReadOnly(false)
    # else if lang == 'ls'
    #   jse.css {
    #     width: '0px'
    #     left: '0px'
    #     display: 'none'
    #   }
    #   lse.css {
    #     width: '100vw'
    #     left: '0px'
    #     display: 'inline-block'
    #   }
    #   self.ls_editor.focus()
    #   self.ls_editor.setValue(self.ls_editor.getValue())
    #   self.ls_editor.gotoLine(lslen)
    #   self.js_editor.setReadOnly(true)
    #   self.ls_editor.setReadOnly(false)
    else if lang == 'js'
      jse.css {
        width: '100vw'
        left: '0px'
        display: 'inline-block'
      }
      # lse.css {
      #   width: '0px'
      #   left: '50vw'
      #   display: 'none'
      # }
      self.js_editor.focus()
      self.js_editor.setValue(self.js_editor.getValue())
      self.js_editor.gotoLine(jslen)
      # self.ls_editor.setReadOnly(true)
      self.js_editor.setReadOnly(false)
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
    remove_custom_intervention(intervention_name)
    await this.refresh_intervention_list()
    this.$.intervention_selector.selected = 0
  goal_selector_changed: (change_info) ->>
    # console.log('intervention_info '+intervention_info)
    if not this.intervention_info?
      return
    console.log('this.intervention_info '+this.intervention_info)
    goal_info = change_info.detail.item.goal_info
    goal_name = this.intervention_info.goals[0]
    if goal_info.name == goal_name
      this.$.intervention_domain.value = this.intervention_info.domain
      this.$.intervention_preview_url.value = this.intervention_info.preview
      return
    this.$.intervention_domain.value = goal_info.domain
    preview_page = goal_info.preview ? goal_info.homepage
    this.$.intervention_preview_url.value = preview_page
  add_new_intervention_clicked: ->
    this.$$('#create_new_intervention_dialog').open()
  plus_clicked: ->
    this.$$('#open_existing_custom_intervention').open()

  validate_intervention_name: ->>
    proposed_intervention_name=this.$.intervention_name.value
    if proposed_intervention_name.indexOf(' ') != -1
      document.getElementById('hint').innerHTML = 'Cannot contain spaces'
      return
    if proposed_intervention_name == ''
      document.getElementById('hint').innerHTML = 'Must be non-empty'
      return
    all_interventions = await list_all_interventions()
    if all_interventions.indexOf(proposed_intervention_name) != -1
      document.getElementById('hint').innerHTML = 'An intervention with this name already exists'
      return
    this.$$('#create_new_intervention_dialog').close()
    this.display_new_intervention()
  display_new_intervention: ->> 
    new_intervention_name=this.$.intervention_name.value
    goal_info = this.$.goal_selector.selectedItem.goal_info
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
      description: this.$.intervention_description.value
      domain: [goal_info.domain]
      preview: [goal_info.domain]
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
    this.display_intervention_tab_by_name(new_intervention_name)
    # this.select_intervention_by_name(new_intervention_name)
  prompt_new_intervention: ->>
    self = this
    new_intervention_name = null
    cancelable = this.intervention_list.length > 0
    all_interventions = await list_all_interventions()
    while true
      try
        new_intervention_name := await swal {
          title: 'Enter a new intervention name'
          input: 'text'
          inputValue: 'my_custom_intervention'
          showCancelButton: true
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
    all_goals = await get_goals()
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
      sitename: 'buzzfeed'
      sitename_printable: 'Buzzfeed'
      code: js_code
      content_scripts: [
        {
          code: """
          (async function() {
            var swal = require("sweetalert2");
            await require("libs_common/content_script_utils").load_css_file("sweetalert2");
            swal({title: "Hello World", text: "This is a sample intervention"});
          })()
          """
          jspm_require: true
          #jspm_deps: [
          #  'sweetalert2'
          #  'libs_common/content_script_utils'
          #]
        }
      ]
      # livescript_code: comment_section + '''

      # swal = require_package('sweetalert2')

      # swal({
      #   title: 'Hello World'
      #   text: 'This is a sample intervention'
      # })
      # '''
      # edit_mode: 'js'
      # goals: [
      #   'buzzfeed/spend_less_time'
      # ]
      # custom: true
    }
    await add_new_intervention(intervention_info)
    await this.refresh_intervention_list()
    # this.select_intervention_by_name(new_intervention_name)

  select_intervention_by_name: (intervention_name) ->
    intervention_idx = this.intervention_list.indexOf(intervention_name)
    this.$.intervention_selector.selected = intervention_idx
  refresh_intervention_list: ->>
    this.intervention_list = await list_custom_interventions()
    #if this.intervention_list.length == 0
    #  this.prompt_new_intervention()
  preview_intervention: ->>
    if not (await this.save_intervention())
      return
    preview_url=[this.$.goal_selector.selectedItem.goal_info.preview]
    swal(
      input: 'text'
      showCancelButton: true
      confirmButtonText: 'PREVIEW'
      allowOutsideClick: false
      inputValue: preview_url
      ).then (text) ->
      intervention_name = this.get_intervention_name()
      set_override_enabled_interventions_once intervention_name
      chrome.tabs.create {url: text}
      return
    # intervention_name = this.get_intervention_name()
    # set_override_enabled_interventions_once intervention_name
    # preview_page = this.$.intervention_preview_url.value
    # chrome.tabs.create {url: preview_page}
  debug_intervention: ->>
    if not (await this.save_intervention())
      return
    intervention_name = this.get_intervention_name()
    set_override_enabled_interventions_once intervention_name
    preview_page = this.$.intervention_preview_url.value
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
  hide_or_show_sidebar: ->
    if this.S('#sidebar').is(":visible")
      this.S('#sidebar').hide()
    else
      this.S('#sidebar').show()
  help_clicked: ->
    chrome.tabs.create {url: 'https://habitlab.github.io/devdocs'}
  share_clicked: ->
    chrome.tabs.create {url: 'https://habitlab.github.io/share'}
  ready: ->>
    self = this
    brace = await SystemJS.import('brace')
    await SystemJS.import('brace/mode/javascript')
    # await SystemJS.import('brace/mode/livescript')
    # await SystemJS.import('brace/theme/monokai')
    self.js_editor = js_editor = brace.edit(this.$.javascript_editor)
    js_editor.getSession().setMode('ace/mode/javascript')
    js_editor.getSession().setTabSize(2)
    js_editor.getSession().setUseSoftTabs(true)
    # js_editor.setTheme('ace/theme/monokai')
    js_editor.$blockScrolling = Infinity
    js_editor.on 'change', ->
      self.js_editor_changed()
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
    once_true(-> self?intervention_info?code?
    , ->>
      await compile_intervention_code(self.intervention_info)
      clear_cache_all_interventions()
      get_interventions()
    )
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'S'
  ]
}
