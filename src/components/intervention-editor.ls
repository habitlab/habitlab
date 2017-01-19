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
  feedback_button_clicked: ->
    System.import('bugmuncher/bugmuncher').then ->
      window.open_bugmuncher()
  get_url: ->
    return chrome.extension.getURL('icons/feedback_icon.svg')
}
