{
  list_all_interventions
  get_intervention_info
} = require 'libs_backend/intervention_utils'

{
  get_goal_info
} = require 'libs_backend/goal_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'create-intervention-dialog'
  properties: {
    goal_info_list: {
      type: Array
    }
    current_goal:{
      type: String
    }
    current_intervention:{
      type: String
      value: ''
    }
    intervention_list: {
      type: Array
    }
  }
  open_create_new_intervention_dialog: ->
    if this.current_goal?
      goal_names_list = this.goal_info_list.map (.name)
      this.$.goal_selector.selected = goal_names_list.indexOf(this.current_goal)
    this.$$('#create_new_intervention_dialog').open()
  open_existing_custom_intervention_dialog: ->
    this.$$('#open_existing_custom_intervention').open()
  open_edit_intervention_info_dialog: ->>
    intervention_info=await get_intervention_info(this.current_intervention)
    goal_name=intervention_info.goals[0]
    goal_names_list = this.goal_info_list.map (.name)
    this.$.goal_selector.selected = goal_names_list.indexOf(goal_name)    
    this.$.intervention_description.value=intervention_info.description
    this.$.intervention_name.value=intervention_info.name
    preview_url = intervention_info.preview
    if not preview_url?
      goal_info = await get_goal_info(intervention_info.goals[0])
      preview_url = goal_info.preview ? ('https://' + goal_info.domain + '/')
    this.$.preview_url.value=preview_url
    this.$.dialog_button.innerHTML='MODIFY'
    this.$$('#create_new_intervention_dialog').open()
  validate_intervention_name: ->>
    self=this
    proposed_intervention_name=this.$.intervention_name.value
    if proposed_intervention_name.indexOf(' ') != -1
      self.$$('#hint').innerHTML = 'Cannot contain spaces'
      return
    if proposed_intervention_name == ''
      self.$$('#hint').innerHTML = 'Must be non-empty'
      return
    all_interventions = await list_all_interventions()
    if self.current_intervention!='' 
      console.log 'in modify mode'
      if all_interventions.indexOf(proposed_intervention_name) != all_interventions.indexOf(this.current_intervention) && all_interventions.indexOf(proposed_intervention_name)!=-1
        self.$$('#hint').innerHTML = 'An intervention with this name already exists'
        return
      self.fire('modify_intervention_info', {
        old_intervention_name: self.current_intervention
        new_intervention_name: proposed_intervention_name
        new_goal_info: self.$.goal_selector.selectedItem.goal_info
        new_intervention_description:self.$.intervention_description.value
        new_preview: self.$.preview_url.value
      })
      self.current_intervention=''
      self.goToTab()  
    else
      if all_interventions.indexOf(proposed_intervention_name) != -1
        self.$$('#hint').innerHTML = 'An intervention with this name already exists'
        return        
      console.log 'create new intervention mode'
      self.fire('display_new_intervention', {
        goal_info: self.$.goal_selector.selectedItem.goal_info
        intervention_name: self.$.intervention_name.value
        intervention_description: self.$.intervention_description.value
        preview_url: self.$.preview_url.value
      })
      # self.goToTab()
      chrome.tabs.create url: chrome.extension.getURL('index.html?tag=intervention-editor')
    self.$$('#create_new_intervention_dialog').close()
    window.close()
  goToTab: ->
    chrome.tabs.getAllInWindow undefined, (tabs) ->
      for i from 0 to tabs.length-1
        if tabs[i].url==chrome.extension.getURL('index.html?tag=intervention-editor')
          chrome.tabs.update(tabs[i].id,{selected:true})
          console.log 'tab update '+i
          return
      chrome.tabs.create url: chrome.extension.getURL('index.html?tag=intervention-editor')
      return
  open_intervention_clicked: ->>
    this.fire('display_intervention',{
      intervention_name:this.$.intervention_selector.selectedItem.intervention_name
    })
    this.$$('#open_existing_custom_intervention').close()
  goal_selector_changed: (change_info) ->
    goal_info=change_info.detail.item.goal_info
    this.$.preview_url.value=goal_info.preview ? goal_info.homepage
}
