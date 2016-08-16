{cfy} = require 'cfy'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'pill-button-group'
  properties: {
    buttons: {
      type: Array
      value: []
      #observer: 'buttons_changed'
    }
    selected_idx: {
      type: Number
      value: 0
    }
  }
  compute_class: (index, selected_idx, buttons) ->
    output = ['paperpillbutton']
    if index == 0
      output.push 'paperpillbuttonfirst'
    else if index == buttons.length - 1
      output.push 'paperpillbuttonlast'
    else
      output.push 'paperpillbuttonmiddle'
    if index == selected_idx
      output.push 'paperpillbuttonselected'
    return output.join ' '
  buttonclicked: (evt) ->
    buttonidx = parseInt evt.target.buttonidx
    this.selected_idx = buttonidx
    this.fire 'pill-button-selected', {buttonidx: buttonidx}
}
