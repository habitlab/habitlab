{polymer_ext} = require 'libs_frontend/polymer_utils'

{
  list_all_goals
  get_goals
} = require 'libs_backend/goal_utils'

{
  get_interventions
  list_custom_interventions
} = require('libs_common/intervention_utils')

polymer_ext {
  is: 'intervention-editor-onboard'
  properties:{
    templates_info_list:{
      type:Array
    }
    custom_intervention_list:{
      type:Array
    }
  }
  open_template: (evt)->
    localStorage.setItem('intervention_editor_open_template_name',JSON.stringify(evt.model.template_name.name))
    chrome.tabs.create url: chrome.extension.getURL('index.html?tag=intervention-editor')
  open_custom_intervention: (evt)->
    localStorage.setItem('intervention_editor_open_intervention_name',JSON.stringify(evt.model.intervention_name))
    chrome.tabs.create url: chrome.extension.getURL('index.html?tag=intervention-editor')
  add_new_clicked: ->>
    self = this
    create_intervention_dialog = document.createElement('create-intervention-dialog')
    document.body.appendChild(create_intervention_dialog)
    all_goals=await get_goals()
    goals_list= await list_all_goals()
    create_intervention_dialog.goal_info_list = [all_goals[x] for x in goals_list]
    create_intervention_dialog.open_create_new_intervention_dialog()
    create_intervention_dialog.addEventListener 'display_new_intervention', (evt) ->
      localStorage.setItem('intervention_editor_new_intervention_info', JSON.stringify(evt.detail))
  ready: ->>
    all_interventions=await get_interventions()
    templates_list=['generic/make_user_wait',"generic/toast_notifications","iqiyi/prompt_before_watch","iqiyi/remove_sidebar_links","netflix/infinite_alarm","netflix/link_articles","facebook/remove_news_feed","facebook/rich_notifications"]
    this.templates_info_list=[all_interventions[x] for x in templates_list]
    this.custom_intervention_list=await list_custom_interventions()
    writing_interventions_text = await fetch("https://raw.githubusercontent.com/wiki/habitlab/habitlab/Writing-Interventions.md").then((.text!))
    writing_interventions_text = writing_interventions_text.slice(writing_interventions_text.indexOf('#'))
    this.$.markdown_display.markdown = writing_interventions_text
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
  ]
}